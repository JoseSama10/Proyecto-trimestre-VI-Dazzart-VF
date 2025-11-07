#!/bin/bash

# Actualizar el sistema
sudo apt update
sudo apt upgrade -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar Certbot y el plugin de Nginx
sudo apt install certbot python3-certbot-nginx -y

# Configurar Nginx
sudo tee /etc/nginx/sites-available/dazzart << EOF
server {
    listen 80;
    server_name ec2-13-222-164-180.compute-1.amazonaws.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/dazzart /etc/nginx/sites-enabled/

# Verificar configuración de Nginx
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Obtener certificado SSL
sudo certbot --nginx -d ec2-13-222-164-180.compute-1.amazonaws.com --non-interactive --agree-tos --email tu-email@ejemplo.com

# Configurar renovación automática
sudo certbot renew --dry-run