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
  activeProjectId: null,
  view: "cockpit",
  demoUser: null,
  viewMode: "table",
  previewClient: false,
  clientValidator: "Client London",
  showClientForm: false,
  filters: {
    global: "",
    projects: { query: "", phase: "", status: "", priority: "" },
    clients: "",
    documents: ""
  }
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
  "client.london@example.fr": { password: "London2026!", role: "client", name: "Foyer London", projectId: "london" },
  "PROJET-LONDON": { password: "London2026", role: "client", name: "Foyer London", projectId: "london" },
  "client.levis@example.fr": { password: "Levis2026!", role: "client", name: "Foyer Lévis", projectId: "levis" },
  "PROJET-LEVIS": { password: "Levis2026", role: "client", name: "Foyer Lévis", projectId: "levis" }
};

const db = {
  clients: [
    { id: "c-london", civility: "Mme", firstName: "Claire", lastName: "Martin", email: "claire.martin@example.fr", phone: "06 12 45 78 90", address: "12 King's Road", zip: "SW3", city: "London", communication: "Email + portail", notes: "Aime les intérieurs modernes industriels, rangements invisibles.", projectIds: ["london"] },
    { id: "c-levis", civility: "Mme", firstName: "Anne", lastName: "Dupont", email: "anne.dupont@example.fr", phone: "06 84 32 11 09", address: "14 rue de Lévis", zip: "75017", city: "Paris", communication: "Portail prioritaire", notes: "Projet haut de gamme, attention forte aux détails patrimoniaux.", projectIds: ["levis"] },
    { id: "c-foch", civility: "M.", firstName: "Julien", lastName: "Robert", email: "julien.robert@example.fr", phone: "06 22 13 93 41", address: "Avenue Foch", zip: "75116", city: "Paris", communication: "Téléphone + portail", notes: "Besoin d'arbitrages rapides sur devis entreprises.", projectIds: ["foch"] },
    { id: "c-bali", civility: "Mme", firstName: "Nora", lastName: "Benali", email: "nora.benali@example.fr", phone: "06 50 78 71 11", address: "Résidence saisonnière", zip: "13100", city: "Aix-en-Provence", communication: "Email", notes: "Petit budget, effet coup de coeur attendu.", projectIds: ["bali"] },
    { id: "c-cabries", civility: "Mme", firstName: "Sophie", lastName: "Morel", email: "sophie.morel@example.fr", phone: "06 77 00 22 11", address: "Chemin des oliviers", zip: "13480", city: "Cabriès", communication: "Portail", notes: "Projet créé pour démontrer l'extension future.", projectIds: ["cabries"] }
  ],
  prospects: [
    { id: "p1", name: "Famille Garnier", contact: "garnier@example.fr", source: "Site web", type: "Rénovation maison", budget: 65000, deadline: "Septembre 2026", status: "Rendez-vous fixé", nextAction: "Préparer questionnaire découverte", notes: "Budget confortable, demande globale." },
    { id: "p2", name: "Mme Laurent", contact: "laurent@example.fr", source: "Instagram", type: "Décoration salon", budget: 9000, deadline: "Été 2026", status: "À rappeler", nextAction: "Appel découverte", notes: "Besoin simple, pas de CRM lourd." },
    { id: "p3", name: "SCI Parrines", contact: "sci@example.fr", source: "Recommandation", type: "Appartement locatif", budget: 32000, deadline: "Fin 2026", status: "Devis envoyé", nextAction: "Relance devis", notes: "Projet intéressant mais arbitrage budget." }
  ],
  projects: [
    { id: "london", name: "Projet London", clientId: "c-london", clientAccess: true, householdLogin: "PROJET-LONDON", address: "12 King's Road", zip: "SW3", city: "London", type: "Appartement", phase: "Brief", status: "En cours", priority: "Normale", health: "Bonne", start: "2026-04-20", end: "2026-07-15", progress: 52, worksBudget: 8400, furnitureBudget: 11300, fees: 3000, feesBilled: 1200, timeEstimated: 44, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-42.png", description: "Aménagement sur-mesure d'un appartement type 1 dans un style moderne industriel, alliant fonctionnalité et esthétique contemporaine.", publicSummary: "Brief et ambiance moderne industrielle en cours de validation.", assigned: ["collaborator"] },
    { id: "levis", name: "Projet Lévis", clientId: "c-levis", clientAccess: true, householdLogin: "PROJET-LEVIS", address: "14 rue de Lévis", zip: "75017", city: "Paris", type: "Appartement", phase: "Exécution", status: "En cours", priority: "Haute", health: "Bonne", start: "2026-01-15", end: "2026-06-28", progress: 74, worksBudget: 39000, furnitureBudget: 15000, fees: 7200, feesBilled: 5400, timeEstimated: 82, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-47.png", description: "Rénovation d'un appartement haussmannien de 54 m², conservation de l'âme du lieu et création d'un espace moderne, fonctionnel et modulable.", publicSummary: "Chantier en cours, mobilier modulable en suivi.", assigned: ["collaborator"] },
    { id: "foch", name: "Projet Foch", clientId: "c-foch", clientAccess: true, householdLogin: "PROJET-FOCH", address: "Avenue Foch", zip: "75116", city: "Paris", type: "Appartement", phase: "DCE", status: "En cours", priority: "Haute", health: "À surveiller", start: "2026-03-01", end: "2026-08-30", progress: 63, worksBudget: 31000, furnitureBudget: 15200, fees: 5200, feesBilled: 2500, timeEstimated: 68, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-41.png", description: "Transformation complète d'un logement une chambre en espace de vie confortable et contemporain.", publicSummary: "Comparaison des devis entreprises en cours.", assigned: ["collaborator"] },
    { id: "bali", name: "Projet Bali", clientId: "c-bali", clientAccess: false, householdLogin: "PROJET-BALI", address: "Résidence saisonnière", zip: "13100", city: "Aix-en-Provence", type: "Studio", phase: "Livraison", status: "En cours", priority: "Normale", health: "Bonne", start: "2026-02-01", end: "2026-05-03", progress: 92, worksBudget: 3800, furnitureBudget: 11100, fees: 2200, feesBilled: 2200, timeEstimated: 30, image: "https://esprit-design-architecture.fr/wp-content/uploads/2024/12/Design-sans-titre-43.png", description: "Décoration d'un logement destiné à la location saisonnière avec un aménagement coup de coeur à petit budget.", publicSummary: "Livraison presque finalisée.", assigned: [] },
    { id: "cabries", name: "Projet Cabriès", clientId: "c-cabries", clientAccess: false, householdLogin: "MAISON-CABRIES", address: "Chemin des oliviers", zip: "13480", city: "Cabriès", type: "Maison", phase: "Découverte / RDV initial", status: "À venir", priority: "Basse", health: "À surveiller", start: "2026-05-10", end: "2026-11-20", progress: 12, worksBudget: 48000, furnitureBudget: 18000, fees: 6800, feesBilled: 0, timeEstimated: 75, image: "https://www.esprit-design-architecture.com/wp-content/uploads/2024/12/Sans-titre-700-x-600-px.png", description: "Projet de démonstration pour une maison familiale à Cabriès.", publicSummary: "Dossier découverte en préparation.", assigned: [] }
  ],
  phases: [
    "Découverte / RDV initial", "Brief", "APS", "APD", "DCE", "Chiffrage", "Préparation", "Exécution", "Livraison", "Clôture"
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
  accessAccounts: [
    { id: "acc-admin", name: "Emmanuelle Gobert", identifier: "admin@esprit-design.fr", role: "admin", projectId: "", status: "Actif", passwordMasked: "••••••••", forceChange: false, permissions: "Tous droits" },
    { id: "acc-collab", name: "Collaborateur agence", identifier: "collaborateur@esprit-design.fr", role: "collaborator", projectId: "london, foch, levis", status: "Actif", passwordMasked: "••••••••", forceChange: false, permissions: "Modification, tâches, CR, documents publiables" },
    { id: "acc-london-email", name: "Foyer London", identifier: "client.london@example.fr", role: "client", projectId: "london", status: "Actif", passwordMasked: "••••••••", forceChange: true, permissions: "Portail client publié" },
    { id: "acc-london-code", name: "Foyer London", identifier: "PROJET-LONDON", role: "client", projectId: "london", status: "Actif", passwordMasked: "••••••••", forceChange: false, permissions: "Accès foyer simplifié" },
    { id: "acc-levis-code", name: "Foyer Lévis", identifier: "PROJET-LEVIS", role: "client", projectId: "levis", status: "Actif", passwordMasked: "••••••••", forceChange: false, permissions: "Accès foyer simplifié" }
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

const globalNav = [
  { view: "cockpit", label: "DASHBOARD AGENCE" },
  { view: "projects", label: "PROJETS" },
  { view: "clients", label: "CLIENTS" },
  { view: "financeGlobal", label: "FINANCES" },
  { view: "planningGlobal", label: "PLANNING GLOBAL" },
  { view: "documentsGlobal", label: "DOCUMENTS" },
  { view: "settings", label: "PARAMETRE" }
];

const projectNav = [
  ["overview", "Vue d'ensemble"],
  ["brief", "Brief & cadrage"],
  ["contract", "Contrat & honoraires"],
  ["phases", "Phases projet"],
  ["moodboards", "Moodboards"],
  ["visuals", "Plans & rendus 3D"],
  ["shopping", "Shopping list / sélections"],
  ["budget", "Budget"],
  ["quotes", "Devis entreprises"],
  ["planning", "Planning"],
  ["decisions", "Décisions client"],
  ["tasks", "Tâches internes"],
  ["site", "Suivi chantier"],
  ["reports", "Comptes rendus"],
  ["documents", "Documents"],
  ["messages", "Messages"],
  ["time", "Temps passé & rentabilité"],
  ["exports", "Exports PDF"],
  ["projectSettings", "Paramètres projet"]
];

const collaboratorProjectNav = projectNav.filter(([view]) => !["contract", "budget", "time", "projectSettings"].includes(view));
const projectViews = new Set(projectNav.map(([view]) => view).concat(["clientHome", "invoices"]));

const clientNav = [
  { group: "Portail client", items: [["clientHome", "Accueil projet"], ["messages", "Messages"], ["decisions", "Mes décisions à valider"], ["brief", "Brief validé"], ["moodboards", "Moodboards"], ["visuals", "Plans & vues 3D"], ["shopping", "Shopping list"], ["budget", "Budget partagé"], ["quotes", "Devis à valider"], ["planning", "Planning"], ["site", "Suivi chantier"], ["reports", "Comptes rendus"], ["documents", "Documents"], ["contract", "Contrat & honoraires"], ["invoices", "Factures & paiements"]] }
];

function money(value) {
  return `${Number(value || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €`;
}

function byProject(collection, projectId = state.activeProjectId) {
  if (!projectId) return [];
  return collection.filter((item) => item.projectId === projectId);
}

function currentRole() {
  return roles[state.role] || roles.client;
}

function currentProject() {
  return db.projects.find((project) => project.id === state.activeProjectId) || null;
}

function currentClient(project = currentProject()) {
  if (!project) return null;
  return db.clients.find((client) => client.id === project.clientId);
}

function visibleProjects() {
  if (state.role === "admin") return db.projects;
  if (state.role === "collaborator") return db.projects.filter((project) => currentRole().projects.includes(project.id));
  return db.projects.filter((project) => project.id === state.activeProjectId);
}

function hasProjectContext() {
  return Boolean(state.activeProjectId && currentProject() && projectViews.has(state.view));
}

function isClientSurface() {
  return state.role === "client" || state.previewClient;
}

function isVisibleClient(item) {
  return (state.role !== "client" && !state.previewClient) || item.visibleClient === true || item.published === true || item.status === "Publié" || item.status === "Validé";
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
  const type = /retard|bloqué|critique|dépassement|risk|faible|mauvaise|refusé|supprimer/i.test(status) ? "danger" : /attente|analyse|cours|proposé|envoyé|watch|surveiller|venir/i.test(status) ? "warn" : "ok";
  return `<span class="status ${type}">${status}</span>`;
}

function actionButton(label, attrs = "", tone = "") {
  return `<button type="button" class="${tone ? `btn-${tone}` : ""}" ${attrs}>${label}</button>`;
}

function moreActions(items) {
  return `<details class="more-actions"><summary aria-label="Options">...</summary><div>${items.join("")}</div></details>`;
}

function searchableText(...values) {
  return values.filter(Boolean).join(" ").toLowerCase();
}

function filteredProjects() {
  const { query, phase, status, priority } = state.filters.projects;
  const global = state.filters.global;
  const q = (query || global || "").trim().toLowerCase();
  return visibleProjects().filter((p) => {
    const client = currentClient(p);
    const text = searchableText(p.name, p.type, p.address, p.zip, p.city, p.phase, p.status, p.priority, p.health, client?.firstName, client?.lastName, client?.email);
    return (!q || text.includes(q))
      && (!phase || p.phase === phase)
      && (!status || p.status === status)
      && (!priority || p.priority === priority);
  });
}

function filteredClients() {
  const q = (state.filters.clients || state.filters.global || "").trim().toLowerCase();
  return db.clients.filter((c) => !q || searchableText(c.civility, c.firstName, c.lastName, c.email, c.phone, c.address, c.city, c.notes, ...c.projectIds.map(projectName)).includes(q));
}

function filteredDocuments(docs) {
  const q = (state.filters.documents || state.filters.global || "").trim().toLowerCase();
  return docs.filter((d) => !q || searchableText(projectName(d.projectId), d.title, d.type, d.phase, d.file, d.status).includes(q));
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
  $("#loginId").value = "";
  $("#loginPassword").value = "";
  $("#loginModal").showModal();
}

function login(identifier, password) {
  const key = identifier.trim();
  const user = demoUsers[key];
  if (!user || user.password !== password) {
    toast("Identifiant ou mot de passe incorrect en mode démo.");
    return;
  }
  state.role = user.role;
  state.demoUser = user;
  state.activeProjectId = user.role === "client" ? user.projectId : null;
  state.view = user.role === "client" ? "clientHome" : "cockpit";
  $("#loginModal").close();
  $("#publicSite").classList.add("hidden");
  $("#app").classList.remove("hidden");
  renderApp();
}

function logout(showLogin = true) {
  state.role = "public";
  state.demoUser = null;
  state.activeProjectId = null;
  state.view = "cockpit";
  state.previewClient = false;
  $("#app").classList.add("hidden");
  $("#publicSite").classList.remove("hidden");
  if (showLogin) window.setTimeout(openLogin, 50);
}

function returnToPublicSite() {
  logout(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goDashboard() {
  state.previewClient = false;
  if (state.role === "client") {
    state.view = "clientHome";
  } else if (state.previewClient) {
    $("#sidebar").innerHTML = clientNav.map((group) => `
      <h3>Prévisualisation client</h3>
      ${group.items.map(([view, label]) => `<button type="button" data-view="${view}" class="${state.view === view ? "active" : ""}">${label}</button>`).join("")}
    `).join("");
  } else {
    state.activeProjectId = null;
    state.view = "cockpit";
  }
  renderApp();
}

function renderApp() {
  const role = currentRole();
  $("#workspaceTitle").textContent = state.role === "client" ? "Portail client" : "Cockpit agence";
  $("#roleBadge").textContent = role.label;
  renderSidebar();
  renderProjectContext();
  renderView();
}

function renderSidebar() {
  if (state.role === "client") {
    $("#sidebar").innerHTML = clientNav.map((group) => `
      <h3>${group.group}</h3>
      ${group.items.map(([view, label]) => `<button type="button" data-view="${view}" class="${state.view === view ? "active" : ""}">${label}</button>`).join("")}
    `).join("");
  } else {
    const project = currentProject();
    const nav = state.role === "collaborator" ? collaboratorProjectNav : projectNav;
    $("#sidebar").innerHTML = `
      <h3>Agence</h3>
      <form class="sidebar-search" id="globalSearchForm"><label>Recherche<input id="globalSearch" value="${state.filters.global}" placeholder="Projet, client, document"></label></form>
      ${(state.role === "collaborator" ? globalNav.filter((item) => !["financeGlobal", "settings"].includes(item.view)) : globalNav).map((item) => `<button type="button" data-view="${item.view}" class="${state.view === item.view || (item.view === "projects" && hasProjectContext()) ? "active" : ""}">${item.label}</button>`).join("")}
      ${hasProjectContext() ? `<h3>Projet / ${project.name.replace("Projet ", "")}</h3>${nav.map(([view, label]) => `<button type="button" data-view="${view}" class="${state.view === view ? "active" : ""}">${label}</button>`).join("")}` : ""}
    `;
  }
  const globalSearchForm = $("#globalSearchForm");
  if (globalSearchForm) globalSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.filters.global = $("#globalSearch").value.trim();
    state.activeProjectId = null;
    state.previewClient = false;
    state.showClientForm = false;
    state.view = "projects";
    renderApp();
  });
  $$("[data-view]").forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.view;
    if (state.view === "clients") state.showClientForm = false;
    if (state.role !== "client" && !state.previewClient && !projectViews.has(state.view)) state.activeProjectId = null;
    if (!projectViews.has(state.view)) state.previewClient = false;
    renderApp();
  }));
}

function renderProjectContext() {
  const project = currentProject();
  const context = $("#projectContext");
  if (!project || (state.role !== "client" && !projectViews.has(state.view))) {
    context.classList.add("hidden");
    return;
  }
  context.classList.remove("hidden");
  const client = currentClient(project);
  const label = projectNav.find(([view]) => view === state.view)?.[1] || (state.view === "clientHome" ? "Accueil projet" : "Projet");
  $("#breadcrumb").textContent = state.role === "client" ? `${project.name} / ${label}` : `Projets / ${project.name} / ${label}`;
  $("#projectContextTitle").textContent = project.name;
  $("#activeProjectMeta").textContent = `${client?.civility || ""} ${client?.firstName || ""} ${client?.lastName || ""} · ${project.zip || ""} ${project.city || project.address} · ${project.type} · ${project.phase} · ${project.status}`;
  $("#visibilityLegend").innerHTML = state.role === "client" || state.previewClient
    ? `${badge("Vue client filtrée", "public")} ${badge(project.householdLogin, "public")}`
    : `${badge(project.priority, project.priority === "Haute" ? "warn" : "public")} ${statusBadge(project.health)} ${project.clientAccess ? badge("Portail client actif", "public") : badge("Portail client inactif", "private")}`;
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
    financeGlobal: renderFinanceGlobal,
    planningGlobal: renderPlanningGlobal,
    documentsGlobal: renderDocumentsGlobal,
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
  if (state.role !== "client" && projectViews.has(view) && !currentProject()) {
    state.view = "projects";
    $("#viewRoot").innerHTML = renderProjects();
    bindViewActions();
    return;
  }
  const renderer = map[view] || renderCockpit;
  $("#viewRoot").innerHTML = renderer();
  bindViewActions();
}

function cockpitMetrics() {
  const projects = visibleProjects();
  const waitingDecisions = db.decisions.filter((d) => projects.some((p) => p.id === d.projectId) && d.status === "En attente").length;
  const delayed = projects.filter((p) => p.health === "À surveiller" || p.health === "Mauvaise").length;
  const overBudget = projects.filter((p) => budgetTotals(p.id).remaining < 0).length;
  const reportsToPublish = db.reports.filter((r) => projects.some((p) => p.id === r.projectId) && !r.visibleClient).length;
  const urgentTasks = db.tasks.filter((t) => projects.some((p) => p.id === t.projectId) && t.priority === "Haute" && t.status !== "Terminé").length;
  const weekTime = db.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  return { active: projects.length, delayed, waitingDecisions, overBudget, reportsToPublish, urgentTasks, weekTime };
}

function renderCockpit() {
  return `
    ${renderViewTitle(state.role === "admin" ? "Dashboard" : "Espace collaborateur", "Vue globale de l'agence : planning multi-projets et suivi financier des honoraires.", `${actionButton("Créer client", 'data-action="new-client"', "compact")}${actionButton("Créer projet", 'data-action="new-project"', "compact")}`)}
    <div class="grid cols-2 dashboard-focus">
      <div class="table-card dashboard-panel"><h3>Gantt Global</h3>${renderGantt()}</div>
      <div class="table-card dashboard-panel"><h3>Suivi financier</h3>${renderFeesTable()}</div>
    </div>
  `;
}

function renderFeesTable() {
  const projects = visibleProjects();
  const totalFees = projects.reduce((sum, p) => sum + p.fees, 0);
  const totalPaid = projects.reduce((sum, p) => sum + p.feesBilled, 0);
  const rows = projects.map((p) => `<tr><td>${p.name}</td><td>${currentClient(p)?.civility || ""} ${currentClient(p)?.lastName || ""}</td><td>${money(p.fees)}</td><td>${money(p.feesBilled)}</td><td>${money(p.fees - p.feesBilled)}</td></tr>`).join("");
  return `<div class="table-wrap"><table><thead><tr><th>Projet</th><th>Client</th><th>Honoraires</th><th>Payé</th><th>Reste</th></tr></thead><tbody>${rows}<tr><td><strong>Total</strong></td><td></td><td><strong>${money(totalFees)}</strong></td><td><strong>${money(totalPaid)}</strong></td><td><strong>${money(totalFees - totalPaid)}</strong></td></tr></tbody></table></div>`;
}

function renderRecentProjects() {
  return `<div class="mini-list">${visibleProjects().slice(0, 4).map((p) => `<button type="button" data-open-project="${p.id}"><strong>${p.name}</strong><span>${p.phase} · ${p.progress}%</span></button>`).join("")}</div>`;
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
  const projects = filteredProjects();
  const rows = projects.map((p) => {
    const totals = budgetTotals(p.id);
    const client = currentClient(p);
    const paid = totals.engaged;
    const completion = totals.validated ? Math.round((paid / totals.validated) * 100) : p.progress;
    return `<tr><td><strong>${client?.civility || ""} ${client?.lastName || ""}</strong><br>${client?.firstName || ""}</td><td>${p.name}</td><td>${p.zip || ""} ${p.city || ""}<br>${p.type}</td><td>${p.phase}<br>${statusBadge(p.status)}</td><td>${p.priority}<br>${statusBadge(p.health)}</td><td>${money(totals.validated || totals.planned)}<br>${money(paid)} payé · ${completion}%</td><td>${p.clientAccess ? badge("Actif", "public") : badge("Inactif", "private")}</td><td class="table-actions">${actionButton("Ouvrir le projet", `data-open-project="${p.id}"`, "compact")}${moreActions([actionButton("Visualiser portail client", `data-preview-client="${p.id}"`), actionButton("Supprimer", `data-delete-project="${p.id}"`, "danger")])}</td></tr>`;
  }).join("");
  const f = state.filters.projects;
  return `
    ${renderViewTitle("Projets", "Liste globale de l'agence : filtres, statuts, budgets, portails client et actions.", `${actionButton("Créer projet", 'data-action="new-project"', "compact")}${actionButton(state.viewMode === "table" ? "Vue cartes" : "Vue tableau", "data-toggle-project-view", "ghost")}`)}
    <form class="filter-bar" id="projectFilters">
      <input name="query" value="${f.query}" placeholder="Rechercher un projet, client ou ville" />
      <select name="phase" aria-label="Filtre phase"><option value="">Toutes phases</option>${db.phases.map((p) => `<option value="${p}" ${f.phase === p ? "selected" : ""}>${p}</option>`).join("")}</select>
      <select name="status" aria-label="Filtre statut"><option value="">Tous statuts</option>${["À venir", "En cours", "Terminé"].map((s) => `<option value="${s}" ${f.status === s ? "selected" : ""}>${s}</option>`).join("")}</select>
      <select name="priority" aria-label="Filtre priorité"><option value="">Toutes priorités</option>${["Haute", "Normale", "Basse"].map((p) => `<option value="${p}" ${f.priority === p ? "selected" : ""}>${p}</option>`).join("")}</select>
      <button type="submit" class="btn-compact">Rechercher</button>
    </form>
    ${state.viewMode === "cards" ? renderProjectCards(projects) : `<div class="table-card table-wrap"><table><thead><tr><th>Nom client</th><th>Nom projet</th><th>Adresse et type</th><th>Phase / statut</th><th>Priorité / santé</th><th>Budget / avancement</th><th>Portail client</th><th>Actions</th></tr></thead><tbody>${rows || `<tr><td colspan="8"><div class="empty">Aucun projet ne correspond à cette recherche.</div></td></tr>`}</tbody></table></div>`}
  `;
}

function renderProjectCards(projects = filteredProjects()) {
  return `<div class="grid cols-3">${projects.map((p) => `<article class="card project-card"><img src="${p.image}" alt="${p.name}" /><div><h3>${p.name}</h3><p>${p.zip || ""} ${p.city || ""} · ${p.type}</p><p>${p.description}</p>${statusBadge(p.status)} ${statusBadge(p.health)} ${p.clientAccess ? badge("Portail actif", "public") : badge("Portail inactif", "private")}<div class="actions">${actionButton("Ouvrir le projet", `data-open-project="${p.id}"`, "compact")}${moreActions([actionButton("Visualiser portail client", `data-preview-client="${p.id}"`), actionButton("Supprimer", `data-delete-project="${p.id}"`, "danger")])}</div></div></article>`).join("") || `<div class="empty">Aucun projet ne correspond à cette recherche.</div>`}</div>`;
}

function renderClients() {
  const clients = filteredClients();
  return `${renderViewTitle("Clients", "Base clients simple : coordonnées, préférences, notes internes et projets associés.", `<button class="btn-compact" data-action="new-client">Créer client</button>`)}
    <form class="filter-bar" id="clientFilters"><input name="query" value="${state.filters.clients}" placeholder="Rechercher un client, email, téléphone ou projet" /><button type="submit" class="btn-compact">Rechercher</button></form>
    ${state.showClientForm ? `<div class="card"><h3>Nouveau client</h3><div class="form-grid">
      <label>Civilité<select><option>Mme</option><option>M.</option><option>Foyer</option></select></label>
      <label>Prénom<input placeholder="Claire"></label>
      <label>Nom<input placeholder="Martin"></label>
      <label>Email<input type="email" placeholder="client@example.fr"></label>
      <label>Téléphone<input placeholder="06 ..."></label>
      <label>Adresse<input placeholder="Adresse"></label>
      <label>Ville<input placeholder="Paris"></label>
      <label>Communication préférée<select><option>Portail</option><option>Email</option><option>Téléphone</option></select></label>
      <label class="full">Notes internes<textarea rows="3" placeholder="Notes non visibles client"></textarea></label>
    </div></div>` : ""}
    <div class="table-card table-wrap"><table><thead><tr><th>Client</th><th>Contact</th><th>Adresse</th><th>Communication</th><th>Projets</th><th>Notes internes</th></tr></thead><tbody>${clients.map((c) => `<tr><td><strong>${c.civility || ""} ${c.firstName} ${c.lastName}</strong></td><td>${c.email}<br>${c.phone}</td><td>${c.address}<br>${c.zip || ""} ${c.city || ""}</td><td>${c.communication}</td><td>${c.projectIds.map(projectName).join(", ")}</td><td>${state.role === "client" ? badge("Masqué", "private") : c.notes}</td></tr>`).join("") || `<tr><td colspan="6"><div class="empty">Aucun client ne correspond à cette recherche.</div></td></tr>`}</tbody></table></div>`;
}

function renderProspects() {
  return `${renderViewTitle("Prospects simples", "Demandes entrantes sans CRM marketing lourd.", `<button data-action="new-prospect">Créer prospect</button>`)}
    <div class="table-card table-wrap"><table><thead><tr><th>Nom</th><th>Contact</th><th>Source</th><th>Type</th><th>Budget</th><th>Délai</th><th>Statut</th><th>Prochaine action</th><th>Notes</th></tr></thead><tbody>${db.prospects.map((p) => `<tr><td>${p.name}</td><td>${p.contact}</td><td>${p.source}</td><td>${p.type}</td><td>${money(p.budget)}</td><td>${p.deadline}</td><td>${statusBadge(p.status)}</td><td>${p.nextAction}</td><td>${p.notes}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderFinanceGlobal() {
  const projects = visibleProjects();
  const rows = projects.map((p) => {
    const totals = budgetTotals(p.id);
    const profit = profitability(p);
    return `<tr><td><button class="link-action" data-open-project="${p.id}">${p.name}</button></td><td>${money(totals.planned)}</td><td>${money(totals.validated)}</td><td>${money(totals.engaged)}</td><td>${money(totals.remaining)}</td><td>${currentRole().canSeeProfitability ? `${profit.rate} €/h · ${profit.level}` : badge("Masqué", "private")}</td><td>${p.clientAccess ? badge("Portail actif", "public") : badge("Portail inactif", "private")}</td></tr>`;
  }).join("");
  return `${renderViewTitle("Finances", "Vue globale agence : budgets, engagements, restes disponibles et indicateurs internes.", `<button class="btn-compact" data-action="new-budget-line">Ajouter ligne globale</button>`)}
    <div class="table-card table-wrap"><table><thead><tr><th>Projet</th><th>Prévu</th><th>Validé</th><th>Engagé</th><th>Reste</th><th>Rentabilité</th><th>Portail</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderPlanningGlobal() {
  return `${renderViewTitle("Planning global", "Vue multi-projets de l'agence : phases, jalons et alertes de retard.", `<button class="btn-compact" data-action="new-project">Créer jalon</button>`)}
    <div class="table-card table-wrap"><h3>Gantt global multi-projets</h3>${renderGantt()}</div>
    <div class="grid cols-3" style="margin-top:14px">${visibleProjects().map((p) => `<div class="card"><h3>${p.name}</h3>${statusBadge(p.status)}<p>${p.phase}<br>${p.start} → ${p.end}</p><div class="mini-gantt"><i style="width:${p.progress}%"></i></div><button class="btn-compact" data-open-project="${p.id}">Ouvrir le projet</button></div>`).join("")}</div>`;
}

function renderDocumentsGlobal() {
  const projectIds = visibleProjects().map((p) => p.id);
  const docs = filteredDocuments(db.documents.filter((d) => projectIds.includes(d.projectId)));
  const rows = docs.map((d) => `<tr><td>${projectName(d.projectId)}</td><td>${d.title}</td><td>${d.type}</td><td>${d.phase}</td><td>${d.file}</td><td>${d.date}</td><td>${statusBadge(d.status === "Publié" ? "Finalisé" : d.status)}</td><td>${visibilityBadge(d)}</td><td class="table-actions">${actionButton("Ouvrir projet", `data-open-project="${d.projectId}"`, "compact")}${moreActions([actionButton("Voir document", 'data-action="view-document"'), actionButton(d.visibleClient ? "Masquer" : "Publier", `data-doc-publish="${d.id}"`, d.visibleClient ? "" : "success"), actionButton("Supprimer", 'data-action="delete-document"', "danger")])}</td></tr>`).join("");
  return `${renderViewTitle("Documents globaux", "Bibliothèque agence transversale : factures, devis, contrats, plans, rendus et comptes rendus.", `<button class="btn-compact" data-action="new-document">Ajouter document</button>`)}
    <form class="filter-bar" id="documentFilters"><input name="query" value="${state.filters.documents}" placeholder="Rechercher un document, type, projet ou fichier" /><button type="submit" class="btn-compact">Rechercher</button></form>
    <div class="table-card table-wrap"><table><thead><tr><th>Projet</th><th>Titre</th><th>Type</th><th>Phase</th><th>Fichier</th><th>Date</th><th>Statut</th><th>Visibilité</th><th>Action</th></tr></thead><tbody>${rows || `<tr><td colspan="9"><div class="empty">Aucun document ne correspond à cette recherche.</div></td></tr>`}</tbody></table></div>`;
}

function renderOverview() {
  const p = currentProject();
  if (!p) return emptyView("Projet", "Ouvrez un projet depuis la page Projets.");
  const totals = budgetTotals(p.id);
  const decisions = byProject(db.decisions).filter((d) => d.status === "En attente");
  return `
    ${renderViewTitle(p.name, "Vue d'ensemble du projet : budget, décisions, documents, messages et alertes.", `<button data-ai-summary="admin">Résumé IA projet</button><button data-ai-summary="client">Résumé client</button><button data-action="new-document">Nouveau document</button><button data-action="new-meeting">Réunion à planifier</button><button data-action="publish-overview">Publier synthèse</button><button data-action="print-export">Exporter / imprimer</button>`)}
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
  if (!p) return emptyView("Portail client", "Aucun projet client n'est rattaché à cette session.");
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
  return `${renderViewTitle("Phases projet", "Timeline, livrables, validations et avancement du projet.")}
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
  const rows = byProject(db.budgets).filter((b) => !isClientSurface() || b.published).map((b) => `<tr><td>${b.lot}</td><td>${b.room}</td><td>${money(b.planned)}</td><td>${money(b.validated)}</td><td>${money(b.engaged)}</td><td>${money(b.validated - b.engaged)}</td><td>${b.source}</td><td>${b.published ? badge("Publié", "public") : badge("Interne", "private")}</td></tr>`).join("");
  return `${renderViewTitle(isClientSurface() ? "Budget partagé" : "Budget", "Budget propre au projet ouvert, relié aux achats, devis et factures analysées.", !isClientSurface() ? `<button data-action="new-budget-line">Ajouter ligne</button>` : "")}
    <div class="grid cols-4"><div class="kpi"><strong>${money(totals.planned)}</strong><span>Prévu</span></div><div class="kpi"><strong>${money(totals.validated)}</strong><span>Validé</span></div><div class="kpi"><strong>${money(totals.engaged)}</strong><span>Engagé</span></div><div class="kpi"><strong>${money(totals.remaining)}</strong><span>Reste</span></div></div>
    <div class="table-card table-wrap" style="margin-top:14px"><table><thead><tr><th>Lot</th><th>Pièce</th><th>Prévu</th><th>Validé</th><th>Engagé</th><th>Reste</th><th>Source</th><th>Publication</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderQuotes() {
  const rows = byProject(db.quotes).filter(isVisibleClient).map((q) => `<tr><td>${q.company}</td><td>${q.lot}</td><td>${money(q.amount)}</td><td>${statusBadge(q.status)}</td><td>${q.file}</td><td>${q.received}</td><td>${q.validated || "—"}</td><td>${visibilityBadge(q)}</td><td>${q.agencyComment}</td></tr>`).join("");
  return tableView("Devis entreprises", "Devis artisans, comparaison simple, rattachement budget et décision client.", ["Entreprise", "Lot", "Montant", "Statut", "Fichier", "Réception", "Validation", "Visibilité", "Commentaire"], rows);
}

function renderPlanning() {
  return `${renderViewTitle("Planning", "Planning du projet, jalons, Gantt premium et alertes retard.")}
    <div class="grid cols-3" style="margin-top:14px">${byProject(db.phaseRecords).map((p) => `<div class="card"><h3>${p.name}</h3>${statusBadge(p.status)}<p>${p.start} → ${p.end}</p><div class="mini-gantt"><i style="width:${p.progress}%"></i></div></div>`).join("")}</div>`;
}

function renderDecisions() {
  const rows = byProject(db.decisions).map((d) => `<tr><td>${d.title}<br><small>${d.description}</small></td><td>${d.type}</td><td>${d.version}</td><td>${d.requested}</td><td>${d.answered || "—"}</td><td>${statusBadge(d.status)}</td><td>${d.validatedBy || "—"}</td><td>${d.clientComment || "—"}</td><td><button data-validate="${d.id}" data-result="Validé">Valider</button><button data-validate="${d.id}" data-result="Refusé">Refuser</button><button data-validate="${d.id}" data-result="Modification demandée">Modifier</button></td></tr>`).join("");
  return tableView("Décisions client", "Validations structurées et tracées : qui, quoi, quand, version et commentaire.", ["Décision", "Type", "Version", "Demandée", "Réponse", "Statut", "Validé par", "Commentaire", "Actions"], rows);
}

function renderTasks() {
  if (isClientSurface()) return emptyView("Tâches internes", "Les tâches internes ne sont jamais visibles côté client.");
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
  const rows = byProject(db.documents).filter(isVisibleClient).map((d) => `<tr><td>${d.title}</td><td>${d.type}</td><td>${d.phase}</td><td>${d.file}</td><td>${d.date}</td><td>${d.version}</td><td>${statusBadge(d.status)}</td><td>${visibilityBadge(d)}</td><td>${!isClientSurface() ? `<button data-doc-publish="${d.id}">${d.visibleClient ? "Masquer" : "Publier"}</button>` : "<button>Télécharger</button>"}</td></tr>`).join("");
  return `${renderViewTitle("Documents", "Bibliothèque filtrable : contrats, devis, factures, plans, rendus, photos, CR et documents internes.", !isClientSurface() ? `<button data-action="new-document">Ajouter document</button>` : "")}
    ${renderDocumentImport()}
    <div class="table-card table-wrap" style="margin-top:14px"><table><thead><tr><th>Titre</th><th>Type</th><th>Phase</th><th>Fichier</th><th>Date</th><th>Version</th><th>Statut</th><th>Visibilité</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderDocumentImport() {
  if (isClientSurface()) return "";
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
  const visible = byProject(db.messages).filter((m) => !isClientSurface() || !m.internal);
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
    <div class="grid cols-3">${exports.map((name) => `<div class="card"><h3>${name}</h3><p>Export imprimable du projet ouvert.</p><button data-action="print-export">Exporter / imprimer</button></div>`).join("")}</div>`;
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
  const accessRows = db.accessAccounts.map((u) => `<tr><td><strong>${u.name}</strong><br>${u.identifier}</td><td>${u.role}</td><td>${u.projectId ? projectName(u.projectId) : "Agence"}</td><td>${u.passwordMasked}</td><td>${statusBadge(u.status)}</td><td>${u.permissions}</td><td class="table-actions">${actionButton("Modifier", `data-action="edit-access" data-id="${u.id}"`, "compact")}${moreActions([actionButton("Réinitialiser", `data-action="reset-client-code" data-id="${u.id}"`), actionButton(u.status === "Actif" ? "Désactiver" : "Réactiver", `data-action="${u.status === "Actif" ? "disable-access" : "enable-access"}" data-id="${u.id}"`, u.status === "Actif" ? "danger" : "success")])}</td></tr>`).join("");
  return `${renderViewTitle("Paramètres", "Réglages essentiels : accès, rôles, charte, statuts et seuils.", `${actionButton("Créer utilisateur", 'data-action="new-user"', "compact")}${actionButton("Enregistrer", 'data-action="save-settings"', "compact")}`)}
    <div class="settings-hero">
      <img src="https://www.esprit-design-architecture.com/wp-content/uploads/2025/01/Design-sans-titre-2025-01-15T143328.321.png" alt="Logo Esprit Design Architecture" />
      <div><h3>Esprit Design Architecture</h3><p>Portail privé, accès clients et paramètres de démonstration.</p></div>
    </div>
    <div class="grid cols-2">
      <div class="card full-span"><h3>Utilisateurs & accès</h3><div class="table-wrap"><table><thead><tr><th>Identifiant</th><th>Rôle</th><th>Projet lié</th><th>Mot de passe</th><th>Statut</th><th>Permissions</th><th>Actions</th></tr></thead><tbody>${accessRows}</tbody></table></div></div>
      <div class="card full-span"><h3>Créer un accès client</h3><div class="form-grid">
        <label>Nom client / foyer<input id="accessName" placeholder="Foyer London"></label>
        <label>Projet rattaché<select id="accessProject">${db.projects.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}</select></label>
        <label>Email ou identifiant<input id="accessIdentifier" placeholder="client.london@example.fr ou PROJET-LONDON"></label>
        <label>Rôle<select><option>client</option></select></label>
        <label>Portail actif<select id="accessPortal"><option>Oui</option><option>Non</option></select></label>
        <label>Statut<select id="accessStatus"><option>Actif</option><option>Inactif</option></select></label>
        <label>Premier mot de passe / code<input id="accessPassword" type="password"></label>
        <label>Confirmation<input id="accessPasswordConfirm" type="password"></label>
        <label class="full"><input type="checkbox" id="accessForceChange"> Forcer le changement du mot de passe à la première connexion</label>
      </div><div class="actions">${actionButton("Créer accès client", 'data-action="create-client-access"', "success")}</div></div>
      <div class="card"><h3>Permissions collaborateur</h3><p>Lecture seule, modification, publication côté client, comptes rendus, shopping list, tâches, budget visible client, documents internes, temps/rentabilité si autorisé.</p>${actionButton("Modifier permissions", 'data-action="edit-permissions"', "compact")}</div>
      <div class="card"><h3>Seuils rentabilité</h3><p>Bonne : ${db.settings.profitability.good} €/h<br>Moyenne : ${db.settings.profitability.medium} €/h<br>Faible : ${db.settings.profitability.weak} €/h<br>Non rentable : sous ${db.settings.profitability.weak} €/h</p></div>
      <div class="card"><h3>Charte</h3><p>Blair TTC / Acumin Variable Concept avec Poppins en alternative web. Aucune police manuscrite n'est utilisée dans le portail.</p>${Object.entries(db.settings.brand).map(([k, v]) => `<span class="badge" style="background:${v};color:var(--beige)">${k} ${v}</span>`).join(" ")}</div>
      <div class="card"><h3>Statuts éditables</h3><p><strong>Phases</strong><br>${db.phases.join(" · ")}</p><p><strong>Documents</strong><br>Brouillon · Finalisé · Archivé</p><p><strong>Produits</strong><br>Idée interne · Proposé au client · Validé · Refusé · Alternative demandée · À commander · Commandé · Reçu · Installé</p></div>
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
    return `<div class="gantt-row"><span class="gantt-name">${p.name}</span>${columns.map((phase, index) => `<span class="gantt-cell" title="${phase}">${index <= activeIndex ? `<i class="gantt-bar ${p.health === "À surveiller" && index === activeIndex ? "warn" : ""}" style="width:${index === activeIndex ? p.progress : 100}%"></i>` : ""}</span>`).join("")}</div>`;
  }).join("")}</div>`;
}

function projectName(id) {
  return db.projects.find((p) => p.id === id)?.name || id;
}

function budgetTotals(projectId = state.activeProjectId) {
  const lines = byProject(db.budgets, projectId).filter((b) => !isClientSurface() || b.published);
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
  const projectFilters = $("#projectFilters");
  if (projectFilters) projectFilters.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(projectFilters);
    state.filters.projects = {
      query: String(data.get("query") || "").trim(),
      phase: String(data.get("phase") || ""),
      status: String(data.get("status") || ""),
      priority: String(data.get("priority") || "")
    };
    renderApp();
  });
  const clientFilters = $("#clientFilters");
  if (clientFilters) clientFilters.addEventListener("submit", (event) => {
    event.preventDefault();
    state.filters.clients = String(new FormData(clientFilters).get("query") || "").trim();
    state.showClientForm = false;
    renderApp();
  });
  const documentFilters = $("#documentFilters");
  if (documentFilters) documentFilters.addEventListener("submit", (event) => {
    event.preventDefault();
    state.filters.documents = String(new FormData(documentFilters).get("query") || "").trim();
    renderApp();
  });
  $$("[data-open-project]").forEach((btn) => btn.addEventListener("click", () => enterProject(btn.dataset.openProject)));
  $$("[data-preview-client]").forEach((btn) => btn.addEventListener("click", () => previewClientPortal(btn.dataset.previewClient)));
  $$("[data-delete-project]").forEach((btn) => btn.addEventListener("click", () => confirmDeleteProject(btn.dataset.deleteProject)));
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

function enterProject(projectId, view = "overview") {
  if (!visibleProjects().some((p) => p.id === projectId)) return;
  state.previewClient = false;
  state.activeProjectId = projectId;
  state.view = view;
  renderApp();
  toast(`${projectName(projectId)} ouvert.`);
}

function previewClientPortal(projectId) {
  if (!visibleProjects().some((p) => p.id === projectId)) return;
  state.activeProjectId = projectId;
  state.previewClient = true;
  state.view = "clientHome";
  renderApp();
  toast(`Prévisualisation du portail client : ${projectName(projectId)}.`);
}

function confirmDeleteProject(projectId) {
  const project = db.projects.find((p) => p.id === projectId);
  if (!project) return;
  if (window.confirm(`Supprimer ${project.name} en mode démo ? Cette action demande confirmation.`)) {
    project.status = "Archivé";
    toast(`${project.name} marqué comme archivé en mode démo.`);
    renderApp();
  }
}

function handleAction(action) {
  const project = currentProject();
  if (action === "create-client-access") return createClientAccess();
  if (action === "new-client") {
    state.activeProjectId = null;
    state.previewClient = false;
    state.view = "clients";
    state.showClientForm = true;
    renderApp();
    toast("Formulaire nouveau client ouvert.");
    return;
  }
  if (action === "new-project") {
    state.activeProjectId = null;
    state.previewClient = false;
    state.view = "projects";
    renderApp();
    toast("Page Projets ouverte pour créer ou consulter un projet.");
    return;
  }
  if (action === "new-document" && !project) {
    state.view = "documentsGlobal";
    renderApp();
    toast("Bibliothèque documents ouverte.");
    return;
  }
  const messages = {
    "archive-project": `${project?.name || "Projet"} archivé en mode démo.`,
    "new-prospect": "Prospect de démonstration ajouté.",
    "publish-overview": `Synthèse ${project?.name || "projet"} publiée côté client.`,
    "publish-brief": "Visibilité brief mise à jour en mode démo.",
    "new-moodboard": "Moodboard brouillon créé.",
    "new-product": "Produit de démonstration ajouté à la shopping list.",
    "print-shopping": "Ouverture impression shopping list.",
    "new-budget-line": project ? "Ligne budget ajoutée au projet." : "Ligne budget globale ajoutée en mode démo.",
    "new-site-point": "Point chantier ajouté en mode démo.",
    "print-report": "Préparation impression compte rendu.",
    "new-document": "Document interne ajouté.",
    "view-document": "Document ouvert en aperçu démo.",
    "delete-document": "Suppression document confirmée en mode démo.",
    "new-meeting": "Réunion projet planifiée en mode démo.",
    "new-message": "Message projet ajouté.",
    "new-time": "Entrée temps ajoutée.",
    "print-export": "Préparation export imprimable.",
    "reset-client-code": "Code client réinitialisé en mode démo.",
    "toggle-client-access": "Accès client modifié en mode démo.",
    "disable-access": "Accès désactivé en mode démo.",
    "enable-access": "Accès réactivé en mode démo.",
    "edit-access": "Édition de l'accès ouverte en mode démo.",
    "edit-permissions": "Permissions collaborateur mises à jour en mode démo.",
    "new-template": "Modèle ajouté.",
    "edit-template": "Édition modèle ouverte.",
    "new-user": "Utilisateur de démonstration créé.",
    "save-settings": "Paramètres enregistrés."
  };
  if (action?.includes("print")) window.print();
  toast(messages[action] || "Action réalisée en mode démo.");
}

function createClientAccess() {
  const name = $("#accessName")?.value.trim();
  const identifier = $("#accessIdentifier")?.value.trim();
  const password = $("#accessPassword")?.value;
  const confirm = $("#accessPasswordConfirm")?.value;
  if (!name || !identifier) return toast("Nom et identifiant obligatoires.");
  if (!password) return toast("Mot de passe initial obligatoire.");
  if (password !== confirm) return toast("Les mots de passe ne correspondent pas.");
  if (demoUsers[identifier] || db.accessAccounts.some((account) => account.identifier === identifier)) return toast("Identifiant déjà existant.");
  const projectId = $("#accessProject").value;
  db.accessAccounts.push({ id: `acc-${Date.now()}`, name, identifier, role: "client", projectId, status: $("#accessStatus").value, passwordMasked: "••••••••", forceChange: $("#accessForceChange").checked, permissions: "Portail client publié" });
  demoUsers[identifier] = { password, role: "client", name, projectId };
  toast("Accès client créé en mode démo. Mot de passe masqué dans le tableau.");
  renderApp();
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
  $("#loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    login($("#loginId").value.trim(), $("#loginPassword").value);
  });
  $("#forgotPasswordBtn").addEventListener("click", () => $("#forgotModal").showModal());
  $("#forgotForm").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#forgotModal").close();
    toast("Si ce compte existe, un email de réinitialisation a été envoyé.");
  });
  $("#loginBackSiteBtn").addEventListener("click", () => $("#loginModal").close());
  $("#workspaceHomeBtn").addEventListener("click", goDashboard);
  $("#logoutBtn").addEventListener("click", logout);
  $("#backToSiteBtn").addEventListener("click", returnToPublicSite);
  $("#contactForm").addEventListener("submit", (event) => { event.preventDefault(); toast("Demande enregistrée en mode démo."); event.target.reset(); });
}

init();
