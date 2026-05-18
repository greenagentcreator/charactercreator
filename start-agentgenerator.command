#!/bin/bash
# Dieses Skript wechselt in das Verzeichnis, in dem es selbst liegt,
# startet einen einfachen Python Webserver und öffnet die App im Browser.

cd "$(dirname "$0")"

PORT=8000
URL="http://localhost:${PORT}"

echo "========================================"
echo "Agent Generator wird gestartet..."
echo "Projektordner: $(pwd)"
echo "Adresse: ${URL}"
echo "========================================"
echo "Drücke Ctrl+C im Terminal, um den Server zu beenden."
echo ""

python3 -m http.server "${PORT}" &
SERVER_PID=$!

sleep 1
open "${URL}"

wait "${SERVER_PID}"
