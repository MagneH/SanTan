#!/usr/bin/env node

import { createClient } from '@sanity/client';
import { loadPreviewEnvironment, getSanityClientConfig, ensureTokenOrExit } from './utils/previewEnv.js';

const { token } = loadPreviewEnvironment();
const client = createClient({ ...getSanityClientConfig(), token, useCdn: false });
ensureTokenOrExit(client.config().token, 'Secret publish');

async function publishSecret() {
  // Get the most recent secret
  const secrets = await client.fetch('*[_type == "sanity.previewUrlSecret"] | order(_createdAt desc)');

  if (!secrets || secrets.length === 0) {
    console.log('❌ No secrets found!');
    process.exit(1);
  }

  const doc = secrets[0];
  const secret = doc.secret;

  console.log('🔍 Found most recent secret:', secret);
  console.log('Document ID:', doc._id);
  console.log('Created:', doc._createdAt);
  console.log('');

  if (doc._id.startsWith('drafts.')) {
    console.log('📝 This is a DRAFT. Publishing now...');
    const publishedId = doc._id.replace('drafts.', '');

    // Create published version
    await client.createOrReplace({
      _id: publishedId,
      _type: 'sanity.previewUrlSecret',
      secret: doc.secret,
    });

    console.log('✅ Published as:', publishedId);

    // Delete draft
    await client.delete(doc._id);
    console.log('🗑️  Deleted draft:', doc._id);

    console.log('');
    console.log('✨ Secret is now PUBLISHED!');
    console.log('');
    console.log('📋 Use this preview URL:');
    console.log('');
    console.log(`http://localhost:3000/api/preview?secret=${secret}&slug=/`);
  } else {
    console.log('✅ Already published!');
    console.log('');
    console.log('📋 Use this preview URL:');
    console.log('');
    console.log(`http://localhost:3000/api/preview?secret=${secret}&slug=/`);
  }
}

publishSecret().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
