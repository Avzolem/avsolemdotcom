# Plantilla de Actualizaciones MDX para Proyectos

Una vez que captures los screenshots usando los scripts proporcionados, actualiza cada archivo MDX reemplazando la sección de `images:` con estas nuevas rutas:

## 1. EzTicket - Web3 Ticketing Platform
**Archivo:** `/src/app/work/projects/ezticket-web3-platform.mdx`

```yaml
images:
  - "/images/projects/ezticket/ezticket-screenshot-1.png"
  - "/images/projects/ezticket/ezticket-screenshot-2.png"
  - "/images/projects/ezticket/ezticket-screenshot-3.png"
  - "/images/projects/ezticket/ezticket-screenshot-4.png"
  - "/images/projects/ezticket/ezticket-screenshot-5.png"
```

## 2. Comimake - Artists & Designers Marketplace
**Archivo:** `/src/app/work/projects/comimake-marketplace.mdx`

```yaml
images:
  - "/images/projects/comimake/comimake-screenshot-1.png"
  - "/images/projects/comimake/comimake-screenshot-2.png"
  - "/images/projects/comimake/comimake-screenshot-3.png"
  - "/images/projects/comimake/comimake-screenshot-4.png"
  - "/images/projects/comimake/comimake-screenshot-5.png"
```

## 3. RentyGo - AI-Powered Car Rental Platform
**Archivo:** `/src/app/work/projects/rentygo-car-rental.mdx`

```yaml
images:
  - "/images/projects/rentygo/rentygo-screenshot-1.png"
  - "/images/projects/rentygo/rentygo-screenshot-2.png"
  - "/images/projects/rentygo/rentygo-screenshot-3.png"
  - "/images/projects/rentygo/rentygo-screenshot-4.png"
  - "/images/projects/rentygo/rentygo-screenshot-5.png"
```

## 4. CoinChaShop - Web3 Airdrop Platform
**Archivo:** `/src/app/work/projects/coinchashop-web3-airdrop.mdx`

```yaml
images:
  - "/images/projects/coinchashop/coinchashop-screenshot-1.png"
  - "/images/projects/coinchashop/coinchashop-screenshot-2.png"
  - "/images/projects/coinchashop/coinchashop-screenshot-3.png"
  - "/images/projects/coinchashop/coinchashop-screenshot-4.png"
  - "/images/projects/coinchashop/coinchashop-screenshot-5.png"
```

## 5. AuCoin - Web3 Academic Certificates
**Archivo:** `/src/app/work/projects/aucoin-web3-certificates.mdx`

```yaml
images:
  - "/images/projects/aucoin/aucoin-screenshot-1.png"
  - "/images/projects/aucoin/aucoin-screenshot-2.png"
  - "/images/projects/aucoin/aucoin-screenshot-3.png"
  - "/images/projects/aucoin/aucoin-screenshot-4.png"
  - "/images/projects/aucoin/aucoin-screenshot-5.png"
```

## 6. MenonitApp - Community Marketplace
**Archivo:** `/src/app/work/projects/menonitapp-marketplace.mdx`

```yaml
images:
  - "/images/projects/menonitapp/menonitapp-screenshot-1.png"
  - "/images/projects/menonitapp/menonitapp-screenshot-2.png"
  - "/images/projects/menonitapp/menonitapp-screenshot-3.png"
  - "/images/projects/menonitapp/menonitapp-screenshot-4.png"
  - "/images/projects/menonitapp/menonitapp-screenshot-5.png"
```

## Instrucciones de Uso:

### Opción 1: Usar Puppeteer (Node.js)
```bash
# Instalar dependencias
npm install puppeteer

# Ejecutar el script
node capture-screenshots.js
```

### Opción 2: Usar capture-website-cli
```bash
# Instalar la herramienta globalmente
npm install -g capture-website-cli

# Ejecutar el script bash
./capture-screenshots.sh
```

### Opción 3: Captura Manual
1. Visita cada sitio web
2. Captura 5 screenshots por proyecto:
   - Homepage completa
   - Sección hero/principal
   - Características principales
   - Vista móvil
   - Sección específica del proyecto

### Después de capturar los screenshots:
1. Verifica que las imágenes estén en las carpetas correctas
2. Actualiza cada archivo MDX con las nuevas rutas de imágenes
3. Opcionalmente, optimiza las imágenes con herramientas como:
   - `npx @squoosh/cli`
   - `imageoptim`
   - `tinypng`

## Nota sobre el MediaCarousel Component:
El componente MediaCarousel ya está preparado para mostrar estas imágenes automáticamente en la página de cada proyecto. No requiere cambios adicionales.