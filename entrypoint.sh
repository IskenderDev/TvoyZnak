#!/bin/sh
set -e

mkdir -p /usr/share/nginx/html/config

cat > /usr/share/nginx/html/config/env.js <<EOF
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL:-https://api.example.com}",
  APP_ENV: "${APP_ENV:-production}"
};
EOF

exec "$@"
