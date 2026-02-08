/**
 * Script to generate bcrypt password hash
 * Usage: node scripts/generate-password-hash.js <password>
 */

const bcrypt = require('bcrypt');

async function generateHash() {
  const password = process.argv[2] || 'SuperAdmin@123';
  const saltRounds = 10;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('\n=================================');
    console.log('Password Hash Generated');
    console.log('=================================');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('=================================\n');
    console.log('Copy the hash above and use it in your migration or environment variables.');
    console.log('\nExample SQL:');
    console.log(`INSERT INTO utilisateurs (username, password, ...) VALUES ('superadmin', '${hash}', ...);`);
    console.log('\n');
  } catch (error) {
    console.error('Error generating hash:', error.message);
    process.exit(1);
  }
}

generateHash();
