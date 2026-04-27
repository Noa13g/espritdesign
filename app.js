const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const palette = {
  brown: "#947a69",
  moss: "#9ea882",
  obsidian: "#706b75",
  cool: "#d3d0cd",
  beige: "#f4ebe4"
};

const state = {
  role: "public",
  activeProjectId: "london",
  view: "cockpit",
  selectedProjectId: "london",
  demoUser: null,
  viewMode: "table",
  clientValidator: "Client London"
};

const roles = {
  admin: {
    label: "Admin / Agence",
    canSeeFinancials: true,
    canSeeProfitability: true,
    canPublish: true,
    canEdit: true,
    seesInternalDocs: true,
    projects: "all"
  },
  collaborator: {
    label: "Collaborateur",
    canSeeFinancials: false,
    canSeeProfitability: false,
    canPublish: false,
    canEdit: true,
    seesInternalDocs: false,
    projects: ["london", "foch", "levis"]
  },
  client: {
    label: "Client foyer",
    canSeeFinancials: false,
    canSeeProfitability: false,
    canPublish: false,
    canEdit: false,
    seesInternalDocs: false,
    projects: []
  }
};

const demoUsers = {
  "admin@esprit-design.fr": { password: "demo", role: "admin", name: "Emmanuelle Gobert" },
  "collaborateur@esprit-design.fr": { password: "demo", role: "collaborator", name: "Collaborateur agence", projects: ["london", "foch", "levis"] },
  "PROJET-LONDON": { password: "demo", role: "client", name: "Foyer London", projectId: "london" },
  "PROJET-LEVIS": { password: "demo", role: "client", name: "Foyer Lévis", projectId: "levis" }
};

const db = {
  clients: [
    { id: "c-london", firstName: "Claire", lastName: "Martin", email: "claire.martin@example.fr", phone: "06 12 45 78 90", address: "London", communication: "Email + portail", notes: "Aime les intérieurs modernes industriels, rangements invisibles.", projectIds: ["london"] },
    { id: "c-levis", firstName: "Anne", lastName: "Dupont", email: "anne.dupont@example.fr", phone: "06 84 32 11 09", address: "Paris 17e", communication: "Portail prioritaire", notes: "Projet haut de gamme, attention forte aux détails patrimoniaux.", projectIds: ["levis"] },
    { id: "c-foch", firstName: "Julien", lastName: "Robert", email: "julien.robert@example.fr", phone: "06 22 13 93 41", address: "Paris", communication: "Téléphone + portail", notes: "Besoin d'arbitrages rapides sur devis entreprises.", projectIds: ["foch"] },
    { id: "c-bali", firstName: "Nora", lastName: "Benali", email: "nora.benali@example.fr", phone: "06 50 78 71 11", address: "Location saisonnière", communication: "Email", notes: "Petit budget, effet coup de coeur attendu.", projectIds: ["bali"] },
    { id: "c-cabries", firstName: "Sophie", lastName: "Morel", email: "sophie.morel@example.fr", phone: "06 77 00 22 11", address: "Cabriès", communication: "Portail", notes: "Projet créé pour démontrer l'extension future.", projectIds: ["cabries"] }
  ],
  prospects: [
    { id: "p1", name: "Famille Garnier", contact: "garnier@example.fr", source: "Site web", type: "Rénovation maison", budget: 65000, deadline: "Septembre 2026", status: "Rendez-vous fixé", nextAction: "Préparer questionnaire découverte", notes: "Budget confortable, demande globale." },
    { id: "p2", name: "Mme Laurent", contact: "laurent@example.fr", source: "Instagram", type: "Décoration salon", budget: 9000, deadline: "Été 2026", status: "À rappeler", nextAction: "Appel découverte", notes: "Besoin simple, pas de CRM lourd." },
    { id: "p3", name: "SCI Parrines", contact: "sci@example.fr", source: "Recommandation", type: "Appartement locatif", budget: 32000, deadline: "Fin 2026", status: "Devis envoyé", nextAction: "Relance devis", notes: "Projet intéressant mais arbitrage budget." }
  ],
  projects: [
    { id: "london", name: "Projet London", clientId: "c-london", clientAccess: true, householdLogin: "PROJET-LONDON", address: "London", type: "Appartement type 1", phase: "Brief client", status: "Brief en cours", priority: "Normale", health: "ok", start: "2026-04-20", end: "2026-07-15", progress: 52, worksBudget: 8400, furnitureBudget: 11300, fees: 3000, feesBilled: 1200, timeEstimated: 44, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-42.png", description: "Aménagement sur-mesure d'un appartement type 1 dans un style moderne industriel, alliant fonctionnalité et esthétique contemporaine.", publicSummary: "Brief et ambiance moderne industrielle en cours de validation.", assigned: ["collaborator"] },
    { id: "levis", name: "Projet Lévis", clientId: "c-levis", clientAccess: true, householdLogin: "PROJET-LEVIS", address: "Paris 17e", type: "Appartement haussmannien", phase: "Suivi esthétique chantier", status: "Chantier en cours", priority: "Haute", health: "ok", start: "2026-01-15", end: "2026-06-28", progress: 74, worksBudget: 39000, furnitureBudget: 15000, fees: 7200, feesBilled: 5400, timeEstimated: 82, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-47.png", description: "Rénovation d'un appartement haussmannien de 54 m², conservation de l'âme du lieu et création d'un espace moderne, fonctionnel et modulable.", publicSummary: "Chantier en cours, mobilier modulable en suivi.", assigned: ["collaborator"] },
    { id: "foch", name: "Projet Foch", clientId: "c-foch", clientAccess: true, householdLogin: "PROJET-FOCH", address: "Paris", type: "Transformation logement", phase: "DCE / consultation entreprises", status: "Consultation entreprises", priority: "Haute", health: "risk", start: "2026-03-01", end: "2026-08-30", progress: 63, worksBudget: 31000, furnitureBudget: 15200, fees: 5200, feesBilled: 2500, timeEstimated: 68, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-41.png", description: "Transformation complète d'un logement une chambre en espace de vie confortable et contemporain.", publicSummary: "Comparaison des devis entreprises en cours.", assigned: ["collaborator"] },
    { id: "bali", name: "Projet Bali", clientId: "c-bali", clientAccess: false, householdLogin: "PROJET-BALI", address: "Location saisonnière", type: "Décoration", phase: "Livraison", status: "Livraison", priority: "Normale", health: "ok", start: "2026-02-01", end: "2026-05-03", progress: 92, worksBudget: 3800, furnitureBudget: 11100, fees: 2200, feesBilled: 2200, timeEstimated: 30, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-43.png", description: "Décoration d'un logement destiné à la location saisonnière avec un aménagement coup de coeur à petit budget.", publicSummary: "Livraison presque finalisée.", assigned: [] },
    { id: "cabries", name: "Projet Cabriès", clientId: "c-cabries", clientAccess: false, householdLogin: "MAISON-CABRIES", address: "Cabriès", type: "Maison familiale", phase: "Découverte / rendez-vous initial", status: "Prospect", priority: "Basse", health: "watch", start: "2026-05-10", end: "2026-11-20", progress: 12, worksBudget: 48000, furnitureBudget: 18000, fees: 6800, feesBilled: 0, timeEstimated: 75, image: "https://www.esprit-design-architecture.com/wp-content/uploads/2024/12/Sans-titre-700-x-600-px.png", description: "Projet de démonstration pour une maison familiale à Cabriès.", publicSummary: "Dossier découverte en préparation.", assigned: [] }
  ],
  phases: [
    "Découverte / rendez-vous initial", "Brief client", "APS", "APD", "DCE / consultation entreprises", "Arbitrages budget", "Préparation chantier", "Suivi esthétique chantier", "Livraison", "Clôture projet"
  ],
  phaseRecords: [
    { projectId: "london", name: "Découverte / rendez-vous initial", status: "Validé", start: "2026-04-20", end: "2026-04-24", realEnd: "2026-04-23", progress: 100, deliverables: "Questionnaire, contraintes, budget cible", validations: "Compte rendu découverte", internal: "Client réactif." },
    { projectId: "london", name: "Brief client", status: "En cours", start: "2026-04-24", end: "2026-05-02", realEnd: "", progress: 52, deliverables: "Brief validé, priorités, inspirations", validations: "Validation foyer", internal: "Clarifier rangements." },
    { projectId: "london", name: "APS", status: "À venir", start: "2026-05-03", end: "2026-05-18", realEnd: "", progress: 0, deliverables: "Zoning, moodboard, enveloppe", validations: "Go APD", internal: "" },
    { projectId: "levis", name: "Suivi esthétique chantier", status: "En cours", start: "2026-04-01", end: "2026-06-12", realEnd: "", progress: 74, deliverables: "Visites, comptes rendus, réserves", validations: "CR chantier", internal: "Surveiller menuiseries." },
    { projectId: "foch", name: "DCE / consultation entreprises", status: "En retard", start: "2026-04-05", end: "2026-04-27", realEnd: "", progress: 63, deliverables: "Dossier entreprises, devis comparés", validations: "Choix artisans", internal: "Un devis incomplet." }
  ],
  briefs: [
    { projectId: "london", version: "V1", status: "Envoyé au client", visibleClient: true, goals: "Créer un type 1 moderne industriel, très fonctionnel.", rooms: "Pièce de vie, coin nuit, cuisine, entrée", style: "Moderne industriel chaleureux", constraints: "Optimisation rangement, budget mobilier maîtrisé, intervention légère.", priorities: "Rangements, circulation, ambiance forte", inspirations: "Métal noir, bois chaud, textiles naturels", keep: "Sol existant si compatible", remove: "Meubles bas existants", arbitrations: "Budget mobilier plafonné à 11 300 €." },
    { projectId: "levis", version: "V2", status: "Validé", visibleClient: true, goals: "Préserver l'haussmannien et moderniser les usages.", rooms: "Salon, chambre, entrée", style: "Classique contemporain", constraints: "Conserver moulures et parquet", priorities: "Modularité", inspirations: "Tons doux, mobilier intégré", keep: "Parquet, cheminée", remove: "Cloisons secondaires", arbitrations: "Menuiserie sur mesure validée." }
  ],
  contracts: [
    { projectId: "london", type: "Devis honoraires", version: "V1", sent: "2026-04-22", signed: "", amount: 3000, status: "Envoyé", visibleClient: true, internal: "Acompte 40% attendu.", clientComment: "" },
    { projectId: "levis", type: "Contrat de mission", version: "V2", sent: "2026-01-16", signed: "2026-01-20", amount: 7200, status: "Signé", visibleClient: true, internal: "Mission complète.", clientComment: "Validé." }
  ],
  moodboards: [
    { id: "mb-london-1", projectId: "london", room: "Pièce de vie", name: "Industriel chaleureux", mood: "Moderne, graphique, doux", description: "Métal noir, bois, beige, textiles naturels.", colors: ["#947a69", "#9ea882", "#706b75", "#d3d0cd", "#f4ebe4"], materials: "Métal noir, chêne, lin, pierre claire", status: "Proposé", version: "V1", published: true, images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900&auto=format&fit=crop"] },
    { id: "mb-levis-1", projectId: "levis", room: "Salon", name: "Haussmannien apaisé", mood: "Élégant, patrimonial, doux", description: "Base claire, mobilier intégré.", colors: ["#f4ebe4", "#d3d0cd", "#947a69"], materials: "Bois peint, laiton discret", status: "Validé", version: "V2", published: true, images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop"] }
  ],
  visuals: [
    { projectId: "london", title: "Plan type 1 - zoning", type: "Plan mobilier", room: "Pièce de vie", phase: "Brief client", version: "V1", status: "Publié client", visibleClient: true, commentAgency: "Base de travail.", commentClient: "", date: "2026-04-26" },
    { projectId: "london", title: "Vue 3D ambiance salon", type: "Rendu 3D", room: "Salon", phase: "APS", version: "V0", status: "Brouillon", visibleClient: false, commentAgency: "À finaliser avant publication.", commentClient: "", date: "2026-04-28" },
    { projectId: "foch", title: "Plan projeté cuisine", type: "Plan cuisine", room: "Cuisine", phase: "APD", version: "V2", status: "À valider", visibleClient: true, commentAgency: "", commentClient: "", date: "2026-04-21" }
  ],
  products: [
    { id: "prod1", projectId: "london", room: "Salon", category: "Mobilier", name: "Table basse Pirita", supplier: "Kave Home", link: "https://example.com/table", image: "https://images.unsplash.com/photo-1532372320572-cda25653a694?q=80&w=500&auto=format&fit=crop", unitPrice: 669, qty: 1, delay: "2 semaines", status: "Proposé au client", agencyComment: "Compatible ambiance industrielle.", clientComment: "", visibleClient: true, buyer: "Agence", validationDate: "", validatedBy: "" },
    { id: "prod2", projectId: "london", room: "Séjour", category: "Mobilier", name: "Chaise Nebai", supplier: "Kave Home", link: "https://example.com/chaise", image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=500&auto=format&fit=crop", unitPrice: 329, qty: 2, delay: "3 semaines", status: "Validé", agencyComment: "", clientComment: "Validé pour nous", visibleClient: true, buyer: "Client", validationDate: "2026-04-27 10:20", validatedBy: "Claire" },
    { id: "prod3", projectId: "london", room: "Coin nuit", category: "Luminaire", name: "Suspension Uliar", supplier: "Maison Sarah Lavoine", link: "https://example.com/suspension", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=500&auto=format&fit=crop", unitPrice: 63.5, qty: 1, delay: "1 semaine", status: "À commander", agencyComment: "Petit budget, bon rendu.", clientComment: "", visibleClient: true, buyer: "Agence", validationDate: "", validatedBy: "" },
    { id: "prod4", projectId: "foch", room: "Cuisine", category: "Décoration", name: "Carrelage grand format", supplier: "Porcelanosa", link: "https://example.com/carrelage", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=500&auto=format&fit=crop", unitPrice: 2200, qty: 1, delay: "4 semaines", status: "Alternative demandée", agencyComment: "Dépassement possible.", clientComment: "Voir alternative moins chère.", visibleClient: true, buyer: "Agence", validationDate: "", validatedBy: "" }
  ],
  budgets: [
    { projectId: "london", lot: "Mobilier", room: "Salon", planned: 8200, validated: 7600, engaged: 1727, published: true, source: "Shopping list" },
    { projectId: "london", lot: "Luminaire", room: "Coin nuit", planned: 2400, validated: 2200, engaged: 63.5, published: true, source: "Shopping list" },
    { projectId: "london", lot: "Menuiserie", room: "Entrée", planned: 3300, validated: 3000, engaged: 900, published: false, source: "Devis" },
    { projectId: "london", lot: "Honoraires", room: "Global", planned: 3000, validated: 3000, engaged: 1200, published: true, source: "Contrat" },
    { projectId: "foch", lot: "Travaux", room: "Global", planned: 31000, validated: 28000, engaged: 18500, published: true, source: "Devis entreprises" },
    { projectId: "foch", lot: "Mobilier", room: "Salon", planned: 15200, validated: 12000, engaged: 7800, published: true, source: "Shopping list" },
    { projectId: "levis", lot: "Menuiserie", room: "Salon", planned: 18000, validated: 18000, engaged: 15900, published: true, source: "Devis signé" }
  ],
  quotes: [
    { id: "q1", projectId: "london", company: "Atelier Métal & Bois", lot: "Menuiserie", amount: 2980, status: "En analyse", file: "devis-menuiserie-london.pdf", received: "2026-04-26", validated: "", visibleClient: false, agencyComment: "Comparer avec option placard.", clientComment: "", phase: "APS" },
    { id: "q2", projectId: "foch", company: "Rénov Paris", lot: "Travaux", amount: 18500, status: "À valider", file: "devis-renov-paris.pdf", received: "2026-04-22", validated: "", visibleClient: true, agencyComment: "Bon rapport qualité/prix.", clientComment: "", phase: "DCE" }
  ],
  decisions: [
    { id: "d1", projectId: "london", title: "Valider moodboard industriel", description: "Confirmer l'ambiance générale avant APS.", type: "Moodboard", linkedId: "mb-london-1", version: "V1", requested: "2026-04-27", answered: "", status: "En attente", agencyComment: "Décision structurante.", clientComment: "", validatedBy: "", history: [] },
    { id: "d2", projectId: "london", title: "Chaise Nebai", description: "Validation achat de 2 chaises.", type: "Produit", linkedId: "prod2", version: "V1", requested: "2026-04-26", answered: "2026-04-27 10:20", status: "Validé", agencyComment: "", clientComment: "Validé pour nous", validatedBy: "Claire", history: [{ by: "Claire", at: "2026-04-27 10:20", status: "Validé", comment: "Validé pour nous", version: "V1" }] },
    { id: "d3", projectId: "foch", title: "Choix entreprise travaux", description: "Arbitrer entre deux devis.", type: "Devis", linkedId: "q2", version: "V1", requested: "2026-04-25", answered: "", status: "En attente", agencyComment: "Urgent pour planning.", clientComment: "", validatedBy: "", history: [] }
  ],
  tasks: [
    { id: "t1", projectId: "london", title: "Finaliser brief rangements", owner: "Emmanuelle", priority: "Haute", due: "2026-04-30", status: "En cours", internalOnly: true, phase: "Brief client", linkedDecision: "d1", comment: "Clarifier dimensions.", created: "2026-04-25", closed: "" },
    { id: "t2", projectId: "foch", title: "Comparer devis entreprises", owner: "Collaborateur", priority: "Haute", due: "2026-04-29", status: "Bloqué", internalOnly: true, phase: "DCE", linkedDecision: "d3", comment: "Un devis incomplet.", created: "2026-04-24", closed: "" }
  ],
  sitePoints: [
    { id: "s1", projectId: "levis", date: "2026-04-26", title: "Menuiserie salon", description: "Contrôler alignement portes placard.", photo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop", room: "Salon", priority: "Haute", status: "En cours", owner: "Menuisier", action: "Reprise ajustement", visibleClient: true, internal: "À vérifier prochaine visite.", clientComment: "" },
    { id: "s2", projectId: "london", date: "2026-04-27", title: "Point implantation mobilier", description: "Confirmer implantation avant APS.", photo: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900&auto=format&fit=crop", room: "Séjour", priority: "Normale", status: "À traiter", owner: "Agence", action: "Décision client", visibleClient: true, internal: "Publier avec moodboard.", clientComment: "" }
  ],
  reports: [
    { id: "r1", projectId: "london", date: "2026-04-27", title: "Compte rendu cadrage London", participants: "Client, agence", summary: "Cadrage de l'ambiance, besoins de rangement et budget mobilier.", decisions: "Valider moodboard V1", followUp: "Envoyer zoning", photos: [], status: "Publié", visibleClient: true, version: "V1" },
    { id: "r2", projectId: "levis", date: "2026-04-26", title: "Visite chantier Lévis No 5", participants: "Agence, menuisier", summary: "Contrôle menuiserie et finitions.", decisions: "Reprise alignement", followUp: "Nouvelle visite le 03/05", photos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=900&auto=format&fit=crop"], status: "Brouillon", visibleClient: false, version: "V1" }
  ],
  documents: [
    { id: "doc1", projectId: "london", title: "Moodboard industriel", type: "Moodboard", phase: "Brief client", file: "moodboard-london.pdf", date: "2026-04-27", version: "V1", visibleClient: true, internalComment: "", clientComment: "", status: "Publié", linked: "mb-london-1" },
    { id: "doc2", projectId: "london", title: "Facture mobilier London", type: "Facture", phase: "Brief client", file: "facture-london.pdf", date: "2026-04-28", version: "V1", visibleClient: false, internalComment: "À analyser.", clientComment: "", status: "Interne", linked: "" },
    { id: "doc3", projectId: "levis", title: "Compte rendu chantier No 5", type: "Compte rendu", phase: "Suivi esthétique chantier", file: "cr-levis-5.pdf", date: "2026-04-26", version: "V1", visibleClient: false, internalComment: "Relire avant publication.", clientComment: "", status: "Brouillon", linked: "r2" }
  ],
  messages: [
    { id: "m1", projectId: "london", author: "Agence", role: "admin", text: "Le moodboard V1 est disponible pour validation.", at: "2026-04-27 09:12", internal: false, linked: "d1" },
    { id: "m2", projectId: "london", author: "Claire", role: "client", text: "Nous aimons l'ambiance, peut-on voir une alternative pour la table ?", at: "2026-04-27 11:04", internal: false, linked: "prod1" },
    { id: "m3", projectId: "foch", author: "Agence", role: "admin", text: "Ne pas publier le devis incomplet avant correction.", at: "2026-04-25 17:20", internal: true, linked: "q2" }
  ],
  timeEntries: [
    { id: "time1", projectId: "london", date: "2026-04-26", duration: 3.5, phase: "Brief client", taskType: "prise de brief", description: "Analyse besoins et zoning préliminaire", billable: true, internal: "Temps normal." },
    { id: "time2", projectId: "london", date: "2026-04-27", duration: 2, phase: "Brief client", taskType: "moodboard", description: "Recherche ambiance industrielle", billable: true, internal: "" },
    { id: "time3", projectId: "foch", date: "2026-04-26", duration: 5, phase: "DCE / consultation entreprises", taskType: "analyse devis", description: "Comparatif devis", billable: true, internal: "Risque dépassement." }
  ],
  users: [
    { id: "u1", name: "Emmanuelle Gobert", role: "admin", email: "admin@esprit-design.fr", projects: "all", status: "Actif" },
    { id: "u2", name: "Collaborateur agence", role: "collaborator", email: "collaborateur@esprit-design.fr", projects: "london, foch, levis", status: "Actif" },
    { id: "u3", name: "Foyer London", role: "client", email: "PROJET-LONDON", projects: "london", status: "Actif" },
    { id: "u4", name: "Foyer Lévis", role: "client", email: "PROJET-LEVIS", projects: "levis", status: "Actif" }
  ],
  templates: [
    { id: "tpl1", name: "Modèle brief", type: "Brief", content: "Objectifs, pièces, contraintes, style, priorités, budget." },
    { id: "tpl2", name: "Modèle phases projet", type: "Phases", content: "Découverte, Brief, APS, APD, DCE, Chantier, Livraison." },
    { id: "tpl3", name: "Modèle compte rendu", type: "Compte rendu", content: "Participants, synthèse, décisions, points à suivre, photos." },
    { id: "tpl4", name: "Modèle shopping list", type: "Shopping list", content: "Pièce, catégorie, fournisseur, prix, validation, lien." },
    { id: "tpl5", name: "Modèle tâches", type: "Tâches", content: "Responsable, priorité, échéance, statut, phase." }
  ],
  settings: {
    profitability: { good: 95, medium: 70, weak: 55 },
    brand: palette,
    statuses: ["Prospect", "Brief en cours", "Conception", "Validation client", "Consultation entreprises", "Préparation chantier", "Chantier en cours", "Livraison", "Terminé", "Archivé"]
  }
};

const publicProjectNames = ["Projet Lévis", "Projet Chopin", "Projet Foch", "Projet Goron", "Projet Perché", "Projet Plumier", "Projet Bali", "Projet Estang", "Projet London", "Projet Pinchinats", "Projet Manosque", "Projet Dardanelles", "Projet Parrines"];
const publicImages = [
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-47.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-48.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-41.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-39.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-38.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-37.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-43.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-47.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-42.png",
  "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-41.png"
];

const agencyNav = [
  { group: "Agence", items: [["cockpit", "Cockpit agence"], ["projects", "Tous les projets"], ["clients", "Clients"], ["prospects", "Prospects simples"], ["templates", "Modèles"], ["settings", "Paramètres"]] },
  { group: "Projet actif", items: [["overview", "Vue d'ensemble"], ["brief", "Brief & cadrage"], ["contract", "Contrat & honoraires"], ["phases", "Phases projet"], ["moodboards", "Moodboards"], ["visuals", "Plans & rendus 3D"], ["shopping", "Shopping list / sélections"], ["budget", "Budget"], ["quotes", "Devis entreprises"], ["planning", "Planning"], ["decisions", "Décisions client"], ["tasks", "Tâches internes"], ["site", "Suivi chantier"], ["reports", "Comptes rendus"], ["documents", "Documents"], ["messages", "Messages"], ["time", "Temps passé & rentabilité"], ["exports", "Exports PDF"], ["projectSettings", "Paramètres projet"]] }
];

const collaboratorNav = [
  { group: "Collaborateur", items: [["cockpit", "Mes projets"], ["projects", "Projets assignés"], ["overview", "Vue projet"], ["brief", "Brief"], ["moodboards", "Moodboards"], ["visuals", "Plans & rendus"], ["shopping", "Shopping list"], ["planning", "Planning"], ["decisions", "Décisions"], ["tasks", "Tâches"], ["site", "Chantier"], ["reports", "Comptes rendus"], ["documents", "Documents"], ["messages", "Messages"]] }
];

const clientNav = [
  { group: "Portail client", items: [["clientHome", "Accueil projet"], ["messages", "Messages"], ["decisions", "Mes décisions à valider"], ["brief", "Brief validé"], ["moodboards", "Moodboards"], ["visuals", "Plans & vues 3D"], ["shopping", "Shopping list"], ["budget", "Budget partagé"], ["quotes", "Devis à valider"], ["planning", "Planning"], ["site", "Suivi chantier"], ["reports", "Comptes rendus"], ["documents", "Documents"], ["contract", "Contrat & honoraires"], ["invoices", "Factures & paiements"]] }
];

function money(value) {
  return `${Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €`;
}

function byProject(collection, projectId = state.activeProjectId) {
  return collection.filter((item) => item.projectId === projectId);
}

function currentRole() {
  return roles[state.role] || roles.client;
}

function currentProject() {
  return db.projects.find((project) => project.id === state.activeProjectId) || db.projects[0];
}

function currentClient(project = currentProject()) {
  return db.clients.find((client) => client.id === project.clientId);
}

function visibleProjects() {
  if (state.role === "admin") return db.projects;
  if (state.role === "collaborator") return db.projects.filter((project) => currentRole().projects.includes(project.id));
  return db.projects.filter((project) => project.id === state.activeProjectId);
}

function isVisibleClient(item) {
  return state.role !== "client" || item.visibleClient === true || item.published === true || item.status === "Publié" || item.status === "Validé";
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => el.classList.remove("show"), 2800);
}

function badge(label, type = "") {
  return `<span class="badge ${type}">${label}</span>`;
}

function statusBadge(status) {
  const type = /retard|bloqué|critique|dépassement|risk|faible/i.test(status) ? "danger" : /attente|analyse|cours|proposé|envoyé|watch/i.test(status) ? "warn" : "ok";
  return `<span class="status ${type}">${status}</span>`;
}

function visibilityBadge(item) {
  return item.visibleClient || item.published || item.status === "Publié" ? badge("Visible client", "public") : badge("Interne uniquement", "private");
}

function renderPublicProjects() {
  $("#publicProjects").innerHTML = publicProjectNames.map((name, index) => `
    <button type="button" data-public-project="${name}">
      <img src="${publicImages[index % publicImages.length]}" alt="${name}" />
      <span>${name}</span>
    </button>
  `).join("");
  $$("[data-public-project]").forEach((button) => button.addEventListener("click", () => toast(`${button.dataset.publicProject} ouvert dans la démonstration.`)));
}

function openLogin() {
  $("#loginModal").showModal();
}

function login(identifier, password) {
  const user = demoUsers[identifier];
  if (!user || user.password !== password) {
    toast("Identifiant ou mot de passe incorrect en mode démo.");
    return;
  }
  state.role = user.role;
  state.demoUser = user;
  state.activeProjectId = user.role === "client" ? user.projectId : "london";
  state.view = user.role === "client" ? "clientHome" : "cockpit";
  $("#loginModal").close();
  $("#publicSite").classList.add("hidden");
  $("#app").classList.remove("hidden");
  renderApp();
}

function logout() {
  state.role = "public";
  state.demoUser = null;
  $("#app").classList.add("hidden");
  $("#publicSite").classList.remove("hidden");
}

function renderApp() {
  const role = currentRole();
  $("#workspaceTitle").textContent = state.role === "client" ? "Portail client" : state.role === "collaborator" ? "Espace collaborateur" : "Cockpit agence";
  $("#roleBadge").textContent = role.label;
  renderProjectSelect();
  renderSidebar();
  renderProjectContext();
  renderView();
}

function renderProjectSelect() {
  const projects = visibleProjects();
  $("#activeProjectSelect").innerHTML = projects.map((project) => `<option value="${project.id}" ${project.id === state.activeProjectId ? "selected" : ""}>${project.name}</option>`).join("");
  $("#activeProjectSelect").disabled = state.role === "client";
}

function renderSidebar() {
  const groups = state.role === "client" ? clientNav : state.role === "collaborator" ? collaboratorNav : agencyNav;
  $("#sidebar").innerHTML = groups.map((group) => `
    <h3>${group.group}</h3>
    ${group.items.map(([view, label]) => `<button type="button" data-view="${view}" class="${state.view === view ? "active" : ""}">${label}</button>`).join("")}
  `).join("");
  $$("[data-view]").forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.view;
    renderApp();
  }));
}

function renderProjectContext() {
  const project = currentProject();
  const client = currentClient(project);
  $("#activeProjectTitle").textContent = project.name;
  $("#activeProjectMeta").textContent = `${client?.firstName || ""} ${client?.lastName || ""} · ${project.address} · ${project.phase} · ${project.status}`;
  $("#visibilityLegend").innerHTML = state.role === "client"
    ? `${badge("Vue client filtrée", "public")} ${badge(project.householdLogin, "public")}`
    : `${badge("Projet actif", "public")} ${project.clientAccess ? badge("Accès client actif", "public") : badge("Accès client inactif", "private")}`;
}

function renderViewTitle(title, text, actions = "") {
  return `<div class="view-title"><div><h1>${title}</h1><p>${text}</p></div><div class="actions">${actions}</div></div>`;
}

function renderView() {
  const view = state.view;
  const map = {
    cockpit: renderCockpit,
    projects: renderProjects,
    clients: renderClients,
    prospects: renderProspects,
    templates: renderTemplates,
    settings: renderSettings,
    overview: renderOverview,
    clientHome: renderClientHome,
    brief: renderBrief,
    contract: renderContract,
    phases: renderPhases,
    moodboards: renderMoodboards,
    visuals: renderVisuals,
    shopping: renderShopping,
    budget: renderBudget,
    quotes: renderQuotes,
    planning: renderPlanning,
    decisions: renderDecisions,
    tasks: renderTasks,
    site: renderSite,
    reports: renderReports,
    documents: renderDocuments,
    messages: renderMessages,
    time: renderTime,
    exports: renderExports,
    projectSettings: renderProjectSettings,
    invoices: renderInvoices
  };
  const renderer = map[view] || renderOverview;
  $("#viewRoot").innerHTML = renderer();
  bindViewActions();
}

function cockpitMetrics() {
  const projects = visibleProjects();
  const waitingDecisions = db.decisions.filter((d) => projects.some((p) => p.id === d.projectId) && d.status === "En attente").length;
  const delayed = projects.filter((p) => p.health === "risk").length;
  const overBudget = projects.filter((p) => budgetTotals(p.id).remaining < 0).length;
  const reportsToPublish = db.reports.filter((r) => projects.some((p) => p.id === r.projectId) && !r.visibleClient).length;
  const urgentTasks = db.tasks.filter((t) => projects.some((p) => p.id === t.projectId) && t.priority === "Haute" && t.status !== "Terminé").length;
  const weekTime = db.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  return { active: projects.length, delayed, waitingDecisions, overBudget, reportsToPublish, urgentTasks, weekTime };
}

function renderCockpit() {
  const m = cockpitMetrics();
  return `
    ${renderViewTitle(state.role === "admin" ? "Cockpit agence" : "Mes projets assignés", "Vue globale de l'activité, des alertes, validations et jalons.", `<button data-action="new-project">Créer projet</button><button data-view-jump="planning">Voir Gantt</button>`)}
    <div class="grid cols-4">
      <div class="kpi"><strong>${m.active}</strong><span>Projets actifs</span></div>
      <div class="kpi"><strong>${m.delayed}</strong><span>Projets à risque</span></div>
      <div class="kpi"><strong>${m.waitingDecisions}</strong><span>Décisions client</span></div>
      <div class="kpi"><strong>${m.overBudget}</strong><span>Budgets en dépassement</span></div>
      <div class="kpi"><strong>${m.reportsToPublish}</strong><span>CR à publier</span></div>
      <div class="kpi"><strong>${m.urgentTasks}</strong><span>Tâches urgentes</span></div>
      <div class="kpi"><strong>${m.weekTime} h</strong><span>Temps saisi</span></div>
      <div class="kpi"><strong>${profitability(currentProject()).level}</strong><span>Rentabilité projet</span></div>
    </div>
    <div class="grid cols-2" style="margin-top:14px">
      <div class="table-card"><h3>Alertes internes</h3>${renderAlerts()}</div>
      <div class="table-card"><h3>Prochains jalons</h3>${renderMilestones()}</div>
    </div>
    <div class="table-card" style="margin-top:14px"><h3>Gantt global multi-projets</h3>${renderGantt()}</div>
  `;
}

function renderAlerts() {
  const alerts = [
    ...db.decisions.filter((d) => d.status === "En attente").map((d) => `${projectName(d.projectId)} · décision en attente : ${d.title}`),
    ...db.tasks.filter((t) => t.priority === "Haute" && t.status !== "Terminé").map((t) => `${projectName(t.projectId)} · tâche urgente : ${t.title}`),
    ...db.reports.filter((r) => !r.visibleClient).map((r) => `${projectName(r.projectId)} · compte rendu à publier : ${r.title}`)
  ].slice(0, 8);
  return alerts.length ? `<ul>${alerts.map((a) => `<li>${a}</li>`).join("")}</ul>` : `<div class="empty">Aucune alerte pour l'instant.</div>`;
}

function renderMilestones() {
  return `<ul>${visibleProjects().slice(0, 6).map((p) => `<li><strong>${p.name}</strong> · ${p.phase} · cible ${p.end}</li>`).join("")}</ul>`;
}

function renderProjects() {
  const rows = visibleProjects().map((p) => {
    const totals = budgetTotals(p.id);
    const profit = profitability(p);
    return `<tr><td><strong>${p.name}</strong><br>${currentClient(p)?.firstName || ""} ${currentClient(p)?.lastName || ""}</td><td>${p.address}<br>${p.type}</td><td>${p.phase}<br>${statusBadge(p.status)}</td><td>${p.priority}<br>${statusBadge(p.health === "risk" ? "À surveiller" : "OK")}</td><td>${money(totals.planned)}<br>${p.progress}%</td><td>${currentRole().canSeeProfitability ? `${money(p.fees)}<br>${profit.rate} €/h · ${profit.level}` : badge("Masqué", "private")}</td><td>${p.clientAccess ? badge("Actif", "public") : badge("Inactif", "private")}</td><td><button data-open-project="${p.id}">Ouvrir</button><button data-set-project="${p.id}">Actif</button><button data-action="archive-project" data-id="${p.id}">Archiver</button></td></tr>`;
  }).join("");
  return `
    ${renderViewTitle("Tous les projets", "Recherche, filtre, tri, vue tableau/cartes et ouverture fiche projet.", `<input id="projectSearch" placeholder="Rechercher un projet" /><button data-action="new-project">Créer projet</button><button data-toggle-project-view>${state.viewMode === "table" ? "Vue cartes" : "Vue tableau"}</button>`)}
    ${state.viewMode === "cards" ? renderProjectCards() : `<div class="table-card table-wrap"><table><thead><tr><th>Projet</th><th>Adresse/type</th><th>Phase/statut</th><th>Priorité/santé</th><th>Budget/avancement</th><th>Rentabilité</th><th>Portail</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`}
  `;
}

function renderProjectCards() {
  return `<div class="grid cols-3">${visibleProjects().map((p) => `<article class="card project-card"><img src="${p.image}" alt="${p.name}" /><div><h3>${p.name}</h3><p>${p.description}</p>${statusBadge(p.status)} ${p.clientAccess ? badge("Portail actif", "public") : badge("Portail inactif", "private")}<div class="actions"><button data-open-project="${p.id}">Ouvrir</button><button data-set-project="${p.id}">Projet actif</button></div></div></article>`).join("")}</div>`;
}

function renderClients() {
  return `${renderViewTitle("Clients", "Base clients simple : coordonnées, préférences, notes internes et projets associés.", `<button data-action="new-client">Créer client</button>`)}
    <div class="table-card table-wrap"><table><thead><tr><th>Client</th><th>Contact</th><th>Adresse</th><th>Communication</th><th>Projets</th><th>Notes internes</th></tr></thead><tbody>${db.clients.map((c) => `<tr><td><strong>${c.firstName} ${c.lastName}</strong></td><td>${c.email}<br>${c.phone}</td><td>${c.address}</td><td>${c.communication}</td><td>${c.projectIds.map(projectName).join(", ")}</td><td>${state.role === "client" ? badge("Masqué", "private") : c.notes}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderProspects() {
  return `${renderViewTitle("Prospects simples", "Demandes entrantes sans CRM marketing lourd.", `<button data-action="new-prospect">Créer prospect</button>`)}
    <div class="table-card table-wrap"><table><thead><tr><th>Nom</th><th>Contact</th><th>Source</th><th>Type</th><th>Budget</th><th>Délai</th><th>Statut</th><th>Prochaine action</th><th>Notes</th></tr></thead><tbody>${db.prospects.map((p) => `<tr><td>${p.name}</td><td>${p.contact}</td><td>${p.source}</td><td>${p.type}</td><td>${money(p.budget)}</td><td>${p.deadline}</td><td>${statusBadge(p.status)}</td><td>${p.nextAction}</td><td>${p.notes}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderOverview() {
  const p = currentProject();
  const totals = budgetTotals(p.id);
  const decisions = byProject(db.decisions).filter((d) => d.status === "En attente");
  return `
    ${renderViewTitle(p.name, "Vue d'ensemble du projet actif : budget, décisions, documents, messages et alertes.", `<button data-ai-summary="admin">Résumé IA agence</button><button data-ai-summary="client">Résumé IA client</button><button data-action="publish-overview">Publier synthèse</button>`)}
    <div class="grid cols-4">
      <div class="kpi"><strong>${p.progress}%</strong><span>Avancement</span></div>
      <div class="kpi"><strong>${money(totals.planned)}</strong><span>Budget prévu</span></div>
      <div class="kpi"><strong>${money(totals.engaged)}</strong><span>Budget engagé</span></div>
      <div class="kpi"><strong>${money(totals.remaining)}</strong><span>Reste disponible</span></div>
    </div>
    <div class="grid cols-2" style="margin-top:14px">
      <div class="card"><h3>Projet</h3><img src="${p.image}" alt="${p.name}" style="border-radius:10px;height:260px;width:100%;object-fit:cover"><p>${p.description}</p>${statusBadge(p.status)} ${p.clientAccess ? badge("Portail client actif", "public") : badge("Portail désactivé", "private")}</div>
      <div class="card"><h3>Décisions et alertes</h3>${decisions.length ? decisions.map(decisionCard).join("") : `<div class="empty">Aucune décision en attente.</div>`}${renderRecent("Documents récents", byProject(db.documents).slice(0, 3).map((d) => d.title))}${renderRecent("Derniers messages", byProject(db.messages).filter(isVisibleClient).slice(0, 3).map((m) => `${m.author} : ${m.text}`))}</div>
    </div>
    <div id="aiSummary" class="card hidden" style="margin-top:14px"></div>
  `;
}

function renderClientHome() {
  const p = currentProject();
  const visibleDecisions = byProject(db.decisions).filter((d) => d.status === "En attente");
  return `
    ${renderViewTitle(`Bienvenue dans votre espace ${p.name}`, "Retrouvez ici uniquement les éléments publiés par l'agence.", `<button data-ai-summary="client">Résumé IA de mon projet</button>`)}
    <div class="grid cols-3">
      <div class="kpi"><strong>${p.progress}%</strong><span>Avancement</span></div>
      <div class="kpi"><strong>${p.phase}</strong><span>Phase actuelle</span></div>
      <div class="kpi"><strong>${visibleDecisions.length}</strong><span>Décisions attendues</span></div>
    </div>
    <div class="grid cols-2" style="margin-top:14px">
      <div class="card"><img src="${p.image}" alt="${p.name}" style="height:320px;width:100%;object-fit:cover;border-radius:10px"><h3>${p.name}</h3><p>${p.publicSummary}</p></div>
      <div class="card"><h3>Mes prochaines étapes</h3>${visibleDecisions.map(decisionCard).join("") || `<div class="empty">Aucune validation attendue.</div>`}</div>
    </div>
    <div id="aiSummary" class="card hidden" style="margin-top:14px"></div>
  `;
}

function decisionCard(d) {
  return `<div class="module-card"><strong>${d.title}</strong><p>${d.description}</p>${statusBadge(d.status)}<div class="actions"><button data-validate="${d.id}" data-result="Validé">Valider</button><button data-validate="${d.id}" data-result="Refusé">Refuser</button><button data-validate="${d.id}" data-result="Modification demandée">Demander modification</button></div></div>`;
}

function renderBrief() {
  const brief = byProject(db.briefs)[0];
  if (!brief || !isVisibleClient(brief)) return emptyView("Brief & cadrage", "Aucun brief publié pour ce projet.");
  return `${renderViewTitle("Brief & cadrage", "Demande client, contraintes, priorités, inspirations et statut de validation.", `<button data-action="publish-brief">Publier / masquer</button>`)}
    <div class="grid cols-2">
      ${Object.entries({ Objectifs: brief.goals, "Pièces concernées": brief.rooms, Style: brief.style, Contraintes: brief.constraints, Priorités: brief.priorities, Inspirations: brief.inspirations, "À conserver": brief.keep, "À supprimer": brief.remove, Arbitrages: brief.arbitrations }).map(([k, v]) => `<div class="card"><h3>${k}</h3><p>${v}</p></div>`).join("")}
    </div><div class="card" style="margin-top:14px">${statusBadge(brief.status)} ${visibilityBadge(brief)} <strong>Version ${brief.version}</strong></div>`;
}

function renderContract() {
  const rows = byProject(db.contracts).filter(isVisibleClient).map((c) => `<tr><td>${c.type}</td><td>${c.version}</td><td>${c.sent}</td><td>${c.signed || "—"}</td><td>${state.role === "client" && !c.visibleClient ? "—" : money(c.amount)}</td><td>${statusBadge(c.status)}</td><td>${visibilityBadge(c)}</td></tr>`).join("");
  return tableView("Contrat & honoraires", "Contrats, devis d'honoraires, avenants et statuts de signature.", ["Type", "Version", "Envoyé", "Signé", "Montant", "Statut", "Visibilité"], rows);
}

function renderPhases() {
  const records = byProject(db.phaseRecords);
  return `${renderViewTitle("Phases projet", "Timeline, livrables, validations et avancement du projet actif.")}
    <div class="grid cols-3">${db.phases.map((name) => {
      const r = records.find((record) => record.name === name) || { status: "À venir", start: "—", end: "—", progress: 0, deliverables: "À définir", validations: "À définir", internal: "" };
      return `<div class="card"><h3>${name}</h3>${statusBadge(r.status)}<div class="mini-gantt"><i style="width:${r.progress}%"></i></div><p>${r.start} → ${r.end}</p><p><strong>Livrables</strong><br>${r.deliverables}</p><p><strong>Validation</strong><br>${r.validations}</p>${state.role === "admin" ? `<p><strong>Interne</strong><br>${r.internal || "—"}</p>` : ""}</div>`;
    }).join("")}</div>`;
}

function renderMoodboards() {
  const moodboards = byProject(db.moodboards).filter(isVisibleClient);
  return `${renderViewTitle("Moodboards", "Ambiances, images, couleurs, matériaux, versions et validation client.", `<button data-action="new-moodboard">Créer moodboard</button>`)}
    <div class="grid cols-2">${moodboards.map((m) => `<div class="card"><h3>${m.name}</h3><p>${m.room} · ${m.mood}</p><div class="image-strip">${m.images.map((img) => `<img src="${img}" alt="${m.name}">`).join("")}</div><p>${m.description}</p><p><strong>Couleurs</strong> ${m.colors.map((c) => `<span class="badge" style="background:${c};color:var(--beige)">${c}</span>`).join(" ")}</p><p><strong>Matériaux</strong> ${m.materials}</p>${statusBadge(m.status)} ${visibilityBadge(m)}</div>`).join("") || `<div class="empty">Aucun moodboard visible.</div>`}</div>`;
}

function renderVisuals() {
  const rows = byProject(db.visuals).filter(isVisibleClient).map((v) => `<tr><td>${v.title}</td><td>${v.type}</td><td>${v.room}</td><td>${v.phase}</td><td>${v.version}</td><td>${statusBadge(v.status)}</td><td>${visibilityBadge(v)}</td><td>${v.commentAgency || "—"}</td></tr>`).join("");
  return tableView("Plans & rendus 3D", "Classement par pièce, phase, version, statut et publication client.", ["Titre", "Type", "Pièce", "Phase", "Version", "Statut", "Visibilité", "Commentaire"], rows);
}

function renderShopping() {
  const items = byProject(db.products).filter(isVisibleClient);
  return `${renderViewTitle("Shopping list / sélections", "Produits par pièce, prix, statut, validation client, commentaires et export.", `<button data-action="new-product">Ajouter produit</button><button data-action="print-shopping">Exporter shopping list</button>`)}
    <div class="grid cols-3">${items.map((p) => `<article class="card project-card"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>${p.room} · ${p.category}<br>${p.supplier} · ${money(p.unitPrice)} × ${p.qty} = ${money(p.unitPrice * p.qty)}<br>Délai : ${p.delay}</p>${statusBadge(p.status)} ${visibilityBadge(p)}<p>${p.agencyComment}</p><div class="actions"><button data-product-status="${p.id}" data-status="Validé">Valider</button><button data-product-status="${p.id}" data-status="Refusé">Refuser</button><button data-product-status="${p.id}" data-status="Alternative demandée">Alternative</button></div></div></article>`).join("") || `<div class="empty">Aucun produit publié.</div>`}</div>`;
}

function renderBudget() {
  const totals = budgetTotals();
  const rows = byProject(db.budgets).filter((b) => state.role !== "client" || b.published).map((b) => `<tr><td>${b.lot}</td><td>${b.room}</td><td>${money(b.planned)}</td><td>${money(b.validated)}</td><td>${money(b.engaged)}</td><td>${money(b.validated - b.engaged)}</td><td>${b.source}</td><td>${b.published ? badge("Publié", "public") : badge("Interne", "private")}</td></tr>`).join("");
  return `${renderViewTitle(state.role === "client" ? "Budget partagé" : "Budget", "Budget propre au projet actif, relié aux achats, devis et factures analysées.", `<button data-action="new-budget-line">Ajouter ligne</button>`)}
    <div class="grid cols-4"><div class="kpi"><strong>${money(totals.planned)}</strong><span>Prévu</span></div><div class="kpi"><strong>${money(totals.validated)}</strong><span>Validé</span></div><div class="kpi"><strong>${money(totals.engaged)}</strong><span>Engagé</span></div><div class="kpi"><strong>${money(totals.remaining)}</strong><span>Reste</span></div></div>
    <div class="table-card table-wrap" style="margin-top:14px"><table><thead><tr><th>Lot</th><th>Pièce</th><th>Prévu</th><th>Validé</th><th>Engagé</th><th>Reste</th><th>Source</th><th>Publication</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderQuotes() {
  const rows = byProject(db.quotes).filter(isVisibleClient).map((q) => `<tr><td>${q.company}</td><td>${q.lot}</td><td>${money(q.amount)}</td><td>${statusBadge(q.status)}</td><td>${q.file}</td><td>${q.received}</td><td>${q.validated || "—"}</td><td>${visibilityBadge(q)}</td><td>${q.agencyComment}</td></tr>`).join("");
  return tableView("Devis entreprises", "Devis artisans, comparaison simple, rattachement budget et décision client.", ["Entreprise", "Lot", "Montant", "Statut", "Fichier", "Réception", "Validation", "Visibilité", "Commentaire"], rows);
}

function renderPlanning() {
  return `${renderViewTitle("Planning", "Planning global, planning projet, jalons, Gantt premium et alertes retard.")}
    <div class="table-card table-wrap"><h3>Gantt global</h3>${renderGantt()}</div>
    <div class="grid cols-3" style="margin-top:14px">${byProject(db.phaseRecords).map((p) => `<div class="card"><h3>${p.name}</h3>${statusBadge(p.status)}<p>${p.start} → ${p.end}</p><div class="mini-gantt"><i style="width:${p.progress}%"></i></div></div>`).join("")}</div>`;
}

function renderDecisions() {
  const rows = byProject(db.decisions).map((d) => `<tr><td>${d.title}<br><small>${d.description}</small></td><td>${d.type}</td><td>${d.version}</td><td>${d.requested}</td><td>${d.answered || "—"}</td><td>${statusBadge(d.status)}</td><td>${d.validatedBy || "—"}</td><td>${d.clientComment || "—"}</td><td><button data-validate="${d.id}" data-result="Validé">Valider</button><button data-validate="${d.id}" data-result="Refusé">Refuser</button><button data-validate="${d.id}" data-result="Modification demandée">Modifier</button></td></tr>`).join("");
  return tableView("Décisions client", "Validations structurées et tracées : qui, quoi, quand, version et commentaire.", ["Décision", "Type", "Version", "Demandée", "Réponse", "Statut", "Validé par", "Commentaire", "Actions"], rows);
}

function renderTasks() {
  if (state.role === "client") return emptyView("Tâches internes", "Les tâches internes ne sont jamais visibles côté client.");
  const rows = byProject(db.tasks).map((t) => `<tr><td>${t.title}</td><td>${t.owner}</td><td>${t.priority}</td><td>${t.due}</td><td>${statusBadge(t.status)}</td><td>${t.phase}</td><td>${t.comment}</td></tr>`).join("");
  return tableView("Tâches internes", "Tâches strictement internes, liées aux phases et décisions.", ["Titre", "Responsable", "Priorité", "Échéance", "Statut", "Phase", "Commentaire"], rows);
}

function renderSite() {
  const rows = byProject(db.sitePoints).filter(isVisibleClient).map((s) => `<tr><td>${s.date}<br><strong>${s.title}</strong></td><td><img src="${s.photo}" alt="${s.title}" style="width:120px;height:80px;object-fit:cover;border-radius:8px"></td><td>${s.room}</td><td>${s.description}</td><td>${s.priority}</td><td>${statusBadge(s.status)}</td><td>${s.owner}</td><td>${s.action}</td><td>${visibilityBadge(s)}</td></tr>`).join("");
  return `${renderViewTitle("Suivi chantier", "Photos, anomalies, priorités, responsables, échéances et publication client.", `<button data-action="new-site-point">Ajouter point chantier</button>`)}
    <div class="table-card table-wrap"><table><thead><tr><th>Date / titre</th><th>Photo</th><th>Pièce</th><th>Description</th><th>Priorité</th><th>Statut</th><th>Responsable</th><th>Action</th><th>Visibilité</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderReports() {
  const rows = byProject(db.reports).filter(isVisibleClient).map((r) => `<tr><td>${r.date}<br><strong>${r.title}</strong></td><td>${r.participants}</td><td>${r.summary}</td><td>${r.decisions}</td><td>${r.followUp}</td><td>${statusBadge(r.status)}</td><td>${visibilityBadge(r)}</td><td><button data-action="print-report">Imprimer</button></td></tr>`).join("");
  return tableView("Comptes rendus", "Comptes rendus avec décisions, points à suivre, photos, versions et publication.", ["Date / titre", "Participants", "Synthèse", "Décisions", "Prochaines actions", "Statut", "Visibilité", "Export"], rows);
}

function renderDocuments() {
  const rows = byProject(db.documents).filter(isVisibleClient).map((d) => `<tr><td>${d.title}</td><td>${d.type}</td><td>${d.phase}</td><td>${d.file}</td><td>${d.date}</td><td>${d.version}</td><td>${statusBadge(d.status)}</td><td>${visibilityBadge(d)}</td><td>${state.role !== "client" ? `<button data-doc-publish="${d.id}">${d.visibleClient ? "Masquer" : "Publier"}</button>` : "<button>Télécharger</button>"}</td></tr>`).join("");
  return `${renderViewTitle("Documents", "Bibliothèque filtrable : contrats, devis, factures, plans, rendus, photos, CR et documents internes.", `<button data-action="new-document">Ajouter document</button>`)}
    ${renderDocumentImport()}
    <div class="table-card table-wrap" style="margin-top:14px"><table><thead><tr><th>Titre</th><th>Type</th><th>Phase</th><th>Fichier</th><th>Date</th><th>Version</th><th>Statut</th><th>Visibilité</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderDocumentImport() {
  if (state.role === "client") return "";
  return `<div class="card"><h3>Analyse documentaire IA limitée</h3><p>Fonction IA 2 : lecture / extraction / analyse de documents. L'intégration n'est jamais automatique : validez les lignes avant ajout.</p>
    <div class="form-grid">
      <label>Type document<select id="docType"><option value="invoice">Facture</option><option value="quote">Devis</option><option value="other">Autre</option></select></label>
      <label>Fichier démo<input id="docFile" type="file" accept=".txt,.csv,.pdf,.jpg,.jpeg,.png"></label>
      <label class="full">Coller le texte facture/devis<textarea id="docText" rows="5" placeholder="Ex : Table basse Pirita 669 €&#10;Suspension Uliar 63,50 €"></textarea></label>
    </div>
    <div class="actions"><button data-ai-document>Analyser le document</button><button data-confirm-analysis>Ajouter à la shopping list / budget</button><button data-create-invoice-doc>Créer document facture</button></div>
    <div id="analysisResult" class="grid" style="margin-top:12px"></div>
  </div>`;
}

function renderMessages() {
  const visible = byProject(db.messages).filter((m) => state.role !== "client" || !m.internal);
  return `${renderViewTitle("Messages", "Fil projet avec messages agence, client, internes et liens vers décisions.", `<button data-action="new-message">Ajouter message</button>`)}
    <div class="grid">${visible.map((m) => `<div class="card"><strong>${m.author}</strong> ${badge(m.internal ? "Interne" : "Projet", m.internal ? "private" : "public")}<p>${m.text}</p><small>${m.at}${m.linked ? ` · lié à ${m.linked}` : ""}</small></div>`).join("") || `<div class="empty">Aucun message.</div>`}</div>`;
}

function renderTime() {
  if (!currentRole().canSeeProfitability) return emptyView("Temps passé & rentabilité", "Module strictement interne, masqué pour ce rôle.");
  const p = currentProject();
  const profit = profitability(p);
  const rows = byProject(db.timeEntries).map((t) => `<tr><td>${t.date}</td><td>${t.duration} h</td><td>${t.phase}</td><td>${t.taskType}</td><td>${t.description}</td><td>${t.billable ? "Oui" : "Non"}</td><td>${t.internal}</td></tr>`).join("");
  return `${renderViewTitle("Temps passé & rentabilité", "Saisie temps, phase, tâche, facturable et calcul rentabilité strictement interne.", `<button data-action="new-time">Ajouter temps</button>`)}
    <div class="grid cols-4"><div class="kpi"><strong>${money(p.fees)}</strong><span>Honoraires prévus</span></div><div class="kpi"><strong>${money(p.feesBilled)}</strong><span>Honoraires facturés</span></div><div class="kpi"><strong>${profit.hours} h</strong><span>Temps total</span></div><div class="kpi"><strong>${profit.rate} €/h</strong><span>Taux horaire réel · ${profit.level}</span></div></div>
    <div class="table-card table-wrap" style="margin-top:14px"><table><thead><tr><th>Date</th><th>Durée</th><th>Phase</th><th>Type</th><th>Description</th><th>Facturable</th><th>Interne</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderExports() {
  const exports = ["Dossier projet complet", "Brief validé", "Dossier APS", "Dossier APD", "Moodboard PDF", "Shopping list PDF", "Budget PDF", "Compte rendu de visite", "Synthèse devis entreprises", "Dossier de fin de projet"];
  return `${renderViewTitle("Exports PDF", "Vues imprimables premium via window.print() et styles print CSS.")}
    <div class="grid cols-3">${exports.map((name) => `<div class="card"><h3>${name}</h3><p>Export imprimable du projet actif.</p><button data-action="print-export">Exporter / imprimer</button></div>`).join("")}</div>`;
}

function renderProjectSettings() {
  const p = currentProject();
  return `${renderViewTitle("Paramètres projet", "Nom, client, statut, accès client, permissions, visibilité et archivage.")}
    <div class="form-grid card">
      <label>Nom projet<input value="${p.name}"></label><label>Adresse<input value="${p.address}"></label><label>Statut<select>${db.settings.statuses.map((s) => `<option ${s === p.status ? "selected" : ""}>${s}</option>`).join("")}</select></label><label>Phase actuelle<select>${db.phases.map((phase) => `<option ${phase === p.phase ? "selected" : ""}>${phase}</option>`).join("")}</select></label><label>Priorité<select><option>${p.priority}</option><option>Haute</option><option>Normale</option><option>Basse</option></select></label><label>Identifiant client<input value="${p.householdLogin}"></label><label>Accès client<select><option>${p.clientAccess ? "Actif" : "Inactif"}</option><option>Actif</option><option>Inactif</option></select></label><label>Image couverture<input value="${p.image}"></label><div class="actions full"><button data-action="reset-client-code">Réinitialiser code</button><button data-action="toggle-client-access">Activer/désactiver accès</button><button data-action="archive-project">Archiver projet</button></div>
    </div>`;
}

function renderInvoices() {
  return renderDocuments();
}

function renderTemplates() {
  return `${renderViewTitle("Modèles", "Modèles statiques éditables en mode démo, sans IA de génération de message.", `<button data-action="new-template">Créer modèle</button>`)}
    <div class="grid cols-3">${db.templates.map((t) => `<div class="card"><h3>${t.name}</h3><p>${t.type}</p><p>${t.content}</p><button data-action="edit-template">Éditer</button></div>`).join("")}</div>`;
}

function renderSettings() {
  return `${renderViewTitle("Paramètres", "Rôles, permissions, charte, seuils rentabilité, statuts et paramètres globaux.")}
    <div class="grid cols-2">
      <div class="card"><h3>Utilisateurs & rôles</h3>${db.users.map((u) => `<p><strong>${u.name}</strong><br>${u.role} · ${u.email} · ${u.status}<br>Projets : ${u.projects}</p>`).join("")}<button data-action="new-user">Créer utilisateur</button></div>
      <div class="card"><h3>Seuils rentabilité</h3><p>Bonne : ${db.settings.profitability.good} €/h<br>Moyenne : ${db.settings.profitability.medium} €/h<br>Faible : ${db.settings.profitability.weak} €/h</p><button data-action="save-settings">Enregistrer</button></div>
      <div class="card"><h3>Charte</h3>${Object.entries(db.settings.brand).map(([k, v]) => `<span class="badge" style="background:${v};color:var(--beige)">${k} ${v}</span>`).join(" ")}</div>
      <div class="card"><h3>Statuts</h3><p>${db.settings.statuses.join(" · ")}</p></div>
    </div>`;
}

function emptyView(title, text) {
  return `${renderViewTitle(title, text)}<div class="empty">${text}</div>`;
}

function tableView(title, text, headers, rows) {
  return `${renderViewTitle(title, text)}<div class="table-card table-wrap"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows || `<tr><td colspan="${headers.length}">Aucune donnée.</td></tr>`}</tbody></table></div>`;
}

function renderRecent(title, items) {
  return `<h3>${title}</h3>${items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : `<div class="empty">Aucun élément.</div>`}`;
}

function renderGantt() {
  const columns = db.phases;
  return `<div class="gantt"><div class="gantt-head"><span>Projet</span>${columns.map((c) => `<span>${c.split(" ")[0]}</span>`).join("")}</div>${visibleProjects().map((p) => {
    const activeIndex = columns.indexOf(p.phase);
    return `<div class="gantt-row"><span class="gantt-name">${p.name}</span>${columns.map((phase, index) => `<span class="gantt-cell">${index <= activeIndex ? `<i class="gantt-bar ${p.health === "risk" && index === activeIndex ? "warn" : ""}" style="width:${index === activeIndex ? p.progress : 100}%">${index === activeIndex ? `${p.progress}%` : "✓"}</i>` : ""}</span>`).join("")}</div>`;
  }).join("")}</div>`;
}

function projectName(id) {
  return db.projects.find((p) => p.id === id)?.name || id;
}

function budgetTotals(projectId = state.activeProjectId) {
  const lines = byProject(db.budgets, projectId).filter((b) => state.role !== "client" || b.published);
  const planned = lines.reduce((sum, l) => sum + l.planned, 0);
  const validated = lines.reduce((sum, l) => sum + l.validated, 0);
  const engaged = lines.reduce((sum, l) => sum + l.engaged, 0);
  return { planned, validated, engaged, remaining: validated - engaged };
}

function profitability(project) {
  const entries = byProject(db.timeEntries, project.id);
  const hours = entries.reduce((sum, e) => sum + e.duration, 0);
  const rate = hours ? Math.round(project.fees / hours) : 0;
  const level = rate >= db.settings.profitability.good ? "Bonne" : rate >= db.settings.profitability.medium ? "Moyenne" : "Faible";
  return { hours, rate, level };
}

function bindViewActions() {
  $$("[data-set-project]").forEach((btn) => btn.addEventListener("click", () => setActiveProject(btn.dataset.setProject)));
  $$("[data-open-project]").forEach((btn) => btn.addEventListener("click", () => { setActiveProject(btn.dataset.openProject); state.view = "overview"; renderApp(); }));
  $$("[data-view-jump]").forEach((btn) => btn.addEventListener("click", () => { state.view = btn.dataset.viewJump; renderApp(); }));
  $$("[data-toggle-project-view]").forEach((btn) => btn.addEventListener("click", () => { state.viewMode = state.viewMode === "table" ? "cards" : "table"; renderApp(); }));
  $$("[data-action]").forEach((btn) => btn.addEventListener("click", () => handleAction(btn.dataset.action, btn.dataset.id)));
  $$("[data-doc-publish]").forEach((btn) => btn.addEventListener("click", () => toggleDocument(btn.dataset.docPublish)));
  $$("[data-product-status]").forEach((btn) => btn.addEventListener("click", () => setProductStatus(btn.dataset.productStatus, btn.dataset.status)));
  $$("[data-validate]").forEach((btn) => btn.addEventListener("click", () => validateDecision(btn.dataset.validate, btn.dataset.result)));
  $$("[data-ai-summary]").forEach((btn) => btn.addEventListener("click", () => summarizeProject(btn.dataset.aiSummary)));
  const docAi = $("[data-ai-document]");
  if (docAi) docAi.addEventListener("click", analyzeDocument);
  const confirm = $("[data-confirm-analysis]");
  if (confirm) confirm.addEventListener("click", confirmDocumentAnalysis);
  const createDoc = $("[data-create-invoice-doc]");
  if (createDoc) createDoc.addEventListener("click", createInvoiceDocument);
}

function setActiveProject(projectId) {
  if (!visibleProjects().some((p) => p.id === projectId)) return;
  state.activeProjectId = projectId;
  renderApp();
  toast(`${projectName(projectId)} est maintenant le projet actif.`);
}

function handleAction(action) {
  const project = currentProject();
  const messages = {
    "new-project": "Projet de démonstration créé.",
    "archive-project": `${project.name} archivé en mode démo.`,
    "new-client": "Fiche client de démonstration créée.",
    "new-prospect": "Prospect de démonstration ajouté.",
    "publish-overview": `Synthèse ${project.name} publiée côté client.`,
    "publish-brief": "Visibilité brief mise à jour en mode démo.",
    "new-moodboard": "Moodboard brouillon créé.",
    "new-product": "Produit de démonstration ajouté à la shopping list.",
    "print-shopping": "Ouverture impression shopping list.",
    "new-budget-line": "Ligne budget ajoutée au projet actif.",
    "new-site-point": "Point chantier ajouté en mode démo.",
    "print-report": "Préparation impression compte rendu.",
    "new-document": "Document interne ajouté.",
    "new-message": "Message projet ajouté.",
    "new-time": "Entrée temps ajoutée.",
    "print-export": "Préparation export imprimable.",
    "reset-client-code": "Code client réinitialisé en mode démo.",
    "toggle-client-access": "Accès client modifié en mode démo.",
    "new-template": "Modèle ajouté.",
    "edit-template": "Édition modèle ouverte.",
    "new-user": "Utilisateur de démonstration créé.",
    "save-settings": "Paramètres enregistrés."
  };
  if (action?.includes("print")) window.print();
  toast(messages[action] || "Action réalisée en mode démo.");
}

function toggleDocument(id) {
  const doc = db.documents.find((d) => d.id === id);
  if (!doc) return;
  doc.visibleClient = !doc.visibleClient;
  doc.status = doc.visibleClient ? "Publié" : "Interne";
  toast(`${doc.title} ${doc.visibleClient ? "publié côté client" : "masqué côté client"}.`);
  renderApp();
}

function setProductStatus(id, status) {
  const product = db.products.find((p) => p.id === id);
  if (!product) return;
  const validator = state.role === "client" ? prompt("Prénom ou nom de la personne qui valide :", state.clientValidator) || state.clientValidator : state.demoUser?.name || "Agence";
  product.status = status;
  product.clientComment = state.role === "client" ? prompt("Commentaire optionnel :", "") || "" : product.clientComment;
  product.validationDate = new Date().toLocaleString("fr-FR");
  product.validatedBy = validator;
  db.decisions.push({ id: `d-${Date.now()}`, projectId: product.projectId, title: product.name, description: `Décision produit : ${status}`, type: "Produit", linkedId: product.id, version: "V1", requested: new Date().toLocaleDateString("fr-FR"), answered: product.validationDate, status, agencyComment: "", clientComment: product.clientComment, validatedBy: validator, history: [{ by: validator, at: product.validationDate, status, comment: product.clientComment, version: "V1" }] });
  toast(`Validation tracée : ${product.name} · ${status}.`);
  renderApp();
}

function validateDecision(id, result) {
  const decision = db.decisions.find((d) => d.id === id);
  if (!decision) return;
  const validator = state.role === "client" ? prompt("Prénom ou nom de la personne qui valide :", state.clientValidator) || state.clientValidator : state.demoUser?.name || "Agence";
  const comment = prompt("Commentaire de validation :", result === "Validé" ? "Validé pour nous" : "") || "";
  decision.status = result;
  decision.answered = new Date().toLocaleString("fr-FR");
  decision.validatedBy = validator;
  decision.clientComment = comment;
  decision.history.push({ by: validator, at: decision.answered, status: result, comment, version: decision.version });
  toast(`Décision tracée : ${decision.title} · ${result}.`);
  renderApp();
}

async function summarizeProject(audience) {
  const target = $("#aiSummary");
  if (!target) return;
  target.classList.remove("hidden");
  target.innerHTML = "<strong>Résumé IA</strong><p>Analyse en cours...</p>";
  const project = currentProject();
  const context = projectContextForAi(audience);
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "summarizeProject", projectId: project.id, role: state.role, audience, context })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur IA");
    target.innerHTML = `<h3>Résumé IA ${audience === "client" ? "client" : "agence"} · ${data.mode}</h3><p>${escapeHtml(data.text).replace(/\n/g, "<br>")}</p>`;
  } catch (error) {
    target.innerHTML = `<h3>Erreur IA</h3><p>${error.message}</p>`;
  }
}

function projectContextForAi(audience) {
  const projectId = state.activeProjectId;
  const internalAllowed = audience !== "client" && state.role === "admin";
  return {
    project: currentProject(),
    client: currentClient(),
    budget: budgetTotals(projectId),
    decisions: byProject(db.decisions, projectId).filter((d) => internalAllowed || d.status !== "Interne"),
    reports: byProject(db.reports, projectId).filter((r) => internalAllowed || r.visibleClient),
    documents: byProject(db.documents, projectId).filter((d) => internalAllowed || d.visibleClient),
    products: byProject(db.products, projectId).filter((p) => internalAllowed || p.visibleClient),
    messages: byProject(db.messages, projectId).filter((m) => internalAllowed || !m.internal),
    sitePoints: byProject(db.sitePoints, projectId).filter((s) => internalAllowed || s.visibleClient),
    internal: internalAllowed ? { tasks: byProject(db.tasks, projectId), timeEntries: byProject(db.timeEntries, projectId), profitability: profitability(currentProject()) } : undefined
  };
}

let pendingAnalysis = null;

async function analyzeDocument() {
  const result = $("#analysisResult");
  result.innerHTML = "<div class='empty'>Analyse en cours...</div>";
  const file = $("#docFile")?.files?.[0];
  const typedText = $("#docText").value;
  const documentText = typedText || await readFileAsText(file);
  const documentType = $("#docType").value;
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "analyzeDocument", projectId: state.activeProjectId, role: state.role, documentType, documentText, context: projectContextForAi("admin") })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Erreur analyse");
    pendingAnalysis = data.extraction;
    result.innerHTML = renderAnalysis(data);
  } catch (error) {
    result.innerHTML = `<div class="empty">${error.message}</div>`;
  }
}

function renderAnalysis(data) {
  const extraction = data.extraction || { lines: [] };
  return `<div class="table-card table-wrap"><h3>Résultat vérifiable · ${data.mode}</h3><p>Fournisseur : ${extraction.supplier || "À vérifier"} · Date : ${extraction.date || "À vérifier"} · Total : ${money(extraction.total || 0)} · TVA : ${money(extraction.vat || 0)}</p><table><thead><tr><th>Libellé</th><th>Lot proposé</th><th>Pièce</th><th>Montant</th></tr></thead><tbody>${(extraction.lines || []).map((l) => `<tr><td>${l.name}</td><td>${l.category}</td><td>${l.room || "À classer"}</td><td>${money(l.amount)}</td></tr>`).join("")}</tbody></table></div>`;
}

function confirmDocumentAnalysis() {
  if (!pendingAnalysis) return toast("Aucune analyse à valider.");
  pendingAnalysis.lines.forEach((line) => {
    db.products.push({ id: `prod-${Date.now()}-${Math.random()}`, projectId: state.activeProjectId, room: line.room || "À classer", category: line.category || "Mobilier", name: line.name, supplier: pendingAnalysis.supplier || "Fournisseur importé", link: "", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=500&auto=format&fit=crop", unitPrice: Number(line.amount || 0), qty: 1, delay: "À confirmer", status: "Commandé", agencyComment: "Créé depuis analyse documentaire validée.", clientComment: "", visibleClient: false, buyer: "Agence", validationDate: "", validatedBy: "" });
    const existing = db.budgets.find((b) => b.projectId === state.activeProjectId && b.lot === line.category);
    if (existing) existing.engaged += Number(line.amount || 0);
    else db.budgets.push({ projectId: state.activeProjectId, lot: line.category || "À classer", room: line.room || "À classer", planned: Number(line.amount || 0), validated: Number(line.amount || 0), engaged: Number(line.amount || 0), published: false, source: "Facture analysée" });
  });
  toast("Analyse validée : achats ajoutés et budget imputé.");
  renderApp();
}

function createInvoiceDocument() {
  if (!pendingAnalysis) return toast("Aucune analyse à transformer en document.");
  db.documents.push({ id: `doc-${Date.now()}`, projectId: state.activeProjectId, title: `Facture ${pendingAnalysis.supplier || "importée"}`, type: "Facture", phase: currentProject().phase, file: "import-demo.pdf", date: pendingAnalysis.date || new Date().toLocaleDateString("fr-FR"), version: "V1", visibleClient: false, internalComment: "Document créé depuis analyse IA validable.", clientComment: "", status: "Interne", linked: "" });
  toast("Document facture créé.");
  renderApp();
}

function readFileAsText(file) {
  return new Promise((resolve) => {
    if (!file || !/\.(txt|csv|json)$/i.test(file.name)) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsText(file);
  });
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function init() {
  renderPublicProjects();
  $$("[data-open-login]").forEach((button) => button.addEventListener("click", openLogin));
  $("#mobileToggle").addEventListener("click", () => $("#siteMenu").classList.toggle("open"));
  $$("[data-demo-login]").forEach((button) => button.addEventListener("click", () => {
    $("#loginId").value = button.dataset.demoLogin;
    $("#loginPassword").value = "demo";
  }));
  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    login($("#loginId").value.trim(), $("#loginPassword").value);
  });
  $("#activeProjectSelect").addEventListener("change", (event) => setActiveProject(event.target.value));
  $("#logoutBtn").addEventListener("click", logout);
  $("#backToSiteBtn").addEventListener("click", () => { $("#app").classList.add("hidden"); $("#publicSite").classList.remove("hidden"); });
  $("#printBtn").addEventListener("click", () => window.print());
  $("#contactForm").addEventListener("submit", (event) => { event.preventDefault(); toast("Demande enregistrée en mode démo."); event.target.reset(); });
}

init();
