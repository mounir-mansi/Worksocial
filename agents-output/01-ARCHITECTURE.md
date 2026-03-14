<!-- Généré par l'orchestrateur IA — Agent: Architecte — 2026-03-11T09:53:40.063Z -->



# Document de Référence — Worksocial

---

## 1. Résumé du projet

### Objectif
**Worksocial** est un réseau social d'entreprise permettant aux utilisateurs de créer des publications, des sondages, des événements, de commenter, liker, voter, et communiquer via un système de chat individuel et de groupe.

### Fonctionnalités principales
- **Authentification** : inscription, login, logout, réinitialisation de mot de passe par email, vérification d'email par code
- **Gestion des utilisateurs** : CRUD utilisateurs, profils avec image, vérification unicité username/email/phone
- **Publications (Posts)** : CRUD avec upload d'image, likes, commentaires, likes sur commentaires
- **Événements (Events)** : CRUD avec image, likes, commentaires, likes sur commentaires d'événement
- **Sondages (Surveys)** : CRUD avec 2-4 options, votes, likes, commentaires, likes sur commentaires
- **Chat** : messages individuels (avec WebSocket), groupes de chat avec participants
- **Entreprises (Companies)** : CRUD entreprises, association utilisateur-entreprise avec rôle
- **Système de followers** : table existante mais peu implémentée
- **Token blacklist** : invalidation de JWT au logout

### Stack technique
| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js + Express.js |
| Base de données | MySQL 8.0 (mysql2/promise) |
| Authentification | JWT (jsonwebtoken) + Argon2 |
| Upload fichiers | Multer |
| Temps réel | WebSocket (ws + socket.io) |
| Email | Nodemailer |
| ORM/Query | Requêtes SQL brutes via pool MySQL |
| Linting | ESLint (airbnb-base) + Prettier |
| Tests | Jest (configuré mais aucun test détecté) |
| Architecture | MVC (Model-View-Controller) |
| Frontend | React (mentionné, servi en statique, code non fourni) |
| Déploiement frontend | Netlify (worksocialmounir.netlify.app) |

---

## 2. Schéma de base de données

### Tables et colonnes

#### `user`
| Colonne | Type | Contraintes | Notes |
|---------|------|-------------|-------|
| User_ID | int | PK, AUTO_INCREMENT | |
| Username | varchar(255) | NOT NULL, UNIQUE | |
| LastName | varchar(255) | NOT NULL | |
| FirstName | varchar(255) | NOT NULL | |
| BirthDate | date | NULL | |
| Age | int | NULL | Redondant avec BirthDate |
| Address | text | NULL | |
| Email | varchar(255) | NOT NULL, UNIQUE | |
| Phone | varchar(255) | NULL | |
| Biography | text | NULL | |
| hashedPassword | varchar(255) | NOT NULL | |
| Role | enum('Admin','User') | NOT NULL | |
| Gender | enum('Male','Female','Other') | NOT NULL | |
| ProfileImage | text | NULL | |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP | |
| Updated_At | timestamp | ON UPDATE CURRENT_TIMESTAMP | |
| Company_ID | int | FK → company(Company_ID), NULL | ON DELETE SET NULL |
| emailVerified | tinyint(1) | NOT NULL, DEFAULT 0 | |

#### `company`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Company_ID | int | PK, AUTO_INCREMENT |
| Name | varchar(255) | NOT NULL |
| URL | varchar(255) | NULL |
| Logo | text | NULL |
| Phone | varchar(255) | NULL |
| Email | varchar(255) | NULL |
| Activity | text | NULL |
| Address | text | NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |
| Updated_At | timestamp | ON UPDATE CURRENT_TIMESTAMP |

#### `company_user`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Company_ID | int | PK (composite), FK → `companies`(Company_ID) ⚠️ |
| User_ID | int | PK (composite), FK → user(User_ID) |
| Role | varchar(255) | NULL |

> ⚠️ **BUG** : La FK référence `companies` mais la table s'appelle `company`

#### `post`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Post_ID | int | PK, AUTO_INCREMENT |
| Image | text | NULL |
| Title | varchar(255) | NOT NULL |
| Content | text | NOT NULL |
| Visibility | enum('Public','Private') | NOT NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |
| Updated_At | timestamp | ON UPDATE CURRENT_TIMESTAMP |
| User_ID | int | FK → user(User_ID), NULL |

#### `post_comments`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Comment_ID | int | PK, AUTO_INCREMENT |
| Post_ID | int | FK → post(Post_ID) |
| User_ID | int | FK → user(User_ID) |
| Comment | text | NOT NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `post_likes`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Post_ID | int | FK → post(Post_ID) |
| User_ID | int | FK → user(User_ID) |
| Liked_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

> ⚠️ **Pas de PK**, pas de contrainte UNIQUE sur (Post_ID, User_ID)

#### `post_comment_likes`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Like_ID | int | PK, AUTO_INCREMENT |
| Comment_ID | int | FK → post_comments(Comment_ID) |
| User_ID | int | FK → user(User_ID) |
| Liked_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `event`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Event_ID | int | PK, AUTO_INCREMENT |
| Image | text | NULL |
| EventName | varchar(255) | NOT NULL |
| StartDate | date | NOT NULL |
| EndDate | date | NULL |
| StartTime | time | NULL |
| EndTime | time | NULL |
| Description | text | NULL |
| Visibility | enum('Public','Private') | NOT NULL |
| ParticipantCount | int | DEFAULT 0 |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |
| Updated_At | timestamp | ON UPDATE CURRENT_TIMESTAMP |
| User_ID | int | FK → user(User_ID), NULL |

#### `event_comments`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Comment_ID | int | PK, AUTO_INCREMENT |
| Event_ID | int | FK → event(Event_ID) |
| User_ID | int | FK → user(User_ID) |
| Comment | text | NOT NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `event_likes`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Event_ID | int | FK → event(Event_ID) |
| User_ID | int | FK → user(User_ID) |
| Liked_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

> ⚠️ **Pas de PK**, pas de contrainte UNIQUE sur (Event_ID, User_ID)

#### `event_comment_likes`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Like_ID | int | PK, AUTO_INCREMENT |
| Comment_ID | int | FK → event_comments(Comment_ID) |
| User_ID | int | FK → user(User_ID) |
| Liked_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `survey`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Survey_ID | int | PK, AUTO_INCREMENT |
| Image | text | NULL |
| Title | varchar(255) | NOT NULL |
| Content | text | NOT NULL |
| Visibility | enum('Public','Private') | NOT NULL |
| EndDate | date | NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |
| Updated_At | timestamp | ON UPDATE CURRENT_TIMESTAMP |
| User_ID | int | FK → user(User_ID), NULL |
| Option1 | varchar(255) | NOT NULL |
| Option2 | varchar(255) | NOT NULL |
| Option3 | varchar(255) | NULL |
| Option4 | varchar(255) | NULL |

#### `survey_comments`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Comment_ID | int | PK, AUTO_INCREMENT |
| Survey_ID | int | FK → survey(Survey_ID) |
| User_ID | int | FK → user(User_ID) |
| Comment | text | NOT NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `survey_likes`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Survey_ID | int | FK → survey(Survey_ID) |
| User_ID | int | FK → user(User_ID) |
| Liked_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

> ⚠️ **Pas de PK**, pas de contrainte UNIQUE

#### `survey_comment_likes`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Like_ID | int | PK, AUTO_INCREMENT |
| Comment_ID | int | FK → survey_comments(Comment_ID) |
| User_ID | int | FK → user(User_ID) |
| Liked_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `survey_votes`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Survey_ID | int | FK → survey(Survey_ID) |
| User_ID | int | FK → user(User_ID) |
| Voted_For | varchar(10) | NOT NULL |
| create_time | datetime | DEFAULT CURRENT_TIMESTAMP |

> ⚠️ **Pas de PK**, pas de contrainte UNIQUE — un utilisateur peut voter plusieurs fois !

#### `individualchat`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Chat_ID | int | PK, AUTO_INCREMENT |
| Content | text | NOT NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |
| Updated_At | timestamp | ON UPDATE CURRENT_TIMESTAMP |
| User_ID1 | int | FK → user(User_ID), NULL |
| User_ID2 | int | FK → user(User_ID), NULL |

#### `groupchat`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| GroupChat_ID | int | PK, AUTO_INCREMENT |
| GroupImage | text | NULL |
| GroupName | varchar(255) | NOT NULL |
| Content | text | NOT NULL |
| Created_At | timestamp | DEFAULT CURRENT_TIMESTAMP |
| Updated_At | timestamp | ON UPDATE CURRENT_TIMESTAMP |
| User_ID | int | FK → user(User_ID), NULL |

#### `groupparticipants`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| GroupChat_ID | int | PK (composite), FK → groupchat(GroupChat_ID) |
| User_ID | int | PK (composite), FK → user(User_ID) |
| Joined_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `blacklisted_tokens`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| jwtToken | varchar(255) | NOT NULL |
| createdAt | timestamp | DEFAULT CURRENT_TIMESTAMP |

> ⚠️ **Pas de PK**

#### `email_verification`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| verification_id | int | NOT NULL (pas AUTO_INCREMENT, pas PK) |
| User_ID | int | NOT NULL |
| verification_code | varchar(255) | NOT NULL |
| expires_at | timestamp | ON UPDATE CURRENT_TIMESTAMP |

> ⚠️ **Pas de PK**, pas de FK, expires_at se met à jour à chaque UPDATE

#### `reset_password_keys`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| unique_key | varchar(80) | PK |
| Email | varchar(255) | FK → user(Email) |
| created_at | timestamp | DEFAULT CURRENT_TIMESTAMP |
| expires_at | timestamp | DEFAULT now()+15min |

#### `inviteFriends`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| invite_id | int | PK, AUTO_INCREMENT |
| inviter_id | int | FK → user(User_ID) ON DELETE CASCADE |
| invitee_id | int | FK → user(User_ID) ON DELETE CASCADE |
| sent_at | timestamp | DEFAULT CURRENT_TIMESTAMP |

#### `user_followers`
| Colonne | Type | Contraintes |
|---------|------|-------------|
| Follower_ID | int | PK (composite), FK → user(User_ID) |
| Following_ID | int | PK (composite), FK → user(User_ID) |
| Followed_At | timestamp | DEFAULT CURRENT_TIMESTAMP |

### Diagramme des relations

```
user ──< post ──< post_comments ──< post_comment_likes
  │         └──< post_likes
  │
  ├──< event ──< event_comments ──< event_comment_likes
  │       └──< event_likes
  │
  ├──< survey ──< survey_comments ──< survey_comment_likes
  │       ├──< survey_likes
  │       └──< survey_votes
  │
  ├──< individualchat (User_ID1, User_ID2)
  ├──< groupchat ──< groupparticipants >── user
  ├──< company_user >── company
  ├──< user_followers (self-referencing)
  ├──< inviteFriends (self-referencing)
  ├──< email_verification
  └── company (FK Company_ID)

reset_password_keys ──> user (via Email)
blacklisted_tokens (standalone)
```

---

## 3. Carte des routes API

### Authentification & Utilisateurs (`UserRouter`)

| Méthode | Endpoint | Auth | Description | Payload | Réponse |
|---------|----------|------|-------------|---------|---------|
| POST | `/login` | Non | Login utilisateur | `{Email, Password}` | `{authToken, user, message}` |
| POST | `/logout` | Oui | Logout (blacklist token) | - | 204 |
| GET | `/users` | Oui | Liste tous les utilisateurs | - | `[user]` |
| GET | `/users/:id` | Oui | Détail d'un utilisateur | - | `user` |
| POST | `/users` | Non | Créer un utilisateur | `{Username, LastName, FirstName, Email, Password, ...}` + multipart (ProfileImage) | 201 |
| PUT | `/users/:id` | Oui | Modifier un utilisateur | `{Username, LastName, ...}` | 204 |
| PUT | `/users/:id/password` | Oui | Modifier le mot de passe | `{Password}` | 204 |
| DELETE | `/users/:id` | Oui | Supprimer un utilisateur | `{Email}` | 204 |
| GET | `/users/check-username` | Non* | Vérifier disponibilité username | `?username=xxx` | `{isAvailable}` |
| GET | `/users/check-email` | Non* | Vérifier disponibilité email | `?email=xxx` | `{isAvailable}` |
| GET | `/users/check-phone` | Non* | Vérifier disponibilité phone | `?phone=xxx` | `{isAvailable}` |
| POST | `/users/request-verification` | Non* | Demander vérification email | `{userId, email}` | `{message}` |
| POST | `/users/verify-email` | Non* | Vérifier code email | `{userId, code}` | `{message}` |
| POST | `/users/forgot-password` | Non | Demander reset password | `{Email}` | `{uniqueKey, Email}` |
| POST | `/users/verify-key` | Non | Vérifier clé de reset | `{key}` | 200/400 |
| POST | `/users/reset-password` | Non | Réinitialiser password | `{hashedPassword, key}` | 204 |

### Posts (`PostRouter`)

| Méthode | Endpoint | Auth | Description | Payload | Réponse |
|---------|----------|------|-------------|---------|---------|
| GET | `/posts` | Oui | Liste tous les posts | - | `[post]` |
| GET | `/posts/:id` | Oui | Détail d'un post | - | `post` |
| POST | `/posts` | Oui | Créer un post | multipart: `{Image, Title, Content, Visibility}` | 201 |
| PUT | `/posts/:id` | Oui + Owner | Modifier un post | multipart: `{Title, Content, Visibility, Image?}` | 204 |
| DELETE | `/posts/:id` | Oui + Owner | Supprimer un post | - | 204 |

### Post Comments (`PostCommentsRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/posts/:postID/comments` | Oui | Commentaires d'un post |
| GET | `/posts/comments/:id` | Oui | Un commentaire par ID |
| POST | `/posts/:postID/comments` | Oui | Créer un commentaire |
| PUT | `/posts/comments/:id` | Oui + Owner | Modifier un commentaire |
| DELETE | `/posts/comments/:id` | Oui + Owner | Supprimer un commentaire |

### Post Likes (`PostLikeDislikeRoutes`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/posts/:postId/likes` | Oui | Likes d'un post |
| POST | `/posts/:postId/like` | Oui | Liker un post |
| POST | `/posts/:postId/unlike` | Oui | Unliker un post |

### Events (`EventRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/events` | Oui | Liste événements |
| GET | `/events/:id` | Oui | Détail événement |
| POST | `/events` | Oui | Créer un événement (multipart) |
| PUT | `/events/:id` | Oui + Owner | Modifier un événement |
| DELETE | `/events/:id` | Oui + Owner | Supprimer un événement |

### Event Comments (`EventCommentsRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/events/:eventID/comments` | Oui | Commentaires d'un événement |
| GET | `/events/comments/:id` | Oui | Un commentaire par ID |
| POST | `/events/:eventID/comments` | Oui | Créer un commentaire |
| PUT | `/events/comments/:id` | Oui + Owner | Modifier un commentaire |
| DELETE | `/events/comments/:id` | Oui + Owner | Supprimer un commentaire |

### Event Likes (`EventlikeRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/events/:eventId/likes` | Oui | Likes d'un événement |
| POST | `/events/:eventId/like` | Oui | Liker un événement |
| POST | `/events/:eventId/unlike` | Oui | Unliker un événement |

### Event Comment Likes (`EventCommentsLikesRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/events/comments/:commentID/likes` | Oui | Likes d'un commentaire event |
| POST | `/events/comments/:likeId/like` | Oui | Liker un commentaire |
| DELETE | `/events/comments/:likeId/unlike` | Oui | Unliker un commentaire |

### Surveys (`SurveyRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/surveys` | Oui | Liste sondages |
| GET | `/surveys/:id` | Oui | Détail sondage |
| POST | `/surveys` | Oui | Créer un sondage (multipart) |
| PUT | `/surveys/:id` | Oui + Owner | Modifier un sondage |
| DELETE | `/surveys/:id` | Oui + Owner | Supprimer un sondage |

### Survey Comments (`SurveyCommentsRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/surveys/:surveyID/comments` | Oui | Commentaires d'un sondage |
| GET | `/surveys/comments/:id` | Oui | Un commentaire par ID |
| POST | `/surveys/:surveyID/comments` | Oui | Créer un commentaire |
| PUT | `/surveys/comments/:id` | Oui + Owner | Modifier un commentaire |
| DELETE | `/surveys/comments/:id` | Oui + Owner | Supprimer un commentaire |

### Survey Likes (`SurveyLikesRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/surveys/:surveyId/likes` | Oui | Likes d'un sondage |
| POST | `/surveys/:surveyId/like` | Oui | Liker un sondage |
| POST | `/surveys/:surveyId/unlike` | Oui | Unliker un sondage |

### Survey Votes (`SurveyVoteRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/surveys/:surveyId/votes` | Oui | Votes d'un sondage |
| POST | `/surveys/:surveyId/vote` | Oui | Voter sur un sondage |

### Individual Chat (`IndividualchatRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/individualchats` | Oui | Tous les chats |
| GET | `/individualchats/:individualchatID` | Oui | Un chat par ID |
| GET | `/individualchats/user/:userId` | Oui | Chats d'un utilisateur |
| POST | `/individualchats` | Oui | Créer un message |
| PUT | `/individualchats/:individualchatID` | Oui | Modifier un message |
| DELETE | `/individualchats/:individualchatID` | Oui | Supprimer un message |

### Companies (`CompaniesRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/companies` | Oui | Liste entreprises |
| GET | `/companies/:id` | Oui | Détail entreprise |
| POST | `/companies` | Oui | Créer une entreprise (multipart) |

### Company-User (`CompanyUserRouter`)

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/company-users` | Oui | Ajouter utilisateur à une entreprise |
| GET | `/company-users/:companyID` | Oui | Utilisateurs d'une entreprise |
| PUT | `/company-users/:companyID/:UserID` | Oui | Modifier rôle utilisateur |
| DELETE | `/company-users/:companyID/:UserID` | Oui | Retirer utilisateur |

---

## 4. Architecture des modules

### Structure des fichiers

```
backend/
├── index.js                          # Point d'entrée : HTTP server + WebSocket
├── migrate.js                        # Script de migration DB
├── database.sql                      # Dump SQL complet
├── package.json
├── .eslintrc.json
├── assets/upload/                    # Fichiers uploadés (images)
├── utils/
│   ├── emailSender.js               # Envoi d'emails via Nodemailer
│   └── helperFunctions.js           # Fonctions utilitaires (generateVerificationCode)
└── src/
    ├── app.js                        # Configuration Express, CORS, routes
    ├── middleware/
    │   ├── auth.js                   # hashPassword, verifyPassword, verifyToken, blacklistToken
    │   ├── authCompany.js            # Auth spécifique entreprise (non utilisée dans les routes)
    │   ├── handleUpload.js           # Configuration Multer
    │   └── verifyOwner.js            # Vérification propriété de la ressource
    ├── controllers/
    │   ├── UserControllers.js
    │   ├── PostController.js
    │   ├── PostCommentsController.js
    │   ├── PostLikeDislikeController.js
    │   ├── PostCommentLikeController.js
    │   ├── PostCommentLikesController.js    # Doublon !
    │   ├── EventController.js
    │   ├── EventCommentsController.js
    │   ├── EventLikeController.js
    │   ├── EventCommentsLikesController.js
    │   ├── SurveyController.js
    │   ├── SurveyCommentsController.js
    │   ├── SurveyLikesController.js
    │   ├── SurveycCommentLikesController.js
    │   ├── SurveyVoteController.js
    │   ├── CompaniesController.js
    │   ├── CompanyUserController.js
    │   ├── IndividualchatController.js
    │   ├── GroupChatController.js
    │   ├── GroupParticipantsController.js
    │   └── UserFollowersController.js
    ├── models/
    │   ├── index.js                  # Registre de tous les managers + pool DB
    │   ├── AbstractManager/
    │   │   └── AbstractManager.js    # Classe de base (find, findAll, delete, setDatabase)
    │   └── Manager/
    │       ├── UserManager.js        # Non fourni mais référencé
    │       ├── PostManager.js
    │       ├── PostCommentsManager.js
    │       ├── PostLikeManager.js
    │       ├── PostCommentLikeManager.js
    │       ├── PostCommentLikesManager.js   # Doublon !
    │       ├── EventManager.js
    │       ├── EventCommentsManager.js
    │       ├── EventLikeManager.js
    │       ├── EventCommentsLikesManager.js
    │       ├── SurveyManager.js
    │       ├── SurveyCommentsManager.js
    │       ├── SurveyLikesManager.js
    │       ├── SurveycCommentLikesManager.js
    │       ├── SurveyVoteManager.js
    │       ├── CompaniesManager.js
    │       ├── CompanyUserManager.js
    │       ├── IndividualchatManager.js
    │       ├── GroupChatManager.js
    │       ├── GroupParticipantsManager.js
    │       ├── TokenBlacklistManager.js     # Non fourni mais référencé
    │       └── ResetPasswordKeyManager.js
    ├── routers/                      # Fichiers de routage (non fournis mais référencés dans app.js)
    │   ├── UserRouter.js
    │   ├── PostRouter.js
    │   ├── PostCommentsRouter.js
    │   ├── PostLikeDislikeRoutes.js
    │   ├── EventRouter.js
    │   ├── EventCommentsRouter.js
    │   ├── EventlikeRouter.js
    │   ├── EventCommentsLikesRouter.js
    │   ├── SurveyRouter.js
    │   ├── SurveyCommentsRouter.js
    │   ├── SurveyLikesRouter.js
    │   ├── SurveyVoteRouter.js
    │   ├── CompaniesRouter.js
    │   ├── CompanyUserRouter.js
    │   └── IndividualchatRouter.js
    └── websocket/
        └── websocket.js              # Configuration WebSocket (non fourni)
```

### Flux de données
```
Client Request → Express Router → Middleware (auth/upload/verifyOwner) → Controller → Model Manager → MySQL Pool → Response
```

### Dépendances entre modules
- **Controllers** dépendent de `models/index.js`
- **Models/index.js** instancie tous les Managers et leur injecte le pool DB
- **Middleware auth.js** dépend de `models` (pour tokenBlacklist)
- **Middleware verifyOwner.js** dépend de `models` (pour vérifier la propriété)
- **app.js** importe tous les routers
- **index.js** importe `app.js` + `websocket.js`

---

## 5. Problèmes détectés

### CRITIQUE

| # | Problème | Localisation | Description |
|---|----------|-------------|-------------|
| 1 | **Injection SQL potentielle** | `AbstractManager.js` | La méthode `find()` et `delete()` utilisent `select * from ${this.table} where id = ?` mais les managers enfants n'utilisent pas toujours `id` comme nom de colonne PK. La méthode `find` dans AbstractManager ne correspond à aucune table (aucune colonne nommée `id`). |
| 2 | **Votes multiples sans restriction** | `survey_votes` table | Aucune contrainte UNIQUE sur (Survey_ID, User_ID). Les données montrent qu'un utilisateur (ID=5) a voté 6 fois sur le même sondage. |
| 3 | **FK cassée sur company_user** | `database.sql` | `company_user_ibfk_1` référence `companies` au lieu de `company`. Migration/insertion échouera. |
| 4 | **Likes multiples possibles** | `post_likes`, `event_likes`, `survey_likes` | Aucune contrainte UNIQUE sur les paires (Entity_ID, User_ID). Un utilisateur peut liker plusieurs fois. |
| 5 | **Tokens JWT en clair dans le dump** | `database.sql` | Des dizaines de tokens JWT sont inclus dans le dump SQL. Le secret JWT est compromis si ces tokens sont analysés. |
| 6 | **Email de reset password hardcodé** | `UserControllers.js:getUserByEmail` | Le `to:` du mail est hardcodé à `nyukeit@outlook.com` au lieu d'utiliser l'email de l'utilisateur. |
| 7 | **URL de reset hardcodée** |