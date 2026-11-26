
const bcrypt = require('bcryptjs');

async function generateHashes() {
    const password = 'Password@123';

    const hash = await bcrypt.hash(password, 12);

    console.log('Password:', password);
    console.log('Bcrypt Hash:', hash);
}

generateHashes().catch(console.error);
