<!-- Généré par l'orchestrateur IA — Agent: DevOps — 2026-03-11T10:07:20.065Z -->



# Configuration de Déploiement Complète — Worksocial

## Informations du projet

| Paramètre | Valeur |
|---|---|
| **Sous-domaine** | `worksocial.mandev.fr` |
| **Port backend** | `3002` |
| **Répertoire projet** | `/var/www/worksocial` |
| **User système** | `www-data` (ou user dédié) |
| **Base de données** | MySQL 8 — `worksocial_prod` |
| **WebSocket** | Oui (via `ws` + `socket.io`) |

---

## 1. Configuration Nginx — Vhost complet

**Fichier** : `/etc/nginx/sites-available/worksocial.mandev.fr`

```nginx
# Redirection HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name worksocial.mandev.fr;

    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS — Reverse proxy vers Node.js (port 3002)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name worksocial.mandev.fr;

    # ─── SSL (sera rempli par Certbot) ───────────────────────────
    ssl_certificate /etc/letsencrypt/live/worksocial.mandev.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/worksocial.mandev.fr/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ─── Headers de sécurité ─────────────────────────────────────
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' wss://worksocial.mandev.fr https://worksocial.mandev.fr; frame-ancestors 'self';" always;

    # ─── Logs ────────────────────────────────────────────────────
    access_log /var/log/nginx/worksocial.access.log;
    error_log /var/log/nginx/worksocial.error.log;

    # ─── Taille max upload (images profil, posts, events) ────────
    client_max_body_size 10M;

    # ─── Fichiers statiques uploadés ─────────────────────────────
    location /upload/ {
        alias /var/www/worksocial/backend/assets/upload/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;

        # Types MIME images
        location ~* \.(jpg|jpeg|png|gif|webp|svg|ico)$ {
            expires 90d;
        }
    }

    # ─── Frontend statique (React build) ─────────────────────────
    location / {
        root /var/www/worksocial/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache pour assets statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }

    # ─── API Backend (reverse proxy) ─────────────────────────────
    location /api/ {
        # Si vos routes n'ont PAS le préfixe /api/, décommentez la ligne rewrite :
        rewrite ^/api/(.*) /$1 break;

        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Pas de buffering pour les API
        proxy_buffering off;
    }

    # ─── Routes API SANS préfixe /api/ (alternative) ─────────────
    # Si le frontend appelle directement /users, /posts, /events, etc.
    # Décommentez ce bloc ET commentez le bloc /api/ ci-dessus
    #
    # location ~ ^/(users|posts|events|surveys|companies|individualchats|company-user) {
    #     proxy_pass http://127.0.0.1:3002;
    #     proxy_http_version 1.1;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    #     proxy_buffering off;
    # }

    # ─── WebSocket (socket.io + ws) ──────────────────────────────
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }

    # ─── Bloquer l'accès aux fichiers sensibles ──────────────────
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \.(env|git|sql|md|json|lock|yml|yaml)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**Activation :**

```bash
sudo ln -s /etc/nginx/sites-available/worksocial.mandev.fr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

> **⚠️ Note importante sur les routes API** : Le code source montre que les routes Express sont montées directement sans préfixe (`/users`, `/posts`, `/events`, etc.), pas sous `/api/`. Vous avez deux options :
> - **Option A** (recommandée) : Garder le bloc `location /api/` avec le `rewrite` et configurer le frontend pour préfixer toutes les requêtes avec `/api/`
> - **Option B** : Utiliser le bloc regex commenté qui matche chaque type de route individuellement

---

## 2. Règles UFW — Bloquer le port 3002 depuis Internet

```bash
# Bloquer le port 3002 depuis l'extérieur (toutes interfaces)
sudo ufw deny 3002/tcp comment "Worksocial - block direct backend access"

# Vérifier que le port 3002 n'est PAS ouvert
sudo ufw status numbered | grep 3002

# Le trafic local 127.0.0.1:3002 n'est PAS affecté par UFW (loopback exclu par défaut)
```

**Vérification :**

```bash
# Depuis l'extérieur, cela doit échouer :
curl -v http://87.106.201.186:3002

# Depuis le serveur lui-même, cela doit fonctionner :
curl -v http://127.0.0.1:3002
```

---

## 3. PM2 — Démarrage et ecosystem.config.js

### ecosystem.config.js

**Fichier** : `/var/www/worksocial/ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    {
      name: "worksocial",
      cwd: "/var/www/worksocial/backend",
      script: "index.js",
      interpreter: "node",
      instances: 1, // pas de cluster à cause des WebSockets avec état
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      // Logs
      error_file: "/var/log/pm2/worksocial-error.log",
      out_file: "/var/log/pm2/worksocial-out.log",
      log_file: "/var/log/pm2/worksocial-combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      // Restart strategy en cas de crash
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
```

### Commandes PM2

```bash
# Créer le répertoire de logs
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Installer les dépendances
cd /var/www/worksocial/backend
npm ci --production

# Démarrer l'application
pm2 start /var/www/worksocial/ecosystem.config.js

# Vérifier
pm2 status
pm2 logs worksocial --lines 50

# Sauvegarder la config PM2 pour le redémarrage automatique
pm2 save

# Configurer PM2 pour démarrer au boot (si pas déjà fait)
pm2 startup systemd -u $USER --hp /home/$USER
# Exécuter la commande affichée par pm2 startup
```

---

## 4. Fichier .env de production

**Fichier** : `/var/www/worksocial/backend/.env`

```bash
# ─── Application ─────────────────────────────────────────────
NODE_ENV=production
PORT=3002

# ─── Base de données MySQL ───────────────────────────────────
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=worksocial_user
DB_PASSWORD=CHANGER_MOT_DE_PASSE_FORT_ICI
DB_NAME=worksocial_prod

# ─── JWT ─────────────────────────────────────────────────────
JWT_SECRET=GENERER_UNE_CLE_ALEATOIRE_DE_64_CARACTERES_MINIMUM

# ─── Email (Nodemailer) ─────────────────────────────────────
SMTP_HOST=smtp.votrefournisseur.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@mandev.fr
SMTP_PASSWORD=CHANGER_MOT_DE_PASSE_SMTP

# ─── URLs ────────────────────────────────────────────────────
FRONTEND_URL=https://worksocial.mandev.fr
BACKEND_URL=https://worksocial.mandev.fr
# Utilisé dans les emails de reset password
APP_URL=https://worksocial.mandev.fr

# ─── CORS ────────────────────────────────────────────────────
CORS_ORIGIN=https://worksocial.mandev.fr
```

### Génération du JWT_SECRET :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Création de l'utilisateur MySQL dédié :

```sql
-- Se connecter en root MySQL
sudo mysql -u root

CREATE DATABASE IF NOT EXISTS worksocial_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'worksocial_user'@'localhost' IDENTIFIED BY 'CHANGER_MOT_DE_PASSE_FORT_ICI';
GRANT SELECT, INSERT, UPDATE, DELETE ON worksocial_prod.* TO 'worksocial_user'@'localhost';
FLUSH PRIVILEGES;

-- Importer le schéma (adapter le chemin)
USE worksocial_prod;
SOURCE /var/www/worksocial/backend/database.sql;
```

### Modifications nécessaires dans le code source

**⚠️ IMPORTANT** — Le code source contient des URLs en dur qui doivent être modifiées :

**`backend/src/app.js`** — Remplacer le CORS hardcodé :

```javascript
// AVANT (ligne 8)
res.setHeader('Access-Control-Allow-Origin', 'https://worksocialmounir.netlify.app');

// APRÈS
res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://worksocial.mandev.fr');
```

Et configurer CORS proprement :

```javascript
const cors = require("cors");
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://worksocial.mandev.fr',
  credentials: true,
}));
```

**`backend/src/controllers/UserControllers.js`** — Remplacer les URLs hardcodées :

```javascript
// AVANT (ligne dans getUserByEmail)
text: `...http://localhost:5173/resetpassword/${uniqueKey}`,

// APRÈS
text: `...${process.env.APP_URL}/resetpassword/${uniqueKey}`,
```

---

## 5. Certbot — SSL pour le sous-domaine

### Prérequis DNS

Ajouter un enregistrement DNS A **avant** de lancer Certbot :

```
worksocial.mandev.fr.    A    87.106.201.186
```

### Génération du certificat

```bash
# Créer le répertoire certbot si inexistant
sudo mkdir -p /var/www/certbot

# Étape 1 : Obtenir le certificat (SANS les directives SSL dans nginx d'abord)
# Temporairement, commentez le bloc server 443 et décommentez :
sudo certbot certonly --webroot -w /var/www/certbot \
  -d worksocial.mandev.fr \
  --email admin@mandev.fr \
  --agree-tos \
  --no-eff-email

# OU si nginx est déjà configuré avec le plugin nginx :
sudo certbot --nginx -d worksocial.mandev.fr \
  --email admin@mandev.fr \
  --agree-tos \
  --no-eff-email

# Étape 2 : Vérifier le renouvellement automatique
sudo certbot renew --dry-run

# Étape 3 : Recharger nginx
sudo systemctl reload nginx
```

### Vérifier que le timer certbot est actif :

```bash
sudo systemctl status certbot.timer
sudo systemctl list-timers | grep certbot
```

---

## 6. Checklist post-déploiement

### 🔧 Préparation serveur

- [ ] **DNS** : Enregistrement A `worksocial.mandev.fr → 87.106.201.186` créé et propagé
  ```bash
  dig +short worksocial.mandev.fr
  # Doit retourner : 87.106.201.186
  ```
- [ ] **Répertoire projet** créé avec les bonnes permissions
  ```bash
  sudo mkdir -p /var/www/worksocial
  sudo chown -R $USER:www-data /var/www/worksocial
  chmod -R 750 /var/www/worksocial
  ```
- [ ] **Code déployé** (git clone ou rsync)
- [ ] **Répertoire uploads** existe et est inscriptible
  ```bash
  mkdir -p /var/www/worksocial/backend/assets/upload
  chmod 775 /var/www/worksocial/backend/assets/upload
  ```

### 🗄️ Base de données

- [ ] Base `worksocial_prod` créée
- [ ] Utilisateur MySQL `worksocial_user` créé avec permissions restreintes
- [ ] Schéma SQL importé
- [ ] Connexion testée depuis le backend
  ```bash
  cd /var/www/worksocial/backend
  node -e "require('dotenv').config(); const mysql = require('mysql2/promise'); mysql.createConnection({host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME}).then(c => { console.log('✅ DB OK'); c.end(); }).catch(e => console.error('❌', e.message));"
  ```

### 📦 Application

- [ ] **`npm ci --production`** exécuté dans `/var/www/worksocial/backend`
- [ ] **Frontend buildé** : `frontend/dist/` contient `index.html`
  ```bash
  ls -la /var/www/worksocial/frontend/dist/index.html
  ```
- [ ] **`.env`** créé avec toutes les variables renseignées
- [ ] **`.env`** non accessible depuis le web
  ```bash
  chmod 600 /var/www/worksocial/backend/.env
  ```
- [ ] **URLs hardcodées** corrigées dans le code (CORS, reset password)

### 🔒 Sécurité

- [ ] **Certificat SSL** généré et valide
  ```bash
  sudo certbot certificates | grep worksocial
  curl -I https://worksocial.mandev.fr
  ```
- [ ] **Port 3002 bloqué** depuis Internet
  ```bash
  sudo ufw status | grep 3002
  # Depuis une machine externe :
  nc -zv 87.106.201.186 3002  # Doit échouer/timeout
  ```
- [ ] **Headers de sécurité** présents
  ```bash
  curl -sI https://worksocial.mandev.fr | grep -iE "(x-frame|x-content|strict-transport|x-xss|referrer-policy|content-security)"
  ```
- [ ] **Fichiers sensibles** non accessibles
  ```bash
  curl -s -o /dev/null -w "%{http_code}" https://worksocial.mandev.fr/.env
  # Doit retourner : 403
  curl -s -o /dev/null -w "%{http_code}" https://worksocial.mandev.fr/.git/config
  # Doit retourner : 403
  ```

### 🚀 Application en production

- [ ] **PM2** démarre l'app correctement
  ```bash
  pm2 start /var/www/worksocial/ecosystem.config.js
  pm2 status
  # worksocial doit être "online"
  ```
- [ ] **Backend répond** via Nginx
  ```bash
  # Si routes via /api/ :
  curl -s https://worksocial.mandev.fr/api/users | head -c 200
  # Si routes directes :
  curl -s https://worksocial.mandev.fr/users | head -c 200
  ```
- [ ] **Frontend se charge** correctement
  ```bash
  curl -s -o /dev/null -w "%{http_code}" https://worksocial.mandev.fr/
  # Doit retourner : 200
  ```
- [ ] **WebSocket** fonctionne
  ```bash
  # Tester via navigateur : ouvrir la console réseau, vérifier les connexions ws://
  ```
- [ ] **Upload d'images** fonctionne (créer un post avec image)
- [ ] **PM2 sauvegardé** pour redémarrage auto
  ```bash
  pm2 save
  pm2 startup  # suivre les instructions
  ```

### 📊 Monitoring

- [ ] **Logs Nginx** accessibles
  ```bash
  tail -f /var/log/nginx/worksocial.access.log
  tail -f /var/log/nginx/worksocial.error.log
  ```
- [ ] **Logs PM2** accessibles
  ```bash
  pm2 logs worksocial --lines 20
  ```
- [ ] **L'autre projet** (QCM Patentino port 3001) fonctionne toujours
  ```bash
  pm2 status  # vérifier que les deux apps sont "online"
  curl -I https://patentino.mandev.fr  # ou le domaine correspondant
  ```

### 🔄 Renouvellement SSL automatique

- [ ] **Timer certbot** actif
  ```bash
  sudo systemctl list-timers | grep certbot
  ```
- [ ] **Dry-run** réussit
  ```bash
  sudo certbot renew --dry-run
  ```

---

## Résumé architecture finale

```
Internet
   │
   ▼
┌──────────────────────────┐
│       UFW Firewall       │
│  80 ✅  443 ✅  3002 ❌  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│              Nginx (port 443)            │
│                                          │
│  worksocial.mandev.fr                    │
│  ├── /              → frontend/dist/     │
│  ├── /api/*         → 127.0.0.1:3002    │
│  ├── /socket.io/    → 127.0.0.1:3002 ↕  │
│  └── /upload/       → assets/upload/     │
│                                          │
│  patentino.mandev.fr (existant)          │
│  └── /              → 127.0.0.1:3001    │
└──────────┬───────────────────────────────┘
           │ (loopback uniquement)
           ▼
┌──────────────────────────┐
│   PM2                    │
│   ├── worksocial :3002   │
│   └── qcm-patentino:3001│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│   MySQL 8                │
│   └── worksocial_prod    │
└──────────────────────────┘
```