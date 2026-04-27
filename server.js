const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4174);
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5";
const allowedAiActions = new Set(["summarizeProject", "analyzeDocument"]);

function send(res, status, body, type = "application/json") {
  res.writeHead(status, {
    "content-type": `${type}; charset=utf-8`,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_200_000) {
        reject(new Error("Payload trop volumineux. Limite de démonstration : 1,2 Mo."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON invalide."));
      }
    });
  });
}

function money(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("fr-FR")} €`;
}

function sanitizePayload(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Payload manquant.");
  if (!allowedAiActions.has(payload.action)) {
    throw new Error("Action IA non autorisée. Actions disponibles : summarizeProject, analyzeDocument.");
  }
  return {
    action: payload.action,
    projectId: String(payload.projectId || ""),
    role: ["admin", "collaborator", "client"].includes(payload.role) ? payload.role : "client",
    audience: payload.audience === "client" ? "client" : "agency",
    documentType: ["invoice", "quote", "other"].includes(payload.documentType) ? payload.documentType : "other",
    documentText: String(payload.documentText || "").slice(0, 90000),
    context: payload.context && typeof payload.context === "object" ? payload.context : {}
  };
}

function publicContext(context, role, audience) {
  const copy = JSON.parse(JSON.stringify(context || {}));
  if (role === "client" || audience === "client") {
    delete copy.internal;
    if (copy.project) {
      delete copy.project.profitability;
      delete copy.project.fees;
      delete copy.project.feesBilled;
      delete copy.project.timeEstimated;
      delete copy.project.spentHours;
    }
    if (copy.budget) delete copy.budget.internalMargin;
  }
  return copy;
}

function summarizeFromContext(payload) {
  const context = publicContext(payload.context, payload.role, payload.audience);
  const project = context.project || {};
  const budget = context.budget || {};
  const decisions = Array.isArray(context.decisions) ? context.decisions : [];
  const reports = Array.isArray(context.reports) ? context.reports : [];
  const documents = Array.isArray(context.documents) ? context.documents : [];
  const products = Array.isArray(context.products) ? context.products : [];
  const sitePoints = Array.isArray(context.sitePoints) ? context.sitePoints : [];
  const pendingDecisions = decisions.filter((item) => String(item.status || "").includes("attente") || String(item.status || "").includes("À"));
  const overBudget = Number(budget.engaged || 0) > Number(budget.validated || budget.planned || 0);
  const lines = [
    `Projet : ${project.name || payload.projectId || "non renseigné"}.`,
    `Phase actuelle : ${project.phase || "non renseignée"} avec un avancement indiqué à ${project.progress ?? "n/a"} %.`,
    `Budget : ${money(budget.engaged)} engagés sur ${money(budget.validated || budget.planned)} validés, reste estimé ${money(budget.remaining)}.`,
    `Décisions en attente : ${pendingDecisions.length}. Documents disponibles dans le contexte : ${documents.length}. Produits suivis : ${products.length}.`,
    `Derniers comptes rendus : ${reports.slice(0, 2).map((item) => item.title).filter(Boolean).join(", ") || "aucun compte rendu transmis dans le contexte"}.`,
    `Points chantier ouverts : ${sitePoints.filter((item) => !["Résolu", "Archivé"].includes(item.status)).length}.`,
    overBudget ? "Point d'attention : le budget engagé dépasse le budget validé fourni." : "Point d'attention : aucun dépassement budgétaire détecté dans les données fournies."
  ];
  if (context.internal) {
    const tasks = Array.isArray(context.internal.tasks) ? context.internal.tasks : [];
    const profitability = context.internal.profitability || {};
    lines.push(`Interne agence : ${tasks.filter((task) => task.status !== "Terminé").length} tâches ouvertes, rentabilité estimée ${profitability.level || "non calculée"}.`);
  }
  return lines.join("\n");
}

function parseAmount(raw) {
  if (!raw) return 0;
  const normalized = String(raw).replace(/\s/g, "").replace(",", ".");
  return Number.parseFloat(normalized) || 0;
}

function analyzeDocumentLocally(payload) {
  const text = payload.documentText || "";
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const supplier = (
    lines.find((line) => /fournisseur|vendeur|entreprise|soci[eé]t[eé]|devis de|facture de/i.test(line)) ||
    lines[0] ||
    (payload.documentType === "quote" ? "Entreprise à vérifier" : "Fournisseur à vérifier")
  ).replace(/^(fournisseur|vendeur|entreprise|soci[eé]t[eé]|facture de|devis de)\s*[:\-]?\s*/i, "").slice(0, 80);
  const dateMatch = text.match(/\b(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/);
  const vatMatch = text.match(/(?:tva|taxe)\D{0,20}(\d[\d\s.,]*)\s*€?/i);
  const totalMatch = text.match(/(?:total\s*(?:ttc)?|montant\s*(?:ttc)?|net à payer)\D{0,30}(\d[\d\s.,]*)\s*€?/i);
  const extractedLines = lines
    .map((line) => {
      const match = line.match(/^(.{4,80}?)\s+(?:x\s*\d+\s+)?(\d[\d\s.,]*)\s*€?\s*(?:ttc|ht)?$/i);
      if (!match || /total|tva|acompte|solde/i.test(line)) return null;
      const name = match[1].replace(/[-:;]+$/g, "").trim();
      const amount = parseAmount(match[2]);
      if (!name || !amount) return null;
      const category = /peinture|enduit|parquet|carrelage|plomberie|electric|électric|menuiserie|pose|travaux/i.test(name) ? "Travaux" : "Mobilier";
      const room = /salon/i.test(name) ? "Salon" : /chambre/i.test(name) ? "Chambre" : /cuisine/i.test(name) ? "Cuisine" : /bain|sdb/i.test(name) ? "Salle de bain" : "À classer";
      return { name, category, room, amount };
    })
    .filter(Boolean);

  const fallbackLines = payload.documentType === "quote"
    ? [
        { name: "Travaux préparatoires", category: "Travaux", room: "À classer", amount: 1850 },
        { name: "Fourniture et pose matériaux", category: "Travaux", room: "À classer", amount: 4200 }
      ]
    : [
        { name: "Console bois naturel", category: "Mobilier", room: "Entrée", amount: 690 },
        { name: "Suspension laiton", category: "Luminaire", room: "Salon", amount: 240 },
        { name: "Tapis laine écru", category: "Décoration", room: "Salon", amount: 520 }
      ];
  const documentLines = extractedLines.length ? extractedLines : fallbackLines;
  const computedTotal = documentLines.reduce((sum, line) => sum + Number(line.amount || 0), 0);

  return {
    supplier,
    date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString("fr-FR"),
    total: totalMatch ? parseAmount(totalMatch[1]) : computedTotal,
    vat: vatMatch ? parseAmount(vatMatch[1]) : Math.round(computedTotal * 0.2),
    lines: documentLines,
    confidence: extractedLines.length ? "Extraction depuis le texte fourni" : "Simulation démo à vérifier"
  };
}

async function callOpenAI(payload, localExtraction) {
  if (!apiKey) return null;
  const aiPayload = {
    ...payload,
    context: publicContext(payload.context, payload.role, payload.audience),
    localExtraction
  };
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: [
        "Tu es l'IA contrôlée du portail Esprit Design Architecture.",
        "Tu n'as que deux fonctions : synthèse projet et analyse documentaire.",
        "Réponds en français, uniquement avec les données fournies.",
        "N'invente jamais une information absente.",
        "Si le rôle ou l'audience est client, n'inclus jamais rentabilité, marge, temps passé, notes internes ou données confidentielles.",
        "Pour une analyse documentaire, présente un résultat vérifiable et rappelle que l'utilisateur doit confirmer avant intégration."
      ].join("\n"),
      input: JSON.stringify(aiPayload, null, 2)
    })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Erreur OpenAI.");
  return data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("\n").trim();
}

async function handleAi(payload) {
  const clean = sanitizePayload(payload);
  if (clean.action === "summarizeProject") {
    const fallback = summarizeFromContext(clean);
    const text = await callOpenAI(clean).catch(() => null);
    return { mode: text ? "openai" : "demo", model: text ? model : undefined, text: text || `Mode démo IA : synthèse générée localement à partir des données fournies.\n${fallback}` };
  }
  const extraction = analyzeDocumentLocally(clean);
  const text = await callOpenAI(clean, extraction).catch(() => null);
  return {
    mode: text ? "openai" : "demo",
    model: text ? model : undefined,
    text: text || "Mode démo IA : extraction locale vérifiable. Validez avant d'ajouter les lignes au projet.",
    extraction
  };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/ai") {
      const payload = await readJson(req);
      const result = await handleAi(payload);
      send(res, 200, result);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, { error: "Méthode non autorisée." });
      return;
    }

    const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const normalized = path.normalize(requested).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, normalized);
    if (!filePath.startsWith(root)) {
      send(res, 403, { error: "Accès refusé." });
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        send(res, 404, "Not found", "text/plain");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".svg": "image/svg+xml"
      };
      send(res, 200, req.method === "HEAD" ? "" : content, types[ext] || "application/octet-stream");
    });
  } catch (error) {
    send(res, 500, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Esprit Design V2 running on http://127.0.0.1:${port}`);
  console.log(apiKey ? `AI enabled with ${model}` : "AI demo mode: set OPENAI_API_KEY to enable OpenAI.");
});
