import admin from "firebase-admin";

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
  "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com" 
}


let app;

const isServiceAccountValid = serviceAccount && serviceAccount.private_key && serviceAccount.client_email && serviceAccount.project_id && serviceAccount.type === "service_account";


if (!isServiceAccountValid){
  console.error("Firebase Admin SDK: Missing or invalid service account credentials.");
  console.error("Please ensure FIREBASE_TYPE, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set correctly.");
}

if (!admin.apps.length) {
  if (isServiceAccountValid) {
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully");
    } catch (error) {
      console.error("Firebase Admin SDK initialization failed:", error);
      throw new Error(`Firebase Admin SDK init failed: ${error.message}`);
    }
  }
} else {
  app = admin.app();
  console.log("Firebase Admin SDK already initiliazed.");
}

let db = null;
let auth = null;

if (app) {
  try {
    db = app.firestore();
    auth = app.auth();
  } catch (error) {
    console.error("Firebase Admin SDK: Could not create Firestore or Auth instance:", error);

  }
} else {
  console.error("Firebase Admin SDK: App instance not available. Firestore and Auth will not be initialized.");
}

export { db, auth }