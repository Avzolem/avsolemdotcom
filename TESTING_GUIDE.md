# 🧪 Guía de Pruebas - Yu-Gi-Oh! Manager

Este documento detalla cómo probar todas las funcionalidades implementadas en el sistema.

---

## 🔍 1. BÚSQUEDA Y FILTROS AVANZADOS

### Búsqueda Básica
1. Navega a `http://localhost:3001/yugioh`
2. Escribe en el campo de búsqueda: "Dark Magician"
3. Espera 500ms (debounce)
4. **Resultado esperado:** Lista de cartas relacionadas con Dark Magician

### Filtros Avanzados
1. Click en el botón "⚙️ Filtros Avanzados"
2. **Prueba 1 - Filtro por Tipo:**
   - Selecciona "Effect Monster" en Tipo de Carta
   - Click "Aplicar Filtros"
   - **Resultado:** Solo monstruos de efecto

3. **Prueba 2 - Filtro por Atributo:**
   - Selecciona "DARK" en Atributo
   - Click "Aplicar Filtros"
   - **Resultado:** Solo monstruos DARK

4. **Prueba 3 - Rangos de ATK:**
   - ATK Mínimo: 2500
   - ATK Máximo: 3000
   - Click "Aplicar Filtros"
   - **Resultado:** Solo cartas con ATK entre 2500-3000

5. **Prueba 4 - Combinación:**
   - Búsqueda: "Dragon"
   - Tipo: "Effect Monster"
   - Atributo: "LIGHT"
   - Click "Aplicar Filtros"
   - **Resultado:** Dragons LIGHT de efecto

6. **Prueba 5 - Limpiar filtros:**
   - Click "Limpiar"
   - **Resultado:** Todos los filtros reseteados

---

## 🔐 2. SISTEMA DE AUTENTICACIÓN

### Login de Admin
1. En el header, click en "🔐 Acceso Admin"
2. **Verificar:** Modal se abre con formulario de contraseña
3. **Verificar console:** Debe aparecer "Login button clicked"
4. Ingresa la contraseña (ver `.env`)
5. Click "Ingresar"
6. **Resultado esperado:**
   - Modal se cierra
   - Badge "✓ Admin" aparece en header
   - Botón cambia a "Cerrar Sesión"
   - Cookie `yugioh_auth` se establece (ver DevTools → Application → Cookies)

### Logout
1. Click en "Cerrar Sesión"
2. **Resultado:** Badge desaparece, botón vuelve a "🔐 Acceso Admin"

---

## 📥 3. AGREGAR CARTAS Y ALMACENAMIENTO LOCAL DE IMÁGENES

### Agregar Carta a Lista (Requiere autenticación)
1. Login como admin
2. Busca "Blue-Eyes White Dragon"
3. Localiza la primera carta en resultados
4. Click "+ Colección"
5. **Verificar en consola del servidor:**
   - Debe aparecer request a `/api/yugioh/download-image`
   - Debe aparecer "Downloading image..."
6. **Verificar en filesystem:**
   ```bash
   ls -la public/images/yugioh/cards/
   ```
   - Debe aparecer archivo: `89631139.jpg` (o similar)
7. Navega a `/yugioh/coleccion`
8. **Verificar:** Carta aparece en la lista
9. **Verificar DevTools → Network:**
   - La imagen se carga desde `/images/yugioh/cards/...` (local)
   - NO desde `images.ygoprodeck.com` (remoto)

---

## 📊 4. ESTADÍSTICAS DE PRECIOS

### Ver Estadísticas
1. Navega a `/yugioh/coleccion` (debe tener al menos 5 cartas)
2. Scroll hacia abajo
3. **Verificar panel "📊 Estadísticas de Precios":**
   - Valor Total
   - Precio Promedio
   - Carta Más Cara (con nombre)
   - Carta Más Barata (con nombre)
   - Gráfica de distribución de precios (5 barras)
   - Contador de cartas por rango

### Validar Cálculos
1. Toma nota del "Valor Total"
2. Suma manualmente: (precio × cantidad) de cada carta
3. **Verificar:** Los totales coinciden

---

## 📤 5. EXPORT A CSV

### Exportar a CSV
1. En cualquier lista con cartas (`/yugioh/coleccion`, `/venta`, `/wishlist`)
2. Click "📊 Exportar CSV"
3. **Verificar:**
   - Archivo se descarga: `[nombre-lista]-[fecha].csv`
   - Abre en Excel o Google Sheets
   - Columnas: Card ID, Card Name, Quantity, Price, Added Date, Notes
   - Fila final con TOTALES
4. **Validar:**
   - Total de cantidades correcto
   - Total de valor correcto

---

## 📄 6. EXPORT A PDF

### Exportar a PDF
1. En cualquier lista con cartas
2. Click "📄 Exportar PDF"
3. **Verificar:**
   - Se abre nueva ventana con vista previa
   - Header con título y fecha
   - Resumen con estadísticas (3 cards: Total Cartas, Cantidad Total, Valor Total)
   - Tabla completa con todas las cartas
   - Footer con información del sistema
4. **Opciones:**
   - Click "Imprimir" o Ctrl+P
   - "Guardar como PDF"
   - **Verificar:** PDF se genera correctamente

---

## 🔗 7. COMPARTIR LISTAS

### Generar Link de Compartir (Requiere autenticación)
1. Login como admin
2. Navega a lista con cartas
3. Click "🔗 Compartir"
4. **Verificar modal:**
   - Título: "Compartir [Nombre Lista]"
   - Descripción: "...expira en 7 días"
   - URL generada: `http://localhost:3001/yugioh/shared/[token]`
   - Botón "Copiar"
5. Click "Copiar"
6. **Verificar:** Botón cambia a "✓ Copiado" por 2 segundos
7. Copia la URL

### Ver Lista Compartida (Modo Incógnito recomendado)
1. Abre la URL copiada en navegador incógnito o cierra sesión
2. **Verificar:**
   - Badge "🔗 Vista Pública"
   - Título de la lista
   - Badges con contadores y fecha de expiración
   - Todas las cartas visibles
   - NO hay botones de edición (solo lectura)
   - Footer con link a Yu-Gi-Oh! Manager
3. **Verificar en servidor (consola):**
   - Request GET a `/api/yugioh/share?token=[token]`

### Probar Link Expirado
1. En `/api/yugioh/share/route.ts` temporalmente cambia:
   ```typescript
   expiresInDays = 7 // → expiresInDays = 0
   ```
2. Genera nuevo link
3. Espera 1 segundo
4. Intenta acceder al link
5. **Resultado:** Error 410 "Share link has expired"

---

## 📈 8. MONITOREO DE RATE LIMITING

### Ver Logs de Rate Limiting
1. Abre terminal con logs del servidor
2. Realiza varias búsquedas de cartas
3. Espera 1 minuto
4. **Verificar en consola del servidor:**
   ```
   [YGOProDeck API] Rate Limiting Stats: {
     totalRequests: 15,
     queuedRequests: 0,
     averageRequestsPerMinute: 15,
     queueSize: 0
   }
   ```

### Probar Queue de Throttling
1. En consola del navegador, ejecuta:
   ```javascript
   // Hacer 30 requests simultáneos
   for(let i = 0; i < 30; i++) {
     fetch('/api/yugioh/search?name=dragon');
   }
   ```
2. **Verificar en servidor:**
   - Requests se procesan con delay de ~67ms
   - Warning si queue > 20: `[YGOProDeck API] Large request queue detected`

---

## 💾 9. BACKUP DE MONGODB

### Crear Backup Manual
```bash
node scripts/backup-mongodb.mjs
```

**Verificar:**
- Mensaje: "📦 Starting MongoDB backup..."
- Directorio creado: `backups/mongodb/backup-[timestamp]/`
- Mensaje: "✓ Backup completed successfully"
- Tamaño del backup mostrado
- Solo mantiene últimos 7 backups

### Listar Backups
```bash
node scripts/restore-mongodb.mjs
```

**Verificar:**
- Lista todos los backups con fechas

### Restaurar Backup
```bash
node scripts/restore-mongodb.mjs backup-2025-11-19T10-30-00-000Z
```

**Verificar:**
- Warning: "⚠️ WARNING: This will DROP existing data..."
- Espera 5 segundos
- Mensaje: "✓ Restore completed successfully"

---

## 🐛 10. VERIFICACIÓN DE ERRORES CORREGIDOS

### Error de Hidratación
1. Abre DevTools → Console
2. Navega a `/yugioh`
3. **Verificar:** NO hay warnings de hidratación sobre `data-protonpass-form`

### Error de justifyContent
1. DevTools → Console
2. Navega a `/yugioh/wishlist`
3. **Verificar:** NO hay warnings sobre prop `justifyContent`

### Botón de Admin
1. Click en "🔐 Acceso Admin"
2. **Verificar console:** "Login button clicked"
3. **Verificar:** Modal se abre correctamente
4. Modal tiene z-index alto (visible sobre todo)

---

## ✅ CHECKLIST COMPLETO DE FUNCIONALIDADES

### Búsqueda y Filtros
- [ ] Búsqueda por nombre funciona
- [ ] Debounce de 500ms funciona
- [ ] Filtros avanzados abren/cierran
- [ ] Filtro por tipo funciona
- [ ] Filtro por atributo funciona
- [ ] Filtro por nivel funciona
- [ ] Filtros de ATK/DEF funcionan
- [ ] Limpiar filtros funciona
- [ ] Contador de filtros activos aparece

### Autenticación
- [ ] Botón de login abre modal
- [ ] Login con contraseña correcta funciona
- [ ] Login con contraseña incorrecta muestra error
- [ ] Cookie se establece correctamente
- [ ] Logout funciona
- [ ] Estado persiste al recargar página

### Gestión de Listas
- [ ] Agregar carta a colección funciona
- [ ] Agregar carta a venta funciona
- [ ] Agregar carta a wishlist funciona
- [ ] Imagen se descarga localmente
- [ ] Imagen local se usa en lista
- [ ] Modificar cantidad funciona
- [ ] Eliminar carta funciona

### Estadísticas
- [ ] Panel de estadísticas se muestra
- [ ] Valor total correcto
- [ ] Precio promedio correcto
- [ ] Carta más cara correcta
- [ ] Carta más barata correcta
- [ ] Gráfica de distribución se muestra
- [ ] Contadores por rango correctos

### Export
- [ ] Export a CSV funciona
- [ ] CSV contiene todos los datos
- [ ] CSV abre en Excel
- [ ] Export a PDF funciona
- [ ] PDF tiene diseño correcto
- [ ] PDF se puede imprimir/guardar

### Compartir
- [ ] Generar link funciona
- [ ] Link se copia al clipboard
- [ ] Vista pública funciona sin auth
- [ ] Vista pública muestra todas las cartas
- [ ] Vista pública es solo lectura
- [ ] Links expirados muestran error

### Rate Limiting
- [ ] Logs aparecen cada minuto
- [ ] Stats son correctas
- [ ] Queue funciona correctamente
- [ ] Warning de queue grande aparece

### Backup
- [ ] Backup manual funciona
- [ ] Directorio se crea correctamente
- [ ] Mantiene solo 7 backups
- [ ] Listar backups funciona
- [ ] Restore funciona

---

## 🎯 RESULTADO FINAL ESPERADO

**Todas las casillas marcadas** = Sistema completamente funcional y listo para producción

**Errores conocidos resueltos:**
- ✅ Error de hidratación
- ✅ Error de justifyContent
- ✅ Botón de admin ahora funciona
- ✅ Rate limiting implementado
- ✅ Imágenes locales funcionando

**URLs de testing:**
- Búsqueda: http://localhost:3001/yugioh
- Colección: http://localhost:3001/yugioh/coleccion
- En Venta: http://localhost:3001/yugioh/venta
- Wishlist: http://localhost:3001/yugioh/wishlist
