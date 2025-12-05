// ============================================================================
// Environment Variables Verification Script
// Checks if Firebase credentials are properly configured
// Run: node checkEnv.js
// ============================================================================

require('dotenv').config();

console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('Checking Environment Variables...');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');

// Check if Firebase credentials environment variable exists
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.log('✓ GOOGLE_APPLICATION_CREDENTIALS_JSON is present');
  console.log(`  Length: ${process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON.length} characters`);
  console.log('');

  // Try to parse and validate the JSON credentials
  try {
    const creds = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    console.log('✓ JSON credentials successfully parsed');
    console.log('');
    console.log('  Firebase Project Details:');
    console.log(`  - Project ID: ${creds.project_id}`);
    console.log(`  - Client Email: ${creds.client_email}`);
    console.log(`  - Auth URI: ${creds.auth_uri}`);
    console.log('');
    console.log('✓ All environment variables configured correctly!');
    console.log('');
  } catch (e) {
    console.error(`✗ JSON parse failed: ${e.message}`);
    console.error('');
    console.error('The GOOGLE_APPLICATION_CREDENTIALS_JSON is not valid JSON.');
    console.error('');
  }
} else {
  console.error('✗ GOOGLE_APPLICATION_CREDENTIALS_JSON is MISSING!');
  console.error('');
  console.log('Please set this environment variable in your .env file.');
  console.log('It should contain your Firebase service account JSON credentials.');
  console.log('');
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
