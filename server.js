const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4174);
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5";

function send(res, status, body, type = "application/json") {
  res.writeHead(status, {
    "content-type": `${type}; charset=utf-8`,
    "cache-control": "no-store"
  });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload trop volumineux."));
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

function fallbackAi(payload) {
  const prompt = String(payload.prompt || "");
  const context = payload.context || {};
  const project = context.project || {};
  const projects = context.projects || [];
  const products = context.products || [];
  const risks = projects.filter((item) => item.health === "risk").map((item) => item.name);
  return [
    `Mode démo IA : aucune clé OPENAI_API_KEY n'est configurée sur le serveur local.`,
    project.name ? `Projet analysé : ${project.name}, phase ${project.phase}, action prioritaire : ${project.action}.` : `Portefeuille analysé : ${projects.length} projets.`,
    risks.length ? `Risques détectés : ${risks.join(", ")}.` : "Aucun risque majeur détecté dans les données disponibles.",
    `Achats en attente : ${products.filter((item) => item.status === "À valider").length}.`,
    prompt ? `Réponse à la demande : ${prompt}` : "Prochaine étape : préciser la demande IA."
  ].join("\n");
}

async function callOpenAI(payload) {
  if (!apiKey) {
    return { text: fallbackAi(payload), mode: "demo" };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions: [
        "Tu es l'assistant IA intégré du cockpit Esprit Design Architecture.",
        "Tu aides une architecte d'intérieur à piloter des projets client.",
        "Réponds en français, de façon concise, opérationnelle et structurée.",
        "Utilise uniquement les données fournies dans le contexte."
      ].join("\n"),
      input: JSON.stringify(payload, null, 2)
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Erreur OpenAI.");
  }

  const text = data.output_text || data.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("\n").trim();
  return { text: text || "Aucune réponse générée.", mode: "openai", model };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "POST" && url.pathname === "/api/ai") {
      const payload = await readJson(req);
      const result = await callOpenAI(payload);
      send(res, 200, result);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      send(res, 405, { error: "Méthode non autorisée." });
      return;
    }

    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.join(root, path.normalize(requested).replace(/^(\.\.[/\\])+/, ""));
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
      const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
      send(res, 200, req.method === "HEAD" ? "" : content, types[ext] || "application/octet-stream");
    });
  } catch (error) {
    send(res, 500, { error: error.message });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Esprit Design demo running on http://127.0.0.1:${port}`);
  console.log(apiKey ? `AI enabled with ${model}` : "AI demo mode: set OPENAI_API_KEY to enable real AI.");
});
