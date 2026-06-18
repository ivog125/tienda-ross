const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const EMAIL = 'retales2010@hotmail.com';
const PASSWORD = 'leiapakku';

async function crearAdmin() {
  try {
    const user = await admin.auth().createUser({ email: EMAIL, password: PASSWORD });
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`✅ Usuario creado: ${EMAIL}`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Claim admin: true`);
  } catch (e) {
    if (e.code === 'auth/email-already-exists') {
      const user = await admin.auth().getUserByEmail(EMAIL);
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`✅ Usuario existente actualizado con claim admin: ${EMAIL}`);
    } else {
      console.error('❌ Error:', e.message);
    }
  } finally {
    process.exit(0);
  }
}

crearAdmin();
