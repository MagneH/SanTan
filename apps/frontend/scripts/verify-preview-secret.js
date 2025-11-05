#!/usr/bin/env node

/**
 * Script to verify preview secret document structure
 *
 * Usage: node scripts/verify-preview-secret.js [secret]
 */

import { createClient } from '@sanity/client';
import path from 'path';
import fs from 'fs';
import { loadPreviewEnvironment, getSanityClientConfig, ensureTokenOrExit } from './utils/previewEnv.js';

const SECRET = process.argv[2] || 'NzQwNGNlY2YyZmM2MWY5YTRlNDNlZTM5ZDJlZjNmNmI';

const { token } = loadPreviewEnvironment();
const client = createClient({ ...getSanityClientConfig(), token, useCdn: false });

ensureTokenOrExit(client.config().token, 'Secret verification');

async function verifySecret() {
  console.log('🔍 Verifying preview secret structure...\n');
  console.log('Secret to verify:', SECRET);
  console.log('Project ID:', client.config().projectId);
  console.log('Dataset:', client.config().dataset);
  console.log('');

  try {
    // Query for this specific secret
    const query = `*[_type == "sanity.previewUrlSecret" && secret == $secret][0]`;
    console.log('Running query:', query);
    console.log('Parameters:', { secret: SECRET });
    console.log('');

    const secretDoc = await client.fetch(query, { secret: SECRET });

    if (!secretDoc) {
      console.log('❌ Secret NOT found in dataset!');
      console.log('');
      console.log('Possible issues:');
      console.log("  1. Secret doesn't exist");
      console.log('  2. Secret is in draft status');
      console.log('  3. Wrong project ID or dataset');
      console.log('');
      console.log('Let me check all secrets...');
      console.log('');

      const allSecrets = await client.fetch('*[_type == "sanity.previewUrlSecret"]');
      console.log(`Found ${allSecrets.length} secret(s):`);
      allSecrets.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s._id}: ${s.secret}`);
      });

      process.exit(1);
    }

    console.log('✅ Secret found in dataset!');
    console.log('');
    console.log('Document details:');
    console.log('  _id:', secretDoc._id);
    console.log('  _type:', secretDoc._type);
    console.log('  secret:', secretDoc.secret);
    console.log('  _createdAt:', secretDoc._createdAt);
    console.log('  _updatedAt:', secretDoc._updatedAt);
    console.log('  _rev:', secretDoc._rev);
    console.log('');

    // Check if it's a draft
    if (secretDoc._id.startsWith('drafts.')) {
      console.log('⚠️  WARNING: This is a DRAFT document!');
      console.log("   Sanity's validatePreviewUrl might only check published secrets.");
      console.log('');
      console.log('   Run this to publish it:');
      console.log('   npm run cleanup:preview-secrets');
    } else {
      console.log('✅ Secret is PUBLISHED (not draft)');
    }

    console.log('');
    console.log('Full document structure:');
    console.log(JSON.stringify(secretDoc, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.statusCode === 401) {
      console.error('\nAuthentication failed. Check your token.');
    } else if (error.statusCode === 403) {
      console.error('\nPermission denied. Your token needs read permissions.');
    }

    process.exit(1);
  }
}

verifySecret();
