#!/usr/bin/env node

/**
 * Script to create a properly configured preview secret with studio origin
 *
 * Usage: node scripts/create-proper-preview-secret.js
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import crypto from 'crypto';

config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function createProperSecret() {
  console.log('🔐 Creating properly configured preview secret...\n');
  console.log('Project ID:', client.config().projectId);
  console.log('Dataset:', client.config().dataset);
  console.log('');

  if (!client.config().token) {
    console.error('❌ Error: SANITY_API_TOKEN is required (needs Editor permissions)');
    process.exit(1);
  }

  try {
    // Generate a random secret
    const secret = crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '');

    console.log('Generated secret:', secret);
    console.log('');

    // Delete all existing secrets first
    console.log('🗑️  Deleting existing secrets...');
    const existingSecrets = await client.fetch('*[_type == "sanity.previewUrlSecret"]');

    for (const existing of existingSecrets) {
      console.log('  Deleting:', existing._id);
      await client.delete(existing._id);
    }

    if (existingSecrets.length > 0) {
      console.log(`✅ Deleted ${existingSecrets.length} old secret(s)`);
    }
    console.log('');

    // Create new secret document
    console.log('📝 Creating new secret document...');

    const secretDoc = await client.create({
      _type: 'sanity.previewUrlSecret',
      secret: secret,
    });

    console.log('✅ Secret created!');
    console.log('');
    console.log('Document ID:', secretDoc._id);
    console.log('Secret:', secret);
    console.log('');

    console.log('📋 Use this preview URL:');
    console.log('');
    console.log(`http://localhost:3000/api/preview?secret=${secret}&slug=/`);
    console.log('');

    console.log('💡 Alternative: Access from Sanity Studio');
    console.log('');
    console.log('1. Open your Sanity Studio (http://localhost:3333)');
    console.log('2. Open a document');
    console.log('3. Click the "Presentation" tab or eye icon (👁️)');
    console.log('4. Your preview will open automatically');
    console.log('');
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.statusCode === 401) {
      console.error('\nAuthentication failed. Check your SANITY_READ_TOKEN.');
    } else if (error.statusCode === 403) {
      console.error('\nPermission denied. Your token needs Editor permissions.');
    }

    process.exit(1);
  }
}

createProperSecret();
