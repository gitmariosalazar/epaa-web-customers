#!/bin/bash

# ============================================================
# Script de despliegue automático — EPAA Web Customers (Producción)
# Portal del cliente: portal ciudadano de la EPAA.
#
# Diferencias respecto al portal de empresa (epaa-web):
#   • Proyecto:   epaa-web-customers
#   • Puerto:     8080  (el portal de empresa usa el 80)
#   • Imagen:     epaa-web-customers-prod
#   • Red Docker: epaa-customers-network (aislada del portal empresa)
# ============================================================

set -e   # Detener si ocurre cualquier error
set -u   # Tratar variables no definidas como error
set -o pipefail  # Propagar errores en tuberías

# ── Colores ──────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo -e "${CYAN}${BOLD}  🌐 EPAA Web Customers — Despliegue Producción            ${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo ""

# ── 1. Verificar archivo .env ─────────────────────────────────
echo -e "${YELLOW}[1/5]${NC} Verificando archivo de entorno..."
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: No se encontró el archivo .env${NC}"
    echo "   Crea el archivo .env con las variables necesarias:"
    echo "   VITE_API_URL=https://api.epaa.gob.ec"
    echo "   VITE_HTTP_CLIENT=axios"
    exit 1
fi
echo -e "${GREEN}   ✓ Archivo .env encontrado${NC}"

# ── 2. Verificar Docker ────────────────────────────────────────
echo -e "${YELLOW}[2/5]${NC} Verificando Docker..."
if ! command -v docker &>/dev/null; then
    echo -e "${RED}❌ Error: Docker no está instalado o no está en el PATH.${NC}"
    exit 1
fi
if ! docker info &>/dev/null; then
    echo -e "${RED}❌ Error: Docker no está corriendo. Inicia el servicio Docker primero.${NC}"
    exit 1
fi
echo -e "${GREEN}   ✓ Docker disponible y corriendo${NC}"

# ── 3. (Opcional) Pull de código fuente ────────────────────────
# Descomenta si quieres que el script actualice el código antes de deployar:
# echo -e "${YELLOW}[3/5]${NC} Actualizando código desde el repositorio..."
# git pull origin main
# echo -e "${GREEN}   ✓ Código actualizado${NC}"

echo -e "${YELLOW}[3/5]${NC} Actualizando código... ${CYAN}(paso omitido — usa git pull manualmente si lo necesitas)${NC}"

# ── 4. Build y levantar contenedores ───────────────────────────
echo -e "${YELLOW}[4/5]${NC} Construyendo imagen y levantando contenedor..."
echo "   → Usando: docker-compose.prod.yml"
echo "   → Proyecto Docker: epaa-customers-prod"
echo "   → Puerto: 8080 → 80 (interno nginx)"
echo ""

docker compose \
    -f docker-compose.prod.yml \
    -p epaa-customers-prod \
    up -d --build

echo -e "${GREEN}   ✓ Contenedor levantado correctamente${NC}"

# ── 5. Limpieza de imágenes antiguas ────────────────────────────
echo -e "${YELLOW}[5/5]${NC} Limpiando imágenes sin tag (dangling images)..."
docker image prune -f
echo -e "${GREEN}   ✓ Limpieza completada${NC}"

# ── Resumen final ────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo -e "${GREEN}${BOLD}  ✅ Despliegue completado exitosamente${NC}"
echo -e "${CYAN}${BOLD}============================================================${NC}"
echo ""
echo -e "  🌐 Portal del Cliente: ${BOLD}http://TU_SERVIDOR:8080${NC}"
echo -e "  🏢 Portal de Empresa:  ${BOLD}http://TU_SERVIDOR:80${NC}  (si está desplegado)"
echo ""
echo -e "  Comandos útiles:"
echo -e "    ${BOLD}docker ps${NC}                                  → Ver contenedores activos"
echo -e "    ${BOLD}docker logs -f epaa-web-customers-prod${NC}     → Ver logs en tiempo real"
echo -e "    ${BOLD}docker compose -f docker-compose.prod.yml -p epaa-customers-prod down${NC}  → Detener"
echo ""
