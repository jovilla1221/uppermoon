const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function check() {
  try {
    const admin = await client.fetch('*[_type == "adminUser" && (username == "admin1" || email == "admin1")][0]');
    console.log('--- RESULT ---');
    console.log(JSON.stringify(admin, null, 2));
    console.log('--------------');
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
