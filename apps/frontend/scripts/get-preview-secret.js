#!/usr/bin/env node

/**
 * Script to fetch the preview secret from Sanity dataset
 *
 * Usage: node scripts/get-preview-secret.js
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function getPreviewSecret() {
  console.log('🔍 Fetching preview secret from Sanity...\n');
  console.log('Project ID:', client.config().projectId);
  console.log('Dataset:', client.config().dataset);
  console.log('Has token:', !!client.config().token);
  console.log('');

  if (!client.config().token) {
    console.error('❌ Error: SANITY_READ_TOKEN is required');
    console.error('Add it to your .env file or set it in environment');
    console.error('\nGet a token from:');
    console.error(`https://sanity.io/manage/project/${client.config().projectId}/api#tokens`);
    process.exit(1);
  }

  try {
    // Query for preview secret documents
    const query = '*[_type == "sanity.previewUrlSecret"] | order(_createdAt desc)';
    console.log('Running query:', query);
    console.log('');

    const allSecrets = await client.fetch(query);

    // Sort: published first, then by creation date
    const secrets = allSecrets.sort((a, b) => {
      const aIsPublished = !a._id.startsWith('drafts.');
      const bIsPublished = !b._id.startsWith('drafts.');

      if (aIsPublished && !bIsPublished) return -1;
      if (!aIsPublished && bIsPublished) return 1;

      return new Date(b._createdAt) - new Date(a._createdAt);
    });

    if (!secrets || secrets.length === 0) {
      console.log('⚠️  No preview secrets found in dataset!');
      console.log('');
      console.log("You need to create one. Here's how:");
      console.log('');
      console.log('Option 1 - Using Sanity Studio:');
      console.log('1. Open your Sanity Studio (http://localhost:3333)');
      console.log('2. Go to Vision (magnifying glass icon)');
      console.log('3. Run this mutation:');
      console.log('');
      console.log('   // Switch to "Mutate" mode first');
      console.log('   create({');
      console.log('     _type: "sanity.previewUrlSecret",');
      console.log('     secret: "your-secret-here-' + Math.random().toString(36).substring(7) + '"');
      console.log('   })');
      console.log('');
      console.log('Option 2 - Using this script:');
      console.log('   npm run create:preview-secret');
      console.log('');
      process.exit(1);
    }

    console.log(`✅ Found ${secrets.length} preview secret(s):\n`);

    secrets.forEach((secret, index) => {
      const isDraft = secret._id.startsWith('drafts.');
      console.log(`Secret #${index + 1}:${isDraft ? ' (⚠️  DRAFT)' : ''}`);
      console.log('  Document ID:', secret._id);
      console.log('  Secret:', secret.secret);
      console.log('  Created:', secret._createdAt || 'Unknown');
      console.log('  Updated:', secret._updatedAt || 'Unknown');
      console.log('');
    });

    if (secrets.length > 0) {
      const primarySecret = secrets[0].secret;
      console.log('📋 Use this preview URL:');
      console.log('');
      console.log(`http://localhost:3000/api/preview?secret=${primarySecret}&slug=/`);
      console.log('');

      if (secrets.length > 1) {
        console.log('⚠️  Warning: Multiple secrets found. Using the first one.');
        console.log('   Consider cleaning up old secrets.');
      }
    }
  } catch (error) {
    console.error('❌ Error fetching preview secret:', error.message);

    if (error.statusCode === 401) {
      console.error('\nAuthentication failed. Check your SANITY_READ_TOKEN.');
    } else if (error.statusCode === 403) {
      console.error('\nPermission denied. Your token needs read permissions.');
    } else if (error.statusCode === 404) {
      console.error('\nProject or dataset not found. Check your configuration.');
    }

    process.exit(1);
  }
}

getPreviewSecret();
