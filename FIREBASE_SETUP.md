# Configuration Firebase pour CMMI Platform

## Pourquoi Firebase ?

Sur Vercel (ou tout autre hébergement), `localStorage` est isolé à chaque navigateur. Pour que l'admin voie la progression de tous les utilisateurs en temps réel, nous utilisons **Firebase Firestore** comme base de données partagée.

## Étapes de Configuration

### 1. Créer un projet Firebase

1. Allez sur https://console.firebase.google.com/
2. Cliquez sur "Add project" (Ajouter un projet)
3. Entrez un nom pour votre projet (ex: "cmmi-platform")
4. Suivez les étapes de création

### 2. Activer Firestore

1. Dans votre projet Firebase, allez dans "Firestore Database"
2. Cliquez sur "Create database"
3. **Étape 2/3 - Database ID & location** :
   - Database ID : Gardez "(default)"
   - Location : Sélectionnez une région proche de vos utilisateurs (ex: `europe-west1` pour l'Europe)
   - ⚠️ **Note importante** : Cette région ne pourra pas être changée plus tard
   - Cliquez sur "Next"
4. **Étape 3/3 - Configure** : 
   - **Option recommandée pour commencer** : Choisissez **"Start in test mode"**
     - Cela permet un accès ouvert pendant 30 jours, parfait pour tester rapidement
     - Les règles par défaut permettront les lectures/écritures
   - **OU** : Si vous choisissez "Start in production mode" :
     - Vous devrez modifier les règles manuellement (voir étape 3 ci-dessous)
   - Cliquez sur "Enable"

### 3. Configurer les règles de sécurité Firestore (si nécessaire)

Si vous avez choisi "Start in production mode" à l'étape 2, vous DEVEZ modifier les règles :

1. Dans Firestore Database, allez dans l'onglet "Rules"
2. Remplacez les règles par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture et écriture pour tous (à restreindre en production)
    match /scores/{document=**} {
      allow read, write: if true;
    }
    
    // Permettre la lecture et écriture pour la collection users
    match /users/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Cliquez sur "Publish" pour sauvegarder les règles

**⚠️ IMPORTANT**: Ces règles permettent l'accès public. Pour la production finale, vous devriez ajouter une authentification (voir section "Sécurité en Production").

### 4. Obtenir les clés de configuration

1. Dans Firebase Console, allez dans "Project Settings" (⚙️ en haut à gauche)
2. Faites défiler jusqu'à "Your apps"
3. Cliquez sur l'icône Web (</>) pour ajouter une app web
4. Entrez un nom (ex: "CMMI Web App")
5. Copiez les valeurs de configuration qui apparaissent

### 5. Configurer les variables d'environnement

1. Copiez `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Ouvrez `.env` et remplacez les valeurs :
   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSy... (votre clé API)
   REACT_APP_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=votre-projet-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### 6. Configuration sur Vercel

1. Allez dans votre projet Vercel
2. Allez dans "Settings" > "Environment Variables"
3. Ajoutez chaque variable d'environnement (REACT_APP_FIREBASE_*)
4. Redéployez votre application

### 7. Tester

1. Démarrez l'application : `npm start`
2. Jouez un jeu et terminez-le
3. Ouvrez le Panneau Admin (mot de passe: `admin123`)
4. Vous devriez voir les scores apparaître en temps réel

## Fallback localStorage

Si Firebase n'est pas configuré, l'application utilisera automatiquement `localStorage` comme avant. Cela permet de continuer à développer localement sans Firebase.

## Sécurité en Production

Pour sécuriser votre base de données en production :

1. Activez Firebase Authentication
2. Modifiez les règles Firestore pour exiger l'authentification :
   ```javascript
   match /scores/{document=**} {
     allow read: if request.auth != null;
     allow write: if request.auth != null;
   }
   ```
3. Ou utilisez des règles plus restrictives basées sur les rôles utilisateurs

## Support

Si vous rencontrez des problèmes :
- Vérifiez que les variables d'environnement sont bien définies
- Vérifiez la console du navigateur pour les erreurs Firebase
- Assurez-vous que Firestore est activé dans votre projet Firebase

