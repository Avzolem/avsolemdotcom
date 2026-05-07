#!/usr/bin/env node
// One-shot seeder for the env_vault Mongo collection.
// Walks /home/avsolem/sites/* and the cwd, reads .env* files, encrypts values,
// and inserts them into the `env_vault` collection. Idempotent: skips
// (project, source, name) tuples that already exist.
//
// Usage: node scripts/seed-env-vault.mjs

import { MongoClient } from 'mongodb';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createCipheriv, randomBytes } from 'node:crypto';

const SITES_ROOT = '/home/avsolem/sites';
const SELF_PROJECT = '/home/avsolem/avsolemdotcom';
const ENV_FILES = ['.env', '.env.local', '.env.production', '.env.development'];
const ALGO = 'aes-256-gcm';
const IV_LEN = 12;

function loadEnvFile(path) {
  for (const f of ['.env.local', '.env']) {
    const p = join(SELF_PROJECT, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
      }
    }
  }
}
loadEnvFile();

const masterKeyRaw = process.env.ENV_VAULT_MASTER_KEY;
if (!masterKeyRaw) {
  console.error('ERROR: ENV_VAULT_MASTER_KEY not set in .env.local');
  process.exit(1);
}
const masterKey = Buffer.from(masterKeyRaw, 'base64');
if (masterKey.length !== 32) {
  console.error(`ERROR: ENV_VAULT_MASTER_KEY must decode to 32 bytes, got ${masterKey.length}`);
  process.exit(1);
}

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
if (!mongoUri) {
  console.error('ERROR: MONGODB_URI not set');
  process.exit(1);
}

function encrypt(plaintext) {
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, masterKey, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
}

// Parse a .env-style file. Handles:
//  - lines like KEY=value
//  - quoted values (single, double)
//  - inline comments NOT supported (rare in .env, risk of clobbering URLs)
//  - lines starting with # are comments
//  - empty lines skipped
//  - multi-line values NOT supported (rare; will only capture first line)
function parseEnvFile(content) {
  const out = [];
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (!/^[A-Z0-9_]+$/i.test(key)) continue;
    // Strip surrounding quotes if matched
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!value) continue; // skip empty
    out.push({ name: key, value });
  }
  return out;
}

function listProjects() {
  const projects = [];
  // Self
  projects.push({ name: basename(SELF_PROJECT), path: SELF_PROJECT });
  // Sites
  if (existsSync(SITES_ROOT)) {
    for (const entry of readdirSync(SITES_ROOT)) {
      const full = join(SITES_ROOT, entry);
      try {
        if (statSync(full).isDirectory()) {
          projects.push({ name: entry, path: full });
        }
      } catch {
        // permission or stat errors — skip
      }
    }
  }
  return projects;
}

async function main() {
  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db('yugioh');
  const col = db.collection('env_vault');
  await col.createIndex({ project: 1, name: 1, source: 1 });
  await col.createIndex({ project: 1 });

  const projects = listProjects();
  let totalScanned = 0;
  let totalInserted = 0;
  let totalSkipped = 0;
  const perProject = [];

  for (const proj of projects) {
    let inserted = 0;
    let skipped = 0;
    for (const file of ENV_FILES) {
      const path = join(proj.path, file);
      if (!existsSync(path)) continue;
      let content;
      try {
        content = readFileSync(path, 'utf8');
      } catch {
        continue;
      }
      const vars = parseEnvFile(content);
      for (const { name, value } of vars) {
        totalScanned++;
        const existing = await col.findOne({ project: proj.name, source: file, name });
        if (existing) {
          skipped++;
          totalSkipped++;
          continue;
        }
        const now = new Date();
        await col.insertOne({
          project: proj.name,
          source: file,
          name,
          encryptedValue: encrypt(value),
          createdAt: now,
          updatedAt: now,
        });
        inserted++;
        totalInserted++;
      }
    }
    if (inserted + skipped > 0) {
      perProject.push({ project: proj.name, inserted, skipped });
    }
  }

  console.log('\n=== Seed summary ===');
  console.log(`Projects scanned: ${projects.length}`);
  console.log(`Variables scanned: ${totalScanned}`);
  console.log(`Inserted: ${totalInserted}`);
  console.log(`Skipped (already exist): ${totalSkipped}\n`);
  console.log('Per project:');
  for (const p of perProject) {
    console.log(`  ${p.project.padEnd(32)} +${p.inserted}  (skipped ${p.skipped})`);
  }
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
