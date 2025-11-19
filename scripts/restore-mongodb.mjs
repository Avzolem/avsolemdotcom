#!/usr/bin/env node
/**
 * MongoDB Restore Script for Yu-Gi-Oh! Manager
 *
 * Usage:
 *   node scripts/restore-mongodb.mjs [backup-directory]
 *
 * Example:
 *   node scripts/restore-mongodb.mjs backups/mongodb/backup-2025-01-19T10-30-00-000Z
 */

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Parse MongoDB connection string
 */
function parseMongoDB_URI(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

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
 * List available backups
 */
async function listBackups() {
  const backupDir = path.join(__dirname, '../backups/mongodb');

  try {
    const files = await fs.readdir(backupDir);
    const backupDirs = files.filter(f => f.startsWith('backup-'));

    if (backupDirs.length === 0) {
      console.log('No backups found.');
      return [];
    }

    console.log('\nAvailable backups:');
    console.log('='.repeat(60));

    for (const dir of backupDirs) {
      const fullPath = path.join(backupDir, dir);
      const stats = await fs.stat(fullPath);
      const date = new Date(stats.birthtime).toLocaleString();
      console.log(`${dir}`);
      console.log(`  Created: ${date}`);
    }

    console.log('='.repeat(60) + '\n');

    return backupDirs;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No backup directory found.');
      return [];
    }
    throw error;
  }
}

/**
 * Restore backup using mongorestore
 */
async function restoreBackup(backupPath) {
  const { uri, dbName } = parseMongoDB_URI(MONGODB_URI);

  console.log(`\n📦 Starting MongoDB restore...`);
  console.log(`Database: ${dbName}`);
  console.log(`Source: ${backupPath}\n`);

  // Check if backup exists
  try {
    await fs.access(backupPath);
  } catch {
    throw new Error(`Backup directory not found: ${backupPath}`);
  }

  try {
    // Use mongorestore to restore backup
    const dbPath = path.join(backupPath, dbName);
    const command = `mongorestore --uri="${uri}" --nsInclude="${dbName}.*" --dir="${backupPath}" --drop`;

    console.log('⚠️  WARNING: This will DROP existing data and restore from backup!');
    console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    await execPromise(command);

    console.log(`✓ Restore completed successfully`);
  } catch (error) {
    console.error(`✗ Restore failed:`, error.stderr || error.error?.message);
    throw error;
  }
}

/**
 * Main restore function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Yu-Gi-Oh! Manager - MongoDB Restore Script');
  console.log('='.repeat(60));

  try {
    const backupArg = process.argv[2];

    if (!backupArg) {
      console.log('\nNo backup specified. Listing available backups:\n');
      await listBackups();
      console.log('\nUsage: node scripts/restore-mongodb.mjs [backup-directory]');
      process.exit(1);
    }

    // If relative path, resolve from backups directory
    let backupPath = backupArg;
    if (!path.isAbsolute(backupPath)) {
      backupPath = path.join(__dirname, '../backups/mongodb', backupPath);
    }

    await restoreBackup(backupPath);

    console.log('\n' + '='.repeat(60));
    console.log('✓ Restore process completed successfully');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Restore process failed:', error.message);
    console.error('='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Run if called directly
main();
