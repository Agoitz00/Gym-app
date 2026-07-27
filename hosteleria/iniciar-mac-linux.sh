#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "  ============================================"
echo "   Arrancando TPV Hosteleria..."
echo "   Abre el navegador en: http://localhost:3000"
echo "  ============================================"
echo ""
node --experimental-sqlite server.js
