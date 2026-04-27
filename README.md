# Esprit Design Portal Demo

Prototype local du portail projet Esprit Design Architecture.

## Lancer le site

```bash
node server.js
```

Puis ouvrir :

```text
http://127.0.0.1:4174/
```

## IA

Le serveur expose un endpoint local `/api/ai`.

Sans clé API, l'assistant passe en mode démo explicite. Pour activer une vraie IA :

```bash
OPENAI_API_KEY="votre_cle" node server.js
```

## Contenu

- Vitrine inspirée du site Esprit Design Architecture.
- Portail client.
- Back-office agence.
- Gantt multi-projets.
- Projet actif qui pilote budget, achats, documents et chantier.
- Analyse de facture en mode démo.
