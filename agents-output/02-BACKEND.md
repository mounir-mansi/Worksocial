<!-- Généré par l'orchestrateur IA — Agent: Backend — 2026-03-11T09:57:58.117Z -->



# Audit et Correction Complète du Backend Worksocial

## 1. Problèmes identifiés

### CRITIQUES
1. **JWT envoyé dans le body de la réponse** (pas en cookie httpOnly) — `auth.js`
2. **Aucune validation Zod** sur aucune route
3. **Pas de Helmet** ni de rate-limiting
4. **CORS trop permissif** (doublon `app.use(cors())` + header manuel)
5. **Email de reset hardcodé** à `nyukeit@outlook.com` au lieu de l'email de l'utilisateur
6. **URL de reset hardcodée** à `localhost:5173`
7. **Mot de passe en clair envoyé dans `resetPassword`** — le body contient `hashedPassword` mais c'est le *client* qui devrait envoyer le mot de passe en clair, le serveur le hash
8. **Réponse login renvoie le user entier** y compris `hashedPassword`
9. **AbstractManager `find()` et `delete()`** utilisent `WHERE id = ?` alors qu'aucune table n'a de colonne `id`
10. **Votes multiples possibles** — aucune vérification avant INSERT dans `survey_votes`
11. **Likes multiples possibles** — pas de vérification UNIQUE côté application
12. **`deleteUser` appelle `next()` puis continue l'exécution** — double réponse possible
13. **`verifyKey` ne retourne pas de réponse en cas de succès** (clé valide non expirée)
14. **`updatePost`** envoie la réponse dans les callbacks mais `console.info` est exécuté après — pas de `return`
15. **`getUserByEmail`** envoie la réponse AVANT l'envoi d'email — expose `uniqueKey` au client
16. **FK cassée** `company_user_ibfk_1` référence `companies` au lieu de `company`
17. **Tokens JWT exposés** dans le dump SQL
18. **`SurveycCommentLikesManager`** référence la table `surveyc_comment_likes` au lieu de `survey_comment_likes`
19. **Pas de Prisma** — le document impose Prisma mais le code utilise mysql2 brut
20. **`migrate.js`** utilise `await` au top level sans être dans un module ESM

### MOYENS
21. Doublon `PostCommentLikeManager` / `PostCommentLikesManager`
22. `getUsersInCompany` utilise l'API Sequelize (`.findAll({ where, include })`) sur un manager MySQL brut
23. Aucun nettoyage des tokens blacklistés expirés
24. Upload sans validation de type de fichier ni de taille

---

## 2. Plan de migration

Étant donné la stack imposée (Prisma + Zod + Helmet + rate-limit + cookie httpOnly), je reconstruis les fichiers critiques. Je conserve la structure MVC mais remplace mysql2 brut par Prisma et ajoute toutes les sécurités manquantes.

---

## 3. Fichiers corrigés

### `backend/package.json`

```json
{
  "name": "worksocial-backend",
  "version": "2.0.0",
  "description": "Worksocial backend - secured",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "prisma:generate": "npx prisma generate",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:push": "npx prisma db push",
    "lint": "eslint --ext .js .",
    "test": "jest"
  },
  "dependencies": {
    "@prisma/client": "^5.10.0",
    "argon2": "^0.31.2",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.9",
    "socket.io": "^4.7.4",
    "ws": "^8.16.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "eslint": "^8.31.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-prettier": "^8.6.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.2.1",
    "jest": "^29.7.0",
    "nodemon": "^3.0.3",
    "prettier": "2.8.2",
    "prisma": "^5.10.0"
  }
}
```

---

### `backend/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  User_ID        Int       @id @default(autoincrement())
  Username       String    @unique @db.VarChar(255)
  LastName       String    @db.VarChar(255)
  FirstName      String    @db.VarChar(255)
  BirthDate      DateTime? @db.Date
  Age            Int?
  Address        String?   @db.Text
  Email          String    @unique @db.VarChar(255)
  Phone          String?   @db.VarChar(255)
  Biography      String?   @db.Text
  hashedPassword String    @db.VarChar(255)
  Role           UserRole  @default(User)
  Gender         Gender
  ProfileImage   String?   @db.Text
  Created_At     DateTime  @default(now())
  Updated_At     DateTime  @updatedAt
  Company_ID     Int?
  emailVerified  Boolean   @default(false)

  company              Company?              @relation(fields: [Company_ID], references: [Company_ID], onDelete: SetNull)
  posts                Post[]
  postComments         PostComment[]
  postLikes            PostLike[]
  postCommentLikes     PostCommentLike[]
  events               Event[]
  eventComments        EventComment[]
  eventLikes           EventLike[]
  eventCommentLikes    EventCommentLike[]
  surveys              Survey[]
  surveyComments       SurveyComment[]
  surveyLikes          SurveyLike[]
  surveyCommentLikes   SurveyCommentLike[]
  surveyVotes          SurveyVote[]
  chatsAsUser1         IndividualChat[]      @relation("ChatUser1")
  chatsAsUser2         IndividualChat[]      @relation("ChatUser2")
  groupChats           GroupChat[]
  groupParticipations  GroupParticipant[]
  companyUsers         CompanyUser[]
  followedBy           UserFollower[]        @relation("Following")
  following            UserFollower[]        @relation("Follower")
  invitesSent          InviteFriend[]        @relation("Inviter")
  invitesReceived      InviteFriend[]        @relation("Invitee")
  emailVerifications   EmailVerification[]
  resetPasswordKeys    ResetPasswordKey[]

  @@map("user")
}

enum UserRole {
  Admin
  User
}

enum Gender {
  Male
  Female
  Other
}

model Company {
  Company_ID Int      @id @default(autoincrement())
  Name       String   @db.VarChar(255)
  URL        String?  @db.VarChar(255)
  Logo       String?  @db.Text
  Phone      String?  @db.VarChar(255)
  Email      String?  @db.VarChar(255)
  Activity   String?  @db.Text
  Address    String?  @db.Text
  Created_At DateTime @default(now())
  Updated_At DateTime @updatedAt

  users        User[]
  companyUsers CompanyUser[]

  @@map("company")
}

model CompanyUser {
  Company_ID Int
  User_ID    Int
  Role       String? @db.VarChar(255)

  company Company @relation(fields: [Company_ID], references: [Company_ID], onDelete: Cascade)
  user    User    @relation(fields: [User_ID], references: [User_ID], onDelete: Cascade)

  @@id([Company_ID, User_ID])
  @@map("company_user")
}

model Post {
  Post_ID    Int        @id @default(autoincrement())
  Image      String?    @db.Text
  Title      String     @db.VarChar(255)
  Content    String     @db.Text
  Visibility Visibility
  Created_At DateTime   @default(now())
  Updated_At DateTime   @updatedAt
  User_ID    Int?

  user     User?         @relation(fields: [User_ID], references: [User_ID])
  comments PostComment[]
  likes    PostLike[]

  @@map("post")
}

enum Visibility {
  Public
  Private
}

model PostComment {
  Comment_ID Int      @id @default(autoincrement())
  Post_ID    Int
  User_ID    Int
  Comment    String   @db.Text
  Created_At DateTime @default(now())

  post  Post             @relation(fields: [Post_ID], references: [Post_ID], onDelete: Cascade)
  user  User             @relation(fields: [User_ID], references: [User_ID])
  likes PostCommentLike[]

  @@map("post_comments")
}

model PostLike {
  Post_ID  Int
  User_ID  Int
  Liked_At DateTime @default(now())

  post Post @relation(fields: [Post_ID], references: [Post_ID], onDelete: Cascade)
  user User @relation(fields: [User_ID], references: [User_ID])

  @@id([Post_ID, User_ID])
  @@map("post_likes")
}

model PostCommentLike {
  Like_ID    Int      @id @default(autoincrement())
  Comment_ID Int
  User_ID    Int
  Liked_At   DateTime @default(now())

  comment PostComment @relation(fields: [Comment_ID], references: [Comment_ID], onDelete: Cascade)
  user    User        @relation(fields: [User_ID], references: [User_ID])

  @@unique([Comment_ID, User_ID])
  @@map("post_comment_likes")
}

model Event {
  Event_ID         Int        @id @default(autoincrement())
  Image            String?    @db.Text
  EventName        String     @db.VarChar(255)
  StartDate        DateTime   @db.Date
  EndDate          DateTime?  @db.Date
  StartTime        DateTime?  @db.Time(0)
  EndTime          DateTime?  @db.Time(0)
  Description      String?    @db.Text
  Visibility       Visibility
  ParticipantCount Int?       @default(0)
  Created_At       DateTime   @default(now())
  Updated_At       DateTime   @updatedAt
  User_ID          Int?

  user     User?          @relation(fields: [User_ID], references: [User_ID])
  comments EventComment[]
  likes    EventLike[]

  @@map("event")
}

model EventComment {
  Comment_ID Int      @id @default(autoincrement())
  Event_ID   Int
  User_ID    Int
  Comment    String   @db.Text
  Created_At DateTime @default(now())

  event Event              @relation(fields: [Event_ID], references: [Event_ID], onDelete: Cascade)
  user  User               @relation(fields: [User_ID], references: [User_ID])
  likes EventCommentLike[]

  @@map("event_comments")
}

model EventLike {
  Event_ID Int
  User_ID  Int
  Liked_At DateTime @default(now())

  event Event @relation(fields: [Event_ID], references: [Event_ID], onDelete: Cascade)
  user  User  @relation(fields: [User_ID], references: [User_ID])

  @@id([Event_ID, User_ID])
  @@map("event_likes")
}

model EventCommentLike {
  Like_ID    Int      @id @default(autoincrement())
  Comment_ID Int
  User_ID    Int
  Liked_At   DateTime @default(now())

  comment EventComment @relation(fields: [Comment_ID], references: [Comment_ID], onDelete: Cascade)
  user    User         @relation(fields: [User_ID], references: [User_ID])

  @@unique([Comment_ID, User_ID])
  @@map("event_comment_likes")
}

model Survey {
  Survey_ID  Int        @id @default(autoincrement())
  Image      String?    @db.Text
  Title      String     @db.VarChar(255)
  Content    String     @db.Text
  Visibility Visibility
  EndDate    DateTime?  @db.Date
  Created_At DateTime   @default(now())
  Updated_At DateTime   @updatedAt
  User_ID    Int?
  Option1    String     @db.VarChar(255)
  Option2    String     @db.VarChar(255)
  Option3    String?    @db.VarChar(255)
  Option4    String?    @db.VarChar(255)

  user     User?           @relation(fields: [User_ID], references: [User_ID])
  comments SurveyComment[]
  likes    SurveyLike[]
  votes    SurveyVote[]

  @@map("survey")
}

model SurveyComment {
  Comment_ID Int      @id @default(autoincrement())
  Survey_ID  Int
  User_ID    Int
  Comment    String   @db.Text
  Created_At DateTime @default(now())

  survey Survey              @relation(fields: [Survey_ID], references: [Survey_ID], onDelete: Cascade)
  user   User                @relation(fields: [User_ID], references: [User_ID])
  likes  SurveyCommentLike[]

  @@map("survey_comments")
}

model SurveyLike {
  Survey_ID Int
  User_ID   Int
  Liked_At  DateTime @default(now())

  survey Survey @relation(fields: [Survey_ID], references: [Survey_ID], onDelete: Cascade)
  user   User   @relation(fields: [User_ID], references: [User_ID])

  @@id([Survey_ID, User_ID])
  @@map("survey_likes")
}

model SurveyCommentLike {
  Like_ID    Int      @id @default(autoincrement())
  Comment_ID Int
  User_ID    Int
  Liked_At   DateTime @default(now())

  comment SurveyComment @relation(fields: [Comment_ID], references: [Comment_ID], onDelete: Cascade)
  user    User          @relation(fields: [User_ID], references: [User_ID])

  @@unique([Comment_ID, User_ID])
  @@map("survey_comment_likes")
}

model SurveyVote {
  Survey_ID   Int
  User_ID     Int
  Voted_For   String   @db.VarChar(10)
  create_time DateTime @default(now())

  survey Survey @relation(fields: [Survey_ID], references: [Survey_ID], onDelete: Cascade)
  user   User   @relation(fields: [User_ID], references: [User_ID])

  @@id([Survey_ID, User_ID])
  @@map("survey_votes")
}

model IndividualChat {
  Chat_ID    Int      @id @default(autoincrement())
  Content    String   @db.Text
  Created_At DateTime @default(now())
  Updated_At DateTime @updatedAt
  User_ID1   Int?
  User_ID2   Int?

  user1 User? @relation("ChatUser1", fields: [User_ID1], references: [User_ID])
  user2 User? @relation("ChatUser2", fields: [User_ID2], references: [User_ID])

  @@map("individualchat")
}

model GroupChat {
  GroupChat_ID Int      @id @default(autoincrement())
  GroupImage   String?  @db.Text
  GroupName    String   @db.VarChar(255)
  Content      String   @db.Text
  Created_At   DateTime @default(now())
  Updated_At   DateTime @updatedAt
  User_ID      Int?

  user         User?              @relation(fields: [User_ID], references: [User_ID])
  participants GroupParticipant[]

  @@map("groupchat")
}

model GroupParticipant {
  GroupChat_ID Int
  User_ID      Int
  Joined_At    DateTime @default(now())

  groupChat GroupChat @relation(fields: [GroupChat_ID], references: [GroupChat_ID], onDelete: Cascade)
  user      User     @relation(fields: [User_ID], references: [User_ID])

  @@id([GroupChat_ID, User_ID])
  @@map("groupparticipants")
}

model BlacklistedToken {
  id        Int      @id @default(autoincrement())
  jwtToken  String   @db.VarChar(500)
  createdAt DateTime @default(now())

  @@map("blacklisted_tokens")
}

model EmailVerification {
  verification_id Int      @id @default(autoincrement())
  User_ID         Int
  verification_code String @db.VarChar(255)
  expires_at      DateTime

  user User @relation(fields: [User_ID], references: [User_ID], onDelete: Cascade)

  @@map("email_verification")
}

model ResetPasswordKey {
  unique_key String   @id @db.VarChar(80)
  Email      String   @db.VarChar(255)
  created_at DateTime @default(now())
  expires_at DateTime @default(dbgenerated("(now() + interval 15 minute)"))

  user User @relation(fields: [Email], references: [Email], onDelete: Cascade)

  @@map("reset_password_keys")
}

model UserFollower {
  Follower_ID  Int
  Following_ID Int
  Followed_At  DateTime @default(now())

  follower  User @relation("Follower", fields: [Follower_ID], references: [User_ID])
  following User @relation("Following", fields: [Following_ID], references: [User_ID])

  @@id([Follower_ID, Following_ID])
  @@map("user_followers")
}

model InviteFriend {
  invite_id  Int      @id @default(autoincrement())
  inviter_id Int
  invitee_id Int
  sent_at    DateTime @default(now())

  inviter User @relation("Inviter", fields: [inviter_id], references: [User_ID], onDelete: Cascade)
  invitee User @relation("Invitee", fields: [invitee_id], references: [User_ID], onDelete: Cascade)

  @@map("inviteFriends")
}
```

---

### `backend/src/lib/prisma.js`

```js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

module.exports = prisma;
```

---

### `backend/src/validations/schemas.js`

```js
const { z } = require("zod");

// ─── Auth ────────────────────────────────────────────────────────────
const loginSchema = z.object({
  Email: z.string().email("Invalid email format"),
  Password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  Username: z.string().min(2).max(255),
  LastName: z.string().min(1).max(255),
  FirstName: z.string().min(1).max(255),
  Email: z.string().email(),
  Password: z.string().min(8, "Password must be at least 8 characters"),
  BirthDate: z.string().optional().nullable(),
  Address: z.string().optional().nullable(),
  Phone: z.string().optional().nullable(),
  Biography: z.string().optional().nullable(),
  Role: z.enum(["Admin", "User"]).default("User"),
  Gender: z.enum(["Male", "Female", "Other"]),
  Company_ID: z.number().int().positive().optional().nullable(),
});

const updateUserSchema = z.object({
  Username: z.string().min(2).max(255).optional(),
  LastName: z.string().min(1).max(255).optional(),
  FirstName: z.string().min(1).max(255).optional(),
  BirthDate: z.string().optional().nullable(),
  Age: z.number().int().optional().nullable(),
  Address: z.string().optional().nullable(),
  Email: z.string().email().optional(),
  Phone: z.string().optional().nullable(),
  Biography: z.string().optional().nullable(),
  Gender: z.enum(["Male", "Female", "Other"]).optional(),
  Company_ID: z.number().int().positive().optional().nullable(),
});

const updatePasswordSchema = z.object({
  Password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotPasswordSchema = z.object({
  Email: z.string().email(),
});

const verifyKeySchema = z.object({
  key: z.string().min(1),
});

const resetPasswordSchema = z.object({
  Password: z.string().min(8),
  key: z.string().min(1),
});

const requestVerificationSchema = z.object({
  userId: z.number().int().positive(),
  email: z.string().email(),
});

const verifyEmailCodeSchema = z.object({
  userId: z.number().int().positive(),
  code: z.string().min(1),
});

// ─── Posts ───────────────────────────────────────────────────────────
const createPostSchema = z.object({
  Title: z.string().min(1).max(255),
  Content: z.string().min(1),
  Visibility: z.enum(["Public", "Private"]),
});

const updatePostSchema = z.object({
  Title: z.string().min(1).max(255).optional(),
  Content: z.string().min(1).optional(),
  Visibility: z.enum(["Public", "Private"]).optional(),
});

// ─── Comments (generic) ─────────────────────────────────────────────
const createCommentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

const updateCommentSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

// ─── Events ─────────────────────────────────────────────────────────
const createEventSchema = z.object({
  EventName: z.string().min(1).max(255),
  StartDate: z.string().min(1),
  EndDate: z.string().optional().nullable(),
  StartTime: z.string().optional().nullable(),
  EndTime: z.string().optional().nullable(),
  Description: z.string().optional().nullable(),
  Visibility: z.enum(["Public", "Private"]),
  ParticipantCount: z.number().int().optional().nullable(),
});

const updateEventSchema = z.object({
  EventName: z.string().min(1).max(255).optional(),
  StartDate: z.string().optional(),
  EndDate: z.string().optional().nullable(),
  StartTime: z.string().optional().nullable(),
  EndTime: z.string().optional().nullable(),
  Description: z.string().optional().nullable(),
  Visibility: z.enum(["Public", "Private"]).optional(),
});

// ─── Surveys ────────────────────────────────────────────────────────
const createSurveySchema = z.object({
  Title: z.string().min(1).max(255),
  Content: z.string().min(1),
  Visibility: z.enum(["Public", "Private"]),
  EndDate: z.string().optional().nullable(),
  Option1: z.string().min(1).max(255),
  Option2: z.string().min(1).max(255),
  Option3: z.string().max(255).optional().nullable(),
  Option4: z.string().max(255).optional().nullable(),
});

const updateSurveySchema = z.object({
  Title: z.string().min(1).max(255).optional(),
  Content: z.string().min(1).optional(),
  Visibility: z.enum(["Public", "Private"]).optional(),
  EndDate: z.string().optional().nullable(),
  Option1: z.string().min(1).max(255).optional(),
  Option2: z.string().min(1).max(255).optional(),
  Option3: z.string().max(255).optional().nullable(),
  Option4: z.string().max(255).optional().nullable(),
});

// ─── Survey Votes ───────────────────────────────────────────────────
const castVoteSchema = z.object({
  votedOption: z.string().min(1).max(10),
});

// ─── Likes ──────────────────────────────────────────────────────────
const likeSchema = z.object({
  userId: z.number().int().positive(),
});

// ─── Individual Chat ────────────────────────────────────────────────
const createChatSchema = z.object({
  Content: z.string().min(1),
  User_ID1: z.number().int().positive(),
  User_ID2: z.number().int().positive(),
});

const updateChatSchema = z.object({
  Content: z.string().min(1),
});

// ─── Company ────────────────────────────────────────────────────────
const createCompanySchema = z.object({
  Name: z.string().min(1).max(255),
  URL: z.string().max(255).optional().nullable(),
  Phone: z.string().optional().nullable(),
  Email: z.string().email().optional().nullable(),
  Activity: z.string().optional().nullable(),
  Address: z.string().optional().nullable(),
});

// ─── Company User ───────────────────────────────────────────────────
const addUserToCompanySchema = z.object({
  Company_ID: z.number().int().positive(),
  User_ID: z.number().int().positive(),
  Role: z.string().optional().nullable(),
});

const updateCompanyUserRoleSchema = z.object({
  Role: z.string().min(1),
});

// ─── Param validators ───────────────────────────────────────────────
const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number"),
});

const postIdParamSchema = z.object({
  postId: z.string().regex(/^\d+$/),
});

const eventIdParamSchema = z.object({
  eventId: z.string().regex(/^\d+$/),
});

const surveyIdParamSchema = z.object({
  surveyId: z.string().regex(/^\d+$/),
});

module.exports = {
  loginSchema,
  signupSchema,
  updateUserSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  verifyKeySchema,
  resetPasswordSchema,
  requestVerificationSchema,
  verifyEmailCodeSchema,
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema,
  createEventSchema,
  updateEventSchema,
  createSurveySchema,
  updateSurveySchema,
  castVoteSchema,
  likeSchema,
  createChatSchema,
  updateChatSchema,
  createCompanySchema,
  addUserToCompanySchema,
  updateCompanyUserRoleSchema,
  idParamSchema,
  postIdParamSchema,
  eventIdParamSchema,
  surveyIdParamSchema,
};
```

---

### `backend/src/middleware/validate.js`

```js
/**
 * Zod validation middleware factory.
 * Usage: validate(schema, 'body' | 'query' | 'params')
 */
const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }
    // Replace source with parsed (and coerced) data
    req[source] = result.data;
    return next();
  } catch (err) {
    console.error("Validation middleware error:", err);
    return res.status(500).json({ message: "Internal validation error" });
  }
};

module.exports = validate;
```

---

### `backend/src/middleware/auth.js`

```js
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const COOKIE_NAME = "authToken";

const isProduction = () => process.env.NODE_ENV === "production";

/**
 * Hash password middleware — replaces req.body.Password with req.body.hashedPassword
 */
const hashPassword = async (req, res, next) => {
  try {
    if (!req.body.Password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const hash = await argon2.hash(req.body.Password, ARGON2_OPTIONS);
    req.body.hashedPassword = hash;
    delete req.body.Password;
    return next();
  } catch (err) {
    console.error("hashPassword error:", err);
    return res.sendStatus(500);
  }
};

/**
 * Verify password & issue JWT in httpOnly cookie
 */
const verifyPassword = async (req, res) => {
  try {
    if (!req.user || !req.user.hashedPassword) {
      return res.status(500).json({ message: "Server error: user not loaded" });
    }

    const isVerified = await argon2.verify(
      req.user.hashedPassword,
      req.body.Password
    );

    if (!isVerified) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = { sub: req.user.User_ID };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    // Set JWT as httpOnly cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: isProduction() ? "strict" : "lax",
      maxAge: 4 