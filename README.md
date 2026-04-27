# Esprit Design Architecture - Portail V2

Plateforme privée de démonstration pour piloter les projets d'architecture d'intérieur Esprit Design Architecture, depuis le brief client jusqu'à la livraison.

La V2 contient une vitrine fidèle à l'univers public Esprit Design, un cockpit agence complet, un espace collaborateur limité et un portail client filtré par projet. Le projet témoin client principal est **Projet London**.

## Objectifs V2

- Centraliser briefs, phases, moodboards, plans, rendus, achats, budgets, devis, documents, chantier et comptes rendus.
- Piloter tous les projets depuis un cockpit agence avec KPIs, alertes, Gantt global et projet actif.
- Offrir un portail client premium, simple et rassurant, avec uniquement les éléments publiés.
- Tracer les validations client : qui, quoi, quand, version et commentaire.
- Préparer une base technique extensible vers une vraie authentification, une base de données et du stockage fichiers.
- Limiter volontairement l'IA à deux usages utiles : synthèse projet et analyse documentaire.

## Lancement local

```bash
node server.js
```

Ouvrir ensuite :

```text
http://127.0.0.1:4174/
```

Le port par défaut est `4174`. Il peut être modifié avec `PORT=4175 node server.js`.

## Identifiants démo

| Rôle | Identifiant | Mot de passe | Redirection |
| --- | --- | --- | --- |
| Admin agence | `admin@esprit-design.fr` | `demo` | Cockpit complet |
| Collaborateur | `collaborateur@esprit-design.fr` | `demo` | Cockpit limité aux projets assignés |
| Client London | `PROJET-LONDON` | `demo` | Portail client London |
| Client Lévis | `PROJET-LEVIS` | `demo` | Portail client Lévis |

L'authentification est simulée côté navigateur pour la démonstration. Elle ne remplace pas une vraie sécurité serveur.

## Modules Agence

- Cockpit agence avec KPIs, alertes, rentabilité, temps semaine et Gantt multi-projets.
- Tous les projets : carte et tableau, recherche, filtres visuels, ouverture et sélection du projet actif.
- Clients : coordonnées, préférences, notes internes et historique projets.
- Prospects simples : demandes entrantes, statut, budget estimé, prochaine action.
- Projet actif : vue d'ensemble, brief, contrat, phases, moodboards, plans/rendus, shopping list, budget, devis, planning, décisions, tâches internes, suivi chantier, comptes rendus, documents, messages, temps passé, exports et paramètres.
- Administration : utilisateurs, rôles, permissions, accès client, seuils de rentabilité, statuts et charte.
- Modèles : brief, phases, compte rendu, shopping list, tâches, message client statique et export.

## Modules Client

Le client voit uniquement son projet et uniquement les éléments publiés :

- Accueil projet.
- Messages projet non internes.
- Décisions à valider.
- Brief validé.
- Moodboards publiés.
- Plans et vues 3D publiés.
- Shopping list publiée avec actions de validation.
- Budget partagé.
- Devis publiés.
- Planning simplifié.
- Suivi chantier publié.
- Comptes rendus publiés.
- Documents publiés.
- Contrat et honoraires uniquement si explicitement publiés.
- Factures et paiements visibles uniquement via documents publiés.

Le client ne voit jamais : rentabilité, marges, temps passé, notes internes, tâches internes, documents internes ou données financières stratégiques.

## Projet actif

La sélection du projet actif pilote réellement les modules suivants :

- budget ;
- achats ;
- documents ;
- chantier ;
- comptes rendus ;
- messages ;
- décisions ;
- phases ;
- moodboards ;
- devis ;
- planning ;
- temps passé et rentabilité ;
- synthèse IA ;
- analyse documentaire.

Les données de démonstration incluent Projet London, Projet Lévis, Projet Foch, Projet Bali et Projet Cabriès.

## IA V2

Le serveur expose uniquement :

```text
POST /api/ai
```

Actions autorisées :

```json
{
  "action": "summarizeProject",
  "projectId": "london",
  "role": "admin",
  "audience": "agency",
  "context": {}
}
```

```json
{
  "action": "analyzeDocument",
  "projectId": "london",
  "role": "admin",
  "documentType": "invoice",
  "documentText": "Facture...",
  "context": {}
}
```

Règles :

- réponse en français ;
- utilisation exclusive du contexte fourni ;
- aucune invention volontaire ;
- données internes supprimées pour les résumés client ;
- analyse facture/devis vérifiable avant intégration ;
- aucun assistant général, aucune génération automatique de messages client.

Sans `OPENAI_API_KEY`, le serveur répond en mode démo local explicite. Pour activer OpenAI :

```bash
OPENAI_API_KEY="votre_cle" OPENAI_MODEL="gpt-5" node server.js
```

## Analyse documentaire

Dans le module Documents :

- choix du type facture/devis/autre ;
- upload texte de démonstration ou collage manuel ;
- extraction fournisseur, date, total, TVA et lignes ;
- table de vérification ;
- bouton pour ajouter les lignes à la shopping list ;
- imputation au budget du projet actif ;
- création d'un document facture en mode démo.

Aucune extraction n'est intégrée automatiquement sans validation utilisateur.

## Exports

Les exports sont implémentés en vues imprimables avec `window.print()` et CSS print :

- dossier projet complet ;
- brief validé ;
- APS ;
- APD ;
- moodboard ;
- shopping list ;
- budget ;
- compte rendu ;
- synthèse devis ;
- fin de projet.

## Structure fichiers

```text
index.html   Vitrine, connexion et shell applicatif
styles.css   Charte premium responsive et print
app.js       Données démo, rôles, navigation, modules et interactions
server.js    Serveur local Node + API IA contrôlée
package.json Scripts npm start / npm run check
README.md    Documentation V2
```

## Choix techniques

La V2 reste volontairement en HTML/CSS/JS + Node sans dépendances. Ce choix permet une démonstration locale très simple, tout en structurant les données et les modules pour une future migration vers React/Vite, une base de données et une vraie authentification.

## Hypothèses documentées

- Le cahier des charges V2 est traduit en écrans et règles de démonstration, sans persistance serveur.
- Les boutons de création/modification lourde produisent des feedbacks démo quand l'action complète n'est pas nécessaire à la preuve fonctionnelle.
- Les images publiques disponibles et des visuels libres sont utilisés pour enrichir la démonstration.
- L'accès foyer simplifié est implémenté ; l'accès nominatif avancé est préparé dans la structure utilisateurs.
- Les exports PDF réels sont représentés par des vues imprimables premium.

## Tests manuels effectués / à rejouer

1. Lancement local.
2. Chargement vitrine.
3. Navigation vitrine.
4. Bouton Accès privé.
5. Connexion admin.
6. Connexion collaborateur.
7. Connexion client London.
8. Changement projet actif.
9. Budget, achats, documents et chantier filtrés par projet actif.
10. Publication / masquage document côté client.
11. Validation client avec prénom/commentaire.
12. Shopping list avec statuts.
13. Ajout/imputation depuis analyse facture.
14. Résumé IA projet.
15. Export imprimable.
16. Responsive mobile/tablette.

## Limites connues

- Les données sont en mémoire navigateur : un rechargement remet la démo à zéro.
- La lecture PDF binaire réelle n'est pas incluse ; le mode démo lit le texte collé ou les fichiers texte.
- L'authentification est simulée, non sécurisée pour production.
- Les créations avancées sont en mode démo et devront être reliées à une base de données.

## Prochaines étapes recommandées

- Migrer vers une application Vite + React ou Next.js si la plateforme devient un vrai produit.
- Ajouter une base PostgreSQL/Supabase.
- Ajouter stockage fichiers privé.
- Ajouter authentification robuste avec rôles et permissions serveur.
- Générer des PDF réels côté serveur.
- Brancher OCR/PDF extraction pour factures et devis.

## Commandes Git

```bash
git status
git add .
git commit -m "Build complete V2 Esprit Design portal"
git push
```
