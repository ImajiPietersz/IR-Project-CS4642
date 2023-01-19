//in server/create-api-key.js
const client = require('./elasticsearch/client');

async function generateApiKeys(opts) {
  const body = await client.security.createApiKey({
    body: {
      name: 'SearchEngineMetaphorSinhala',
      role_descriptors: {
        metaphor_example_writer: {
          cluster: ['monitor'],   //read only previlage
          index: [
            {
              names: ['songs'],
              privileges: ['create_index', 'write', 'read', 'manage'],
            },
          ],
        },
      },
    },
  });
  return Buffer.from(`${body.id}:${body.api_key}`).toString('base64');
}

generateApiKeys()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });