# Scripts de Mantenimiento - Yu-Gi-Oh! Manager

Este directorio contiene scripts para mantenimiento y backup del sistema.

## 📦 Backup de MongoDB

### Backup Manual

```bash
node scripts/backup-mongodb.mjs
```

Crea un backup completo de la base de datos MongoDB en `backups/mongodb/backup-[timestamp]`.

**Características:**
- Mantiene automáticamente los últimos 7 backups
- Elimina backups antiguos
- Muestra el tamaño del backup creado
- Logs detallados del proceso

### Automatizar Backups con Cron

Para hacer backups automáticos diarios a las 2 AM:

```bash
crontab -e
```

Agregar esta línea:

```
0 2 * * * cd /ruta/completa/al/proyecto && node scripts/backup-mongodb.mjs >> logs/backup.log 2>&1
```

### Backup Semanal (Domingos a las 3 AM)

```
0 3 * * 0 cd /ruta/completa/al/proyecto && node scripts/backup-mongodb.mjs >> logs/backup.log 2>&1
```

---

## 🔄 Restore de MongoDB

### Listar Backups Disponibles

```bash
node scripts/restore-mongodb.mjs
```

Muestra todos los backups disponibles con sus fechas de creación.

### Restaurar un Backup Específico

```bash
node scripts/restore-mongodb.mjs backup-2025-11-19T10-30-00-000Z
```

**⚠️ ADVERTENCIA:** El restore eliminará todos los datos actuales y los reemplazará con el backup seleccionado.

**Características:**
- Espera 5 segundos antes de ejecutar (tiempo para cancelar con Ctrl+C)
- Logs detallados del proceso
- Verifica que el backup exista antes de intentar restaurar

---

## 📋 Requisitos

### MongoDB Tools

Los scripts requieren que `mongodump` y `mongorestore` estén instalados:

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-database-tools
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mongodb-database-tools
```

**Windows:**
Descargar desde: https://www.mongodb.com/try/download/database-tools

### Variables de Entorno

Los scripts requieren que `MONGODB_URI` esté configurado en `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/yugioh-manager
```

---

## 📁 Estructura de Backups

```
backups/
└── mongodb/
    ├── backup-2025-11-19T10-30-00-000Z/
    │   └── yugioh-manager/
    │       ├── yugioh_lists.bson
    │       └── yugioh_lists.metadata.json
    ├── backup-2025-11-18T10-30-00-000Z/
    └── ...
```

---

## 🔒 Seguridad

- **NO** subas la carpeta `backups/` a git (ya está en .gitignore)
- Los backups contienen toda la información de tus listas de cartas
- Asegúrate de que los backups estén en un lugar seguro
- Considera encriptar los backups para producción

---

## 🛠️ Troubleshooting

### Error: "mongodump command not found"

Instala MongoDB Database Tools siguiendo las instrucciones arriba.

### Error: "MONGODB_URI environment variable is not set"

Asegúrate de que `.env` contenga `MONGODB_URI` y que estés ejecutando el script desde el directorio raíz del proyecto.

### Error: "Could not parse database name"

Verifica que tu `MONGODB_URI` tenga el formato correcto:
```
mongodb+srv://user:pass@cluster.mongodb.net/database-name
```

---

## 💡 Mejores Prácticas

1. **Backups Regulares:** Configura backups automáticos diarios
2. **Múltiples Ubicaciones:** Guarda copias de backups críticos en múltiples lugares
3. **Prueba Restores:** Prueba periódicamente el proceso de restore
4. **Monitoreo:** Revisa los logs de backup regularmente
5. **Retención:** Ajusta `MAX_BACKUPS` según tus necesidades de almacenamiento

---

## 📞 Soporte

Si encuentras problemas con los scripts de backup:

1. Verifica los logs en `console.log`
2. Asegúrate de tener los permisos correctos
3. Verifica la conexión a MongoDB
4. Revisa que haya espacio en disco suficiente
