#!/usr/bin/env node

/**
 * Script to create a preview secret in your Sanity dataset
 *
 * Usage:
 *   node scripts/create-preview-secret.js [secret]
 *
 * If no secret is provided, it will use the default one.
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.argv[2] || 'preview-secret-santan-2024-asdazcxhuialsdkcv';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function createPreviewSecret() {
  console.log('Creating preview secret in Sanity...');
  console.log('Project ID:', client.config().projectId);
  console.log('Dataset:', client.config().dataset);
  console.log('Secret:', SECRET);

  if (!client.config().token) {
    console.error('❌ Error: SANITY_API_TOKEN is required');
    console.error('Get a token with "Editor" permissions from:');
    console.error(`https://sanity.io/manage/project/${client.config().projectId}/api#tokens`);
    process.exit(1);
  }

  try {
    // Check if secret already exists
    const existing = await client.fetch('*[_type == "sanity.previewUrlSecret"][0]');

    if (existing) {
      console.log('\n⚠️  Preview secret already exists!');
      console.log('Existing secret:', existing.secret);

      if (existing.secret === SECRET) {
        console.log('✅ Secret matches! No update needed.');
        process.exit(0);
      }

      console.log('\nDo you want to update it? (This will affect all preview links)');
      console.log('To update, delete the existing document and run this script again.');
      console.log(`Document ID: ${existing._id}`);
      process.exit(0);
    }

    // Create the secret
    const result = await client.create({
      _type: 'sanity.previewUrlSecret',
      secret: SECRET,
    });

    console.log('\n✅ Success! Preview secret created.');
    console.log('Document ID:', result._id);
    console.log('\nYou can now use this preview URL:');
    console.log(`http://localhost:3000/api/preview?secret=${SECRET}&slug=/`);
  } catch (error) {
    console.error('\n❌ Error creating preview secret:', error.message);

    if (error.statusCode === 401) {
      console.error('\nAuthentication failed. Make sure your SANITY_READ_TOKEN has "Editor" permissions.');
    } else if (error.statusCode === 403) {
      console.error('\nPermission denied. Your token needs "Editor" or "Administrator" permissions.');
    }

    process.exit(1);
  }
}

createPreviewSecret();
