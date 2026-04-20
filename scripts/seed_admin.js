const bcrypt = require('bcrypt');

async function createAdmin() {
  const { createClient } = require('@sanity/client');
  
  const client = createClient({
    projectId: "bf20iv8w",
    dataset: "production",
    token: "skQ6VIgxocM4PSZs0yqxNTqjFTXWMQm1y3Wn7kqELB1rMpfNFquhRAeQncxbIlL4tVRIxZzqQMSQrMHVcmqLJg0Cg5KKnmZYDfeoHe8vFSwJbMnSVvKL0qgH41ucFWU0JWxMxUndkXrL0p7nnvjgq0rfxTdrF1KlaaeU06K2jixfkOsFcY6C",
    useCdn: false,
    apiVersion: '2023-05-03',
  });

  const username = "admin1";
  const password = "TysdbeiGFN1";
  const email = "filla.saputro@gmail.com"; 

  try {
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 12);

    console.log('Checking if admin1 already exists...');
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
