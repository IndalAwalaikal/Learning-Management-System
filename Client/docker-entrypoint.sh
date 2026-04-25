#!/bin/sh

API_URL=${VITE_API_URL:-"http://localhost:5000/api/v1"}

echo "Injecting runtime environment variables..."
echo "Setting API URL to: $API_URL"

# Search and replace the placeholder in all output CSS and JS files
find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|VITE_API_URL_PLACEHOLDER|${API_URL}|g" {} +

echo "Starting nginx..."
exec "$@"
