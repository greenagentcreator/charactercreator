#!/bin/bash
# Dieses Skript wechselt in das Verzeichnis, in dem es selbst liegt,
# und startet dann einen einfachen Python Webserver.

cd "$(dirname "$0")"

echo "========================================"
echo "Lokaler Entwicklungsserver wird gestartet..."
echo "Projektordner: $(pwd)"
echo "Adresse: http://localhost:8000"
echo "========================================"
echo "Drücke Ctrl+C im Terminal, um den Server zu beenden."
echo ""

python3 -m http.server 8000