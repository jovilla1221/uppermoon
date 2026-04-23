require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcrypt');

async function createAdmin() {
  const { createClient } = require('@sanity/client');
  
  const client = createClient({
    projectId: "bf20iv8w",
    dataset: "production",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
    apiVersion: '2023-05-03',
  });

  // NOTE: Set these via environment variables or change before running
  const username = process.env.ADMIN_USERNAME || "admin1";
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL || "filla.saputro@gmail.com"; 

  if (!password) {
    console.error("ERROR: Set ADMIN_PASSWORD environment variable before running this script.");
    process.exit(1);
  }

  try {
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);

    console.log('Checking if admin already exists...');
    const existing = await client.fetch('*[_type == "adminUser" && (username == $username || email == $email)][0]', { username, email });

    if (existing) {
      console.log('Admin already exists. Updating password...');
      await client.patch(existing._id).set({ passwordHash, isVerified: true, role: 'admin' }).commit();
      console.log('Password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      await client.create({
        _type: 'adminUser',
        username,
        email,
        passwordHash,
        fullName: 'Admin UPPERMOON',
        isVerified: true,
        role: 'admin'
      });
      console.log('Admin user created successfully!');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

createAdmin();
