#!/bin/sh
set -e

# Start Express API in background
node src/server.js &

# Start Nuxt SSR preview in foreground
npx nuxt preview --cwd ./client --port 5000 --host 0.0.0.0
