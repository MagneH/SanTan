#!/usr/bin/env node

/**
 * Script to clean up old preview secrets and create one published secret
 *
 * Usage: node scripts/cleanup-preview-secrets.js
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_READ_TOKEN,
  useCdn: false,
});

async function cleanupSecrets() {
  console.log('🧹 Cleaning up preview secrets...\n');
  console.log('Project ID:', client.config().projectId);
  console.log('Dataset:', client.config().dataset);
  console.log('');

  if (!client.config().token) {
    console.error('❌ Error: SANITY_API_TOKEN or SANITY_READ_TOKEN is required');
    console.error('This script needs Editor permissions to delete documents.');
    console.error('');
    console.error('Set one of these in your .env file:');
    console.error('  SANITY_API_TOKEN=your-token-with-editor-permissions');
    console.error('  (or upgrade SANITY_READ_TOKEN to have Editor permissions)');
    process.exit(1);
  }

  try {
    // Fetch all preview secrets
    const secrets = await client.fetch('*[_type == "sanity.previewUrlSecret"]');

    console.log(`Found ${secrets.length} preview secret(s)\n`);

    if (secrets.length === 0) {
      console.log('✅ No secrets to clean up');
      process.exit(0);
    }

    // Sort by creation date (newest first)
    const sortedSecrets = secrets.sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));

    const newestSecret = sortedSecrets[0];
    const oldSecrets = sortedSecrets.slice(1);

    console.log('📌 Keeping newest secret:');
    console.log('  ID:', newestSecret._id);
    console.log('  Secret:', newestSecret.secret);
    console.log('  Created:', newestSecret._createdAt);
    console.log('');

    if (oldSecrets.length > 0) {
      console.log(`🗑️  Deleting ${oldSecrets.length} old secret(s)...`);
      console.log('');

      for (const secret of oldSecrets) {
        console.log(`  Deleting: ${secret._id}`);
        await client.delete(secret._id);
      }

      console.log('');
      console.log(`✅ Deleted ${oldSecrets.length} old secret(s)`);
    } else {
      console.log('✅ No old secrets to delete');
    }

    // If the newest secret is a draft, publish it
    if (newestSecret._id.startsWith('drafts.')) {
      console.log('');
      console.log('📝 Publishing the secret...');

      const publishedId = newestSecret._id.replace('drafts.', '');

      // Create published version
      await client.createOrReplace({
        _id: publishedId,
        _type: 'sanity.previewUrlSecret',
        secret: newestSecret.secret,
      });

      // Delete draft version
      await client.delete(newestSecret._id);

      console.log('✅ Secret published!');
      console.log('');
      console.log('📋 Use this preview URL:');
      console.log('');
      console.log(`http://localhost:3000/api/preview?secret=${newestSecret.secret}&slug=/`);
    } else {
      console.log('');
      console.log('✅ Secret is already published');
      console.log('');
      console.log('📋 Use this preview URL:');
      console.log('');
      console.log(`http://localhost:3000/api/preview?secret=${newestSecret.secret}&slug=/`);
    }

    console.log('');
    console.log('✨ Cleanup complete!');
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

cleanupSecrets();
