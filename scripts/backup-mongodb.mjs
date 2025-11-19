#!/usr/bin/env node
/**
 * MongoDB Backup Script for Yu-Gi-Oh! Manager
 *
 * Usage:
 *   node scripts/backup-mongodb.mjs
 *
 * Schedule with cron (daily at 2 AM):
 *   0 2 * * * cd /path/to/project && node scripts/backup-mongodb.mjs
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKUP_DIR = path.join(__dirname, '../backups/mongodb');
const MAX_BACKUPS = 7; // Keep last 7 backups
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Execute shell command as promise
 */
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }
      resolve(stdout);
    });
  });
}

/**
 * Create backup directory if it doesn't exist
 */
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    console.log(`✓ Created backup directory: ${BACKUP_DIR}`);
  }
}

/**
 * Parse MongoDB connection string to get database name
 */
function parseMongoDB_URI(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  // Extract database name from URI
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  if (!match) {
    throw new Error('Could not parse database name from MONGODB_URI');
  }

  return {
    uri,
    dbName: match[1],
  };
}

/**
 * Create backup using mongodump
 */
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

  const { uri, dbName } = parseMongoDB_URI(MONGODB_URI);

  console.log(`\n📦 Starting MongoDB backup...`);
  console.log(`Database: ${dbName}`);
  console.log(`Target: ${backupPath}\n`);

  try {
    // Use mongodump to create backup
    const command = `mongodump --uri="${uri}" --out="${backupPath}"`;
    await execPromise(command);

    console.log(`✓ Backup completed successfully`);

    // Get backup size
    const stats = await fs.stat(backupPath);
    console.log(`✓ Backup size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    return backupPath;
  } catch (error) {
    console.error(`✗ Backup failed:`, error.stderr || error.error?.message);
    throw error;
  }
}

/**
 * Clean old backups, keeping only the most recent MAX_BACKUPS
 */
async function cleanOldBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const backupDirs = files.filter(f => f.startsWith('backup-'));

    if (backupDirs.length <= MAX_BACKUPS) {
      return;
    }

    // Sort by creation time (oldest first)
    const backupsWithTime = await Promise.all(
      backupDirs.map(async (dir) => {
        const fullPath = path.join(BACKUP_DIR, dir);
        const stats = await fs.stat(fullPath);
        return { dir, time: stats.birthtimeMs, path: fullPath };
      })
    );

    backupsWithTime.sort((a, b) => a.time - b.time);

    // Remove oldest backups
    const toRemove = backupsWithTime.slice(0, backupsWithTime.length - MAX_BACKUPS);

    for (const backup of toRemove) {
      await fs.rm(backup.path, { recursive: true, force: true });
      console.log(`✓ Removed old backup: ${backup.dir}`);
    }

    console.log(`\n✓ Cleanup complete. Keeping ${MAX_BACKUPS} most recent backups.`);
  } catch (error) {
    console.error('✗ Error cleaning old backups:', error.message);
  }
}

/**
 * Main backup function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Yu-Gi-Oh! Manager - MongoDB Backup Script');
  console.log('='.repeat(60));

  try {
    // Ensure backup directory exists
    await ensureBackupDir();

    // Create backup
    await createBackup();

    // Clean old backups
    await cleanOldBackups();

    console.log('\n' + '='.repeat(60));
    console.log('✓ Backup process completed successfully');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Backup process failed');
    console.error('='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Run if called directly
main();
