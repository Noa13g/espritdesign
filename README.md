# Esprit Design Architecture - Portail V2

Portail privé professionnel de démonstration pour Esprit Design Architecture. Cette version applique le cahier des charges V2, le document `Doc1.docx`, la correction de navigation sans sélecteur projet global, et les règles de confidentialité agence/collaborateur/client.

## Lancement

```bash
npm start
```

Puis ouvrir :

```text
http://127.0.0.1:4174/
```

Vérification syntaxe :

```bash
npm run check
```

## Authentification démo

La page de connexion ne propose aucun choix de rôle. Le rôle est détecté automatiquement par l'identifiant et le mot de passe.

| Rôle | Identifiant | Mot de passe | Arrivée |
| --- | --- | --- | --- |
| Admin agence | `admin@esprit-design.fr` | `demo` | Dashboard agence |
| Collaborateur | `collaborateur@esprit-design.fr` | `demo` | Espace collaborateur limité |
| Client London email | `client.london@example.fr` | `London2026!` | Portail Projet London |
| Client London foyer | `PROJET-LONDON` | `London2026` | Portail Projet London |
| Client Lévis email | `client.levis@example.fr` | `Levis2026!` | Portail Projet Lévis |
| Client Lévis foyer | `PROJET-LEVIS` | `Levis2026` | Portail Projet Lévis |

Le lien `Mot de passe oublié ?` ouvre une modale et affiche toujours : `Si ce compte existe, un email de réinitialisation a été envoyé.` Aucun email réel n'est envoyé en mode démo.

## Navigation

- `Accès privé` ouvre la connexion.
- `Dashboard agence` est une page globale multi-projets.
- Il n'y a aucun sélecteur de projet global.
- Pour entrer dans un projet : `Projets` > `Ouvrir le projet`.
- Les menus projet apparaissent uniquement dans un projet ouvert.
- Le bouton `Cockpit agence` dans le header revient au dashboard global et sort du contexte projet.
- Le bouton `Site public` ferme l'espace privé : pour revenir au portail, il faut se reconnecter.

## Pages globales agence

- Dashboard agence : KPIs, boutons Créer client / Créer projet, Gantt global, suivi financier honoraires, alertes et documents financiers récents.
- Projets : tableau avec nom client, nom projet, adresse/type, phase/statut, priorité/santé, budget/avancement, portail client et actions.
- Clients : base clients, coordonnées, communication, notes internes.
- Finances : budgets, engagements, restes disponibles et rentabilité interne.
- Planning global : Gantt multi-projets et cartes projets.
- Documents : bibliothèque transversale agence.
- Paramètres : utilisateurs, rôles, accès, premier mot de passe client, permissions, charte, seuils et statuts.

## Gestion des accès

Dans `Paramètres > Utilisateurs & accès`, l'admin voit les mots de passe masqués (`••••••••`) et peut simuler :

- création admin / collaborateur / client ;
- association d'un client à un projet ;
- choix manuel du premier mot de passe ;
- confirmation obligatoire ;
- rejet mot de passe vide ;
- rejet identifiant déjà existant ;
- reset, modification, désactivation et réactivation ;
- permissions collaborateur.

Les mots de passe sont stockés en clair dans `app.js` uniquement pour la démonstration locale. En production, ils devront être hashés côté serveur.

## Espaces

Admin :
- voit tout, y compris finances, temps passé, rentabilité, notes et documents internes.

Collaborateur :
- voit uniquement les projets assignés ;
- ne voit pas rentabilité, marges, finances sensibles ni temps global par défaut.

Client :
- arrive directement dans son projet ;
- ne voit ni dashboard agence, ni autres projets, ni paramètres ;
- ne voit que les éléments publiés de son projet.

## Modules projet conservés

Vue d'ensemble, brief, contrat, phases, moodboards, plans/rendus 3D, shopping list, budget, devis, planning projet, décisions, tâches internes, suivi chantier, comptes rendus, documents, messages, temps/rentabilité, exports et paramètres projet.

## IA limitée

Endpoint :

```text
POST /api/ai
```

Actions autorisées uniquement :

- `summarizeProject`
- `analyzeDocument`

Toute autre action est rejetée. Sans `OPENAI_API_KEY`, le serveur répond en mode démo local. Avec OpenAI :

```bash
OPENAI_API_KEY="votre_cle" OPENAI_MODEL="gpt-5" npm start
```

L'analyse de facture/devis reste vérifiable avant ajout à la shopping list ou imputation budget.

## Identité visuelle

- Palette stricte : `#947a69`, `#9ea882`, `#706b75`, `#d3d0cd`, `#f4ebe4`.
- Typographies : Blair TTC / Acumin Variable Concept si disponibles, Poppins en alternative web.
- La police Good Karma est interdite et non utilisée.
- Fond graphique `D` du logo en filigrane très subtil.
- Onglets graphiques inspirés du `E` du logo à droite.
- Boutons validation en vert mousse.
- Alertes et suppressions en rouge sombre / obsidian.

## Limites démo

- Pas de vraie base de données : les données sont réinitialisées au rechargement.
- Authentification simulée.
- Mot de passe oublié simulé.
- Lecture PDF binaire non incluse : l'analyse document lit texte collé ou fichiers texte.
- Exports PDF représentés par des vues imprimables `window.print()`.

## Tests effectués

- `npm run check`
- lancement local
- vitrine publique et Accès privé
- login sans choix de rôle
- mot de passe oublié
- admin dashboard global
- navigation globale
- page Projets et ouverture London/Foch
- retour Dashboard masquant les menus projet
- espace client London filtré
- espace collaborateur limité
- pages globales Finances / Planning / Documents / Paramètres
- IA `summarizeProject`, `analyzeDocument` et rejet action non autorisée
- vérification absence de sélecteur projet global

## Git

```bash
git status
git add .
git commit -m "Polish Esprit Design portal navigation, auth, brand and QA"
git push
```
