# HRM System — Server Setup Guide

> Production server: **3.93.19.170** | User: **ubuntu**

## Stack
- **Frontend**: Next.js 16 (port 3000)
- **Backend**: Node.js + Express (port 5000)
- **Database**: MySQL
- **Process manager**: PM2
- **Reverse proxy**: Nginx

---

## 1. Initial Server Setup

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Nginx
sudo apt install -y nginx
```

---

## 2. MySQL Setup

```sql
CREATE DATABASE hrm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hrm_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON hrm_db.* TO 'hrm_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 3. Clone & Configure the App

```bash
sudo mkdir -p /var/www/hrm
sudo chown ubuntu:ubuntu /var/www/hrm
cd /var/www/hrm
git clone git@github.com:harimohan886/hrm.git .

# Backend env
cp backend/.env.example backend/.env
nano backend/.env   # fill DB credentials, JWT_SECRET, FRONTEND_URL=http://3.93.19.170

# Frontend env
cp frontend/.env.example frontend/.env.local
nano frontend/.env.local  # set NEXT_PUBLIC_API_URL=http://3.93.19.170:5000/api
```

---

## 4. Install Dependencies & Build

```bash
cd /var/www/hrm/backend && npm ci
cd /var/www/hrm/frontend && npm ci && npm run build
```

---

## 5. Start with PM2

```bash
cd /var/www/hrm
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # follow the printed command to auto-start on reboot
```

---

## 6. Nginx Configuration

```nginx
# /etc/nginx/sites-available/hrm
server {
    listen 80;
    server_name 3.93.19.170;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hrm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. GitHub Actions Secret

Add the following secret in your GitHub repository settings:
- **`DEPLOY_SSH_KEY`**: Your SSH private key (the one whose public key is in `~ubuntu/.ssh/authorized_keys` on 3.93.19.170)

---

## 8. Access the App

- **Frontend**: http://3.93.19.170
- **Backend API**: http://3.93.19.170/api (via Nginx) or http://3.93.19.170:5000/api (direct)
- **Health check**: http://3.93.19.170:5000/api/health
