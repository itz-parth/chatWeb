// ============================================================================
// Firebase Admin SDK Initialization
// Sets up server-side Firebase access for Firestore database operations
// ============================================================================

const admin = require('firebase-admin');

// --- Initialize Firebase Admin ---
try {
  // Check if Firebase credentials are provided via environment variable
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable');
  }

  // Parse Firebase service account credentials from JSON string
  const serviceAccount = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  );

  // Initialize Firebase Admin with service account credentials
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✓ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('✗ Firebase Admin initialization error:', error.message);
}

// --- Export Firestore Database Instance ---
// Initialize Firestore database reference if Admin SDK was successful
let dbExport = null;

// Check if Firebase Admin App was initialized
if (admin.apps && admin.apps.length > 0) {
  // Get Firestore database instance
  dbExport = admin.firestore();
} else {
  // Log error if initialization failed
  console.error('✗ Firestore not initialized – database export is null');
}

// Export admin SDK and Firestore database for use in other modules
module.exports = { db: dbExport, admin };
