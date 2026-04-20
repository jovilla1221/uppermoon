const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: "bf20iv8w",
  dataset: "production",
  token: "skQ6VIgxocM4PSZs0yqxNTqjFTXWMQm1y3Wn7kqELB1rMpfNFquhRAeQncxbIlL4tVRIxZzqQMSQrMHVcmqLJg0Cg5KKnmZYDfeoHe8vFSwJbMnSVvKL0qgH41ucFWU0JWxMxUndkXrL0p7nnvjgq0rfxTdrF1KlaaeU06K2jixfkOsFcY6C",
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
