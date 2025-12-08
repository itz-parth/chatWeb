const admin = require('firebase-admin');

try {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable');
  }

  const serviceAccount = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✓ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('✗ Firebase Admin initialization error:', error.message);
}

let dbExport = null;

if (admin.apps && admin.apps.length > 0) {
  dbExport = admin.firestore();
  admin.firestore().settings({ ignoreUndefinedProperties: true });
} else {
  console.error('✗ Firestore not initialized – database export is null');
}

module.exports = { db: dbExport, admin };
