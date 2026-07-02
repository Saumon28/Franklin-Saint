# Presence Bot

Bot Discord qui gère les appels de présence (Présent / En retard / Absent) et
qui peut envoyer un DM à tous ceux qui n'ont pas encore voté.

## Installation

1. **Créer le bot** sur le [Discord Developer Portal](https://discord.com/developers/applications) :
   - New Application → onglet Bot → Reset Token, copie-le.
   - Dans **Privileged Gateway Intents**, active **Server Members Intent**
     (nécessaire pour que `/relance` puisse récupérer et DM tous les membres).
   - OAuth2 → URL Generator : scopes `bot` + `applications.commands`,
     permissions : Send Messages, Embed Links, Manage Guild (optionnel, pour
     restreindre `/relance`). Utilise l'URL générée pour inviter le bot sur
     ton serveur.

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   ```
   Renseigne `DISCORD_TOKEN`, `CLIENT_ID` (Application ID, onglet General
   Information) et `GUILD_ID` (clic droit sur l'icône du serveur → Copier
   l'ID du serveur, nécessite le mode développeur activé).

   **Ne commit jamais ton vrai fichier `.env`.**

4. **Enregistrer les commandes slash**
   ```bash
   npm run deploy
   ```

5. **Démarrer le bot**
   ```bash
   npm start
   ```

## Utilisation

- `/presence heure:21H30` — poste l'embed de présence avec les boutons.
  N'importe qui sur le serveur peut cliquer sur Présent / En retard /
  Absent, et l'embed se met à jour en direct.
- `/relance message_id:<id>` — envoie un DM à tous les membres du serveur
  qui n'ont cliqué sur aucun bouton, pour leur demander d'aller voter.
  Récupère l'ID du message via le mode développeur → clic droit sur le
  message de l'appel → Copier l'ID du message. Restreint par défaut aux
  membres ayant la permission Gérer le serveur.

## Remarques / pièges à éviter

- Les votes sont stockés **en mémoire** (`pollStore.js`). Si le bot
  redémarre, les anciens appels sont perdus et les boutons afficheront
  "sondage plus actif". Si tu as besoin que les votes survivent aux
  redémarrages, remplace le `Map` de `pollStore.js` par SQLite ou un
  fichier JSON — je peux ajouter ça si tu veux.
- Les DM envoyés par `/relance` échoueront silencieusement pour les
  utilisateurs qui ont désactivé "Autoriser les messages privés des
  membres du serveur" — c'est une limitation côté Discord, pas un bug.
- Le déploiement des commandes au niveau du serveur (ce que fait
  `deploy-commands.js`) est instantané. Si tu veux le bot sur plusieurs
  serveurs, passe aux commandes globales, mais compte jusqu'à une heure
  avant qu'elles apparaissent.
