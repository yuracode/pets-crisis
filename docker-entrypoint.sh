#!/bin/bash
set -e

echo "=== Firebase Emulators を起動中 ==="
if [ -d "/app/data" ]; then
  firebase emulators:start \
    --project demo-pet-disaster \
    --only auth,firestore \
    --export-on-exit=/app/data \
    --import=/app/data &
else
  firebase emulators:start \
    --project demo-pet-disaster \
    --only auth,firestore \
    --export-on-exit=/app/data &
fi

echo "=== Emulator 起動待機中 (15秒) ==="
sleep 15

echo "=== Vite Dev Server を起動中 ==="
npm run dev -- --host
