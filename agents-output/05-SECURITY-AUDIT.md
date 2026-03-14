<!-- Généré par l'orchestrateur IA — Agent: Sécurité — 2026-03-11T10:00:05.867Z -->



# Audit de Sécurité — Worksocial

---

## Tableau Récapitulatif des Vulnérabilités

| # | Fichier | Ligne(s) | Niveau | Type | Description courte |
|---|---------|----------|--------|------|--------------------|
| 1 | `src/app.js` | 11-13, 20, 23 | **CRITIQUE** | CORS trop permissif | `cors()` sans options = `origin: *`, appelé deux fois, annule le header custom |
| 2 | `src/controllers/UserControllers.js` | 126-127 | **CRITIQUE** | Exposition de données / Email hardcodé | Reset password envoyé à `nyukeit@outlook.com` au lieu de l'utilisateur |
| 3 | `src/controllers/UserControllers.js` | 128 | **CRITIQUE** | URL de reset hardcodée | URL `http://localhost:5173` en production = reset inutilisable + fuite d'infos |
| 4 | `src/controllers/UserControllers.js` | 168-178 | **CRITIQUE** | Auth manquante sur reset password | `resetPassword` accepte un hash déjà fait côté client = contournement total |
| 5 | `src/middleware/auth.js` | 43-50 | **CRITIQUE** | JWT en localStorage | Token renvoyé dans le body (authToken), cookie httpOnly commenté |
| 6 | `database.sql` | dump complet | **CRITIQUE** | Tokens JWT et mots de passe en clair dans le dump | 100+ tokens blacklistés + hashedPasswords + reset keys dans le fichier SQL |
| 7 | `database.sql` | user ID=1 | **CRITIQUE** | Mot de passe en clair | User ID 1 : `hashedPassword = 'asdlkjf20298034'` — pas hashé |
| 8 | `migrate.js` | 12-13 | **CRITIQUE** | Injection SQL dans la migration | `drop database if exists ${DB_NAME}` — interpolation directe sans échappement |
| 9 | `src/middleware/handleUpload.js` | 1-12 | **HAUTE** | Upload sans validation | Aucun filtre de type MIME, taille, ni extension |
| 10 | `src/app.js` | tout | **HAUTE** | Headers de sécurité manquants | Pas de Helmet, pas de CSP, pas de X-Frame-Options |
| 11 | `src/controllers/UserControllers.js` | 97-114 | **HAUTE** | Fuite de hashedPassword | `getUserByID` et `getUsers` renvoient tous les champs dont `hashedPassword` |
| 12 | `src/controllers/UserControllers.js` | 10-24 | **HAUTE** | Fuite de hashedPassword au login | `req.user = result[0]` puis `res.send({ user: req.user })` — inclut le hash |
| 13 | Aucun rate-limiter | N/A | **HAUTE** | Brute force | Aucun rate limiting sur `/login`, `/forgot-password`, `/verify-email` |
| 14 | `src/controllers/PostLikeDislikeController.js` | 12-22 | **HAUTE** | IDOR / Usurpation | `userId` pris depuis `req.body` au lieu de `req.User_ID` (token) |
| 15 | `src/controllers/EventLikeController.js` | 14-24 | **HAUTE** | IDOR / Usurpation | Même problème : `userId` depuis `req.body` |
| 16 | `src/controllers/SurveyLikesController.js` | 12-22 | **HAUTE** | IDOR / Usurpation | Même problème : `userId` depuis `req.body` |
| 17 | `src/controllers/SurveyVoteController.js` | 12-18 | **HAUTE** | IDOR + votes multiples | `userId` depuis body + aucune vérification de vote unique |
| 18 | `database.sql` | tables likes/votes | **HAUTE** | Intégrité données | Pas de UNIQUE sur `(Entity_ID, User_ID)` pour likes et votes |
| 19 | `src/controllers/UserControllers.js` | 115-131 | **HAUTE** | Exécution parallèle / double réponse | `deleteUser` appelle `next()` puis continue l'exécution → double response |
| 20 | `src/models/Manager/PostCommentLikesManager.js` | 12 | **MOYENNE** | Injection SQL potentielle | `INSERT INTO ${this.table} SET ?` — objet passé directement |
| 21 | `src/controllers/UserControllers.js` | 145-162 | **MOYENNE** | Crash si clé invalide | `verifyKey` : pas de vérification `result[0]` avant accès → crash |
| 22 | `src/app.js` | 69 | **MOYENNE** | Directory traversal | Fichiers statiques React + catch-all `*` peut exposer des fichiers |
| 23 | `utils/emailSender.js` | référencé | **MOYENNE** | Credentials email probablement hardcodées | Non fourni mais utilisé — à vérifier |
| 24 | `package.json` | dépendances | **MOYENNE** | Dépendances obsolètes | `mysql2@2.3.3`, `express@4.18.2`, `multer@1.4.5-lts.1` — CVE connues |
| 25 | `database.sql` | `company_user` | **MOYENNE** | FK cassée | Référence `companies` au lieu de `company` |
| 26 | `src/models/AbstractManager/AbstractManager.js` | 6,14 | **MOYENNE** | Requêtes mortes | `WHERE id = ?` mais aucune table n'a de colonne `id` |
| 27 | `database.sql` | `email_verification` | **FAIBLE** | `expires_at` auto-update | `ON UPDATE CURRENT_TIMESTAMP` remet à jour l'expiration à chaque modification |
| 28 | `src/controllers/UserControllers.js` | check-* routes | **FAIBLE** | Énumération d'utilisateurs | `/check-username`, `/check-email`, `/check-phone` sans auth ni rate limit |

---

## Détail de Chaque Vulnérabilité et Correctifs

---

### 1. CORS trop permissif — `src/app.js`

**Lignes** : 11-13, 20, 23

**Description** : Le code fait trois choses contradictoires :
1. Ligne 11-13 : met un header `Access-Control-Allow-Origin` spécifique
2. Ligne 20 : `app.use(cors())` **sans options** → remplace par `*`
3. Ligne 23 : `app.use(cors())` encore une fois

`cors()` sans argument autorise **toutes les origines**, ce qui permet à n'importe quel site malveillant de faire des requêtes authentifiées (si cookies utilisés).

**Correctif** :
```js
// src/app.js
const cors = require("cors");

const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://worksocialmounir.netlify.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// SUPPRIMER les lignes 11-13 (setHeader manuel)
// SUPPRIMER le second app.use(cors())
```

---

### 2. Email de reset envoyé au mauvais destinataire — `UserControllers.js`

**Ligne** : 126-127

**Description** : Le code envoie le lien de reset à `nyukeit@outlook.com` (hardcodé) au lieu de l'email de l'utilisateur qui a demandé le reset. Un attaquant peut déclencher des resets pour n'importe quel compte et recevoir le lien à l'adresse hardcodée.

**Correctif** :
```js
// src/controllers/UserControllers.js — getUserByEmail
const emailUser = await sendEmail({
  to: Email, // ← utiliser l'email de l'utilisateur, pas une adresse hardcodée
  subject: "Re-initialiser votre Mot de Passe",
  text: `Bonjour, veuillez cliquer sur ce lien pour changer votre mot de passe : ${process.env.FRONTEND_URL}/resetpassword/${uniqueKey}`,
  html: `<p>Bonjour, veuillez cliquer sur ce lien pour changer votre mot de passe :</p>
         <a href="${process.env.FRONTEND_URL}/resetpassword/${uniqueKey}">Réinitialiser</a>`,
});
```

---

### 3. URL de reset hardcodée en localhost — `UserControllers.js`

**Ligne** : 128

**Description** : `http://localhost:5173/resetpassword/${uniqueKey}` est envoyé dans l'email. En production, l'utilisateur ne peut pas accéder à localhost → fonctionnalité cassée. De plus, cela révèle l'architecture de développement.

**Correctif** :
```js
// .env
FRONTEND_URL=https://worksocialmounir.netlify.app

// Dans le controller, utiliser :
`${process.env.FRONTEND_URL}/resetpassword/${uniqueKey}`
```

---

### 4. Reset password accepte un hash pré-calculé côté client — `UserControllers.js`

**Lignes** : 168-178

**Description** : L'endpoint `resetPassword` reçoit `hashedPassword` directement du body de la requête et le stocke en BDD. Un attaquant qui connaît ou brute-force une clé de reset peut :
1. Envoyer un hash Argon2 pré-calculé de son choix
2. Prendre le contrôle de n'importe quel compte

Le mot de passe n'est **jamais hashé côté serveur** pour cette fonctionnalité.

**Correctif** :
```js
// src/controllers/UserControllers.js
const resetPassword = async (req, res) => {
  const { password, key } = req.body; // recevoir le mot de passe en clair
  if (!key || !password) {
    return res.sendStatus(400);
  }
  
  try {
    const [result] = await models.resetPasswordKey.getResetPasswordKey(key);
    if (!result || result.length === 0) {
      return res.sendStatus(404);
    }
    
    // Vérifier l'expiration
    const currentTime = new Date();
    const expirationTime = new Date(result[0].expires_at);
    if (currentTime > expirationTime) {
      return res.status(400).send({ message: "Key expired" });
    }
    
    // Hasher côté serveur
    const argon2 = require("argon2");
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    });
    
    const [r] = await models.user.resetPassword(hashedPassword, result[0].Email);
    
    // Supprimer la clé après usage
    await models.resetPasswordKey.deleteKey(key);
    
    if (r.affectedRows === 0) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
```

---

### 5. JWT stocké en localStorage (renvoyé dans le body) — `auth.js`

**Ligne** : 43-50

**Description** : Le token JWT est envoyé dans le body de la réponse (`authToken`), ce qui implique que le frontend le stocke en `localStorage`. Cela le rend vulnérable aux attaques XSS : tout script malveillant peut lire `localStorage` et voler le token. Le code montre même un cookie httpOnly **commenté** (lignes 39-42).

**Correctif** :
```js
// src/middleware/auth.js — verifyPassword
if (isVerified) {
  const payload = { sub: req.user.User_ID };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "4h",
  });
  
  // Cookie httpOnly — inaccessible au JavaScript
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS uniquement en prod
    sameSite: "strict",
    maxAge: 4 * 60 * 60 * 1000, // 4h
  });
  
  // Ne PAS renvoyer le token dans le body
  const { hashedPassword, ...safeUser } = req.user;
  res.status(200).send({
    user: safeUser,
    message: "Login successful",
  });
}

// verifyToken doit lire le cookie au lieu du header Authorization :
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).send("Authentication required");
    }
    // ... reste identique
  }
};
```

Ajouter `cookie-parser` :
```bash
npm install cookie-parser
```
```js
// src/app.js
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

---

### 6. Tokens JWT et données sensibles dans le dump SQL — `database.sql`

**Description** : Le fichier `database.sql` contient :
- ~100 tokens JWT blacklistés (permettant potentiellement de retrouver le secret JWT par analyse)
- Des hashs Argon2 de mots de passe
- Des clés de reset password actives
- Des données utilisateur complètes

Si ce fichier est commité dans un repo public, toutes ces données sont compromises.

**Correctif** :
```bash
# Ajouter dans .gitignore
database.sql
*.sql

# Regénérer le fichier SQL avec uniquement la structure (pas les données)
mysqldump --no-data -u root -p worksocial > database_schema.sql

# Changer IMMÉDIATEMENT le JWT_SECRET en production
# Forcer le changement de mot de passe de tous les utilisateurs
# Invalider toutes les reset keys
```

---

### 7. Mot de passe en clair — `database.sql` (user ID 1)

**Description** : L'utilisateur ID=1 (`nyukeit`) a `hashedPassword = 'asdlkjf20298034'` — ce n'est ni un hash Argon2, ni un hash bcrypt. C'est un mot de passe en quasi-clair.

**Correctif** :
```js
// Script one-shot pour re-hasher le mot de passe de l'utilisateur ID=1
const argon2 = require("argon2");
const hash = await argon2.hash("nouveau_mot_de_passe_fort", {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
});
// UPDATE user SET hashedPassword = ? WHERE User_ID = 1
```

---

### 8. Injection SQL dans la migration — `migrate.js`

**Lignes** : 12-13

**Description** : 
```js
await connection.query(`drop database if exists ${DB_NAME}`);
await connection.query(`create database ${DB_NAME}`);
```
`DB_NAME` est interpolé directement dans la requête SQL. Si la variable d'environnement est compromise ou contient des caractères spéciaux, une injection est possible.

**Correctif** :
```js
// migrate.js
const mysql = require("mysql2/promise");

const migrate = async () => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  
  // Valider le nom de la base
  if (!/^[a-zA-Z0-9_]+$/.test(DB_NAME)) {
    throw new Error("Invalid database name");
  }
  
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });
  
  // Utiliser des backticks pour l'identifiant (pas paramétrable via ?)
  const escapedName = mysql.escapeId(DB_NAME);
  await connection.query(`DROP DATABASE IF EXISTS ${escapedName}`);
  await connection.query(`CREATE DATABASE ${escapedName}`);
  await connection.query(`USE ${escapedName}`);
  
  const sql = fs.readFileSync("./database.sql", "utf8");
  await connection.query(sql);
  connection.end();
};
```

---

### 9. Upload sans validation — `handleUpload.js`

**Description** : Multer est configuré sans aucune restriction :
- Pas de filtre de type MIME → un attaquant peut uploader des `.php`, `.html`, `.svg` (XSS), `.exe`
- Pas de limite de taille → déni de service
- Le nom de fichier original est conservé (risque de path traversal)

**Correctif** :
```js
// src/middleware/handleUpload.js
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/upload");
  },
  filename: (req, file, cb) => {
    // Nom aléatoire + extension sûre
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non autorisé"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
  },
});

module.exports = upload;
```

---

### 10. Headers de sécurité manquants — `app.js`

**Description** : Aucun header de sécurité n'est défini :
- Pas de `Content-Security-Policy`
- Pas de `X-Frame-Options` (clickjacking)
- Pas de `X-Content-Type-Options`
- Pas de `Strict-Transport-Security`
- Pas de `Referrer-Policy`

**Correctif** :
```bash
npm install helmet
```
```js
// src/app.js — ajouter en premier middleware
const helmet = require("helmet");
app.use(helmet());

// Configuration fine si nécessaire :
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }, // pour servir les images
}));
```

---

### 11. Fuite du hashedPassword dans les réponses API — `UserControllers.js`

**Lignes** : `getUsers` (ligne ~30), `getUserByID` (ligne ~40)

**Description** : `res.send(rows)` envoie **tous les champs** de la table `user`, y compris `hashedPassword`. Tout utilisateur authentifié peut voir les hash de mots de passe de tous les autres utilisateurs.

**Correctif** :
```js
// Option 1 : dans le Manager (meilleur)
// src/models/Manager/UserManager.js
findAll() {
  return this.database.query(
    `SELECT User_ID, Username, LastName, FirstName, BirthDate, Age, Address, 
     Email, Phone, Biography, Role, Gender, ProfileImage, Created_At, Updated_At, 
     Company_ID, emailVerified FROM ${this.table}`
  );
}

findByPK(id) {
  return this.database.query(
    `SELECT User_ID, Username, LastName, FirstName, BirthDate, Age, Address, 
     Email, Phone, Biography, Role, Gender, ProfileImage, Created_At, Updated_At, 
     Company_ID, emailVerified FROM ${this.table} WHERE User_ID = ?`,
    [id]
  );
}

// Option 2 : dans le controller
const getUsers = (req, res) => {
  models.user.findAll().then(([rows]) => {
    const safeRows = rows.map(({ hashedPassword, ...user }) => user);
    res.send(safeRows);
  }).catch(/* ... */);
};
```

---

### 12. Fuite du hashedPassword au login — `UserControllers.js` + `auth.js`

**Lignes** : `UserControllers.js` login (ligne ~16), `auth.js` verifyPassword (ligne ~47)

**Description** : Au login, `req.user = result[0]` contient le hash, puis `res.send({ user: req.user })` le renvoie au client.

**Correctif** :
```js
// src/middleware/auth.js — verifyPassword
const { hashedPassword, ...safeUser } = req.user;
res.status(200).send({
  user: safeUser,
  message: "Login successful",
});
```

---

### 13. Absence de rate limiting — Ensemble du projet

**Description** : Aucun rate limiting n'est implémenté. Les endpoints suivants sont critiquement exposés :
- `/login` → brute force de mots de passe
- `/forgot-password` → spam d'emails, énumération
- `/verify-email` → brute force du code de vérification (6 chiffres = 1M combinaisons)
- `/verify-key` → brute force de clés de reset

**Correctif** :
```bash
npm install express-rate-limit
```
```js
// src/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: { message: "Trop de tentatives de connexion. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3,
  message: { message: "Trop de demandes de réinitialisation." },
});

const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Trop de tentatives de vérification." },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = { loginLimiter, forgotPasswordLimiter, verifyEmailLimiter, generalLimiter };

// Dans les routes :
router.post("/login", loginLimiter, login, verifyPassword);
router.post("/users/forgot-password", forgotPasswordLimiter, getUserByEmail);
router.post("/users/verify-email", verifyEmailLimiter, verifyEmailCode);
```

---

### 14-16. IDOR sur les likes (posts, events, surveys) — Multiples controllers

**Fichiers** : `PostLikeDislikeController.js`, `EventLikeController.js`, `SurveyLikesController.js`

**Description** : Le `userId` est pris depuis `req.body` (contrôlé par le client) au lieu de `req.User_ID` (extrait du token JWT). Un attaquant peut liker/unliker au nom de n'importe quel utilisateur.

**Correctif** (exemple pour PostLikeDislikeController, identique pour les autres) :
```js
// src/controllers/PostLikeDislikeController.js
const likePost = (req, res) => {
  const { postId } = req.params;
  const userId = req.User_ID; // ← depuis le token JWT, pas req.body

  models.postLike
    .like(postId, userId)
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const unlikePost = (req, res) => {
  const { postId } = req.params;
  const userId = req.User_ID; // ← depuis le token JWT

  models.postLike
    .unlike(postId, userId)
    .then(() => res.sendStatus(200))
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};
```

Appliquer le même correctif pour `EventLikeController.js` et `SurveyLikesController.js`.

---

### 17. IDOR + votes multiples sur les sondages — `SurveyVoteController.js`

**Lignes** : 12-18

**Description** : Double problème :
1. `userId` vient de `req.body` (IDOR)
2. Aucune vérification que l'utilisateur n'a pas déjà voté → votes multiples (confirmé par les données : user ID=5 a voté 6 fois)

**Correctif** :
```js
// src/controllers/SurveyVoteController.js
const castVote = async (req, res) => {
  const surveyId = parseInt(req.params.surveyId, 10);
  const userId = req.User_ID; // depuis le token
  const { votedOption } = req.body;

  // Valider l'option
  const validOptions = ["Option1", "Option2", "Option3", "Option4"];
  if (!validOptions.includes(votedOption)) {
    return res.status(400).send({ message: "Invalid vote option" });
  }

  try {
    // Vérifier si l'utilisateur a déjà voté
    const [existing] = await models.surveyVote.getVoteByUserAndSurvey(surveyId, userId);
    if (existing.length > 0) {
      return res.status(409).send({ message: "You have already voted on this survey" });
    }
    
    await models.surveyVote.castVote(surveyId, userId, votedOption);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// Ajouter dans SurveyVoteManager.js :
getVoteByUserAndSurvey(surveyId, userId) {
  return this.database.query(
    `SELECT * FROM ${this.table} WHERE Survey_ID = ? AND User_ID = ?`,
    [surveyId, userId]
  );
}
```

Et ajouter la contrainte UNIQUE en BDD :
```sql
ALTER TABLE survey_votes ADD UNIQUE INDEX unique_vote (Survey_ID, User_ID);
ALTER TABLE post_likes ADD UNIQUE INDEX unique_like (Post_ID, User_ID);
ALTER TABLE event_likes ADD UNIQUE INDEX unique_like (Event_ID, User_ID);
ALTER TABLE survey_likes ADD UNIQUE INDEX unique_like (Survey_ID, User_ID);
```

---

### 18. Contraintes UNIQUE manquantes en BDD

Couvert par le correctif #17 ci-dessus (ALTER TABLE).

---

### 19. Double réponse dans deleteUser — `UserControllers.js`

**Lignes** : 115-131

**Description** : `deleteUser` appelle `next()` (ce qui enverrait une réponse via le middleware suivant) puis continue à exécuter `models.user.delete()` qui envoie aussi une réponse → crash `ERR_HTTP_HEADERS_SENT`.

**Correctif** :
```js
const deleteUser = async (req, res) => {
  try {
    const emailInput = req.body.Email;
    const [user] = await models.user.findByPK(req.params.id);
    
    if (!user || user.length === 0) {
      return res.sendStatus(404);
    }
    
    const userEmail = user[0].Email;
    
    // Vérifier que l'utilisateur authentifié est bien le propriétaire
    if (req.User_ID !== parseInt(req.params.id, 10)) {
      return res.sendStatus(403);
    }
    
    if (emailInput !== userEmail) {
      return res.status(403).send({ message: "Email confirmation does not match" });
    }
    
    const [result] = await models.user.delete(req.params.id); // Supprimer par ID, pas par email
    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
```

---

### 20. Injection SQL via `SET ?` — `PostCommentLikesManager.js`

**Ligne** : 12

**Description** : `INSERT INTO ${this.table} SET ?` avec un objet passé directement. Bien que mysql2 paramétrise les valeurs de l'objet, les **clés** de l'objet deviennent des noms de colonnes sans échappement, ce qui peut être exploité si l'objet vient directement du body de la requête.

**Correctif** :
```js
// Utiliser des requêtes explicites avec des colonnes définies
createPostCommentLikes(like) {
  return this.database.query(
    `INSERT INTO ${this.table} (Comment_ID, User_ID) VALUES (?, ?)`,
    [like.Comment_ID, like.User_ID]
  );
}
```

Appliquer le même correctif pour tous les `SET ?` et `UPDATE SET ?` dans :
- `EventCommentsLikesManager.js`
- `SurveycCommentLikesManager.js`

---

### 21. Crash si clé de reset invalide — `UserControllers.js`

**Lignes** : 145-162

**Description** : `verifyKey` accède à `result[0].unique_key` sans vérifier si `result` contient des résultats. Si la clé n'existe pas, `result[0]` est `undefined` → crash serveur.

**Correctif** :
```js
const verifyKey = async (req, res)