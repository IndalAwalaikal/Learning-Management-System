#!/bin/sh
set -e

echo "==> Running admin seeder..."
node seed_admin.js

echo "==> Starting server..."
exec node server.js
