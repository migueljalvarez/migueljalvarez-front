// ~/server/utils/firebase-admin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import type { FirebaseServiceAccount } from '~/types/firebase/firebase'

let db: Firestore

// ✅ Inicializa solo una vez
if (!getApps().length) {
  const config = useRuntimeConfig()

  const { firebaseClientEmail, firebasePrivateKey, firebaseProjectId } = config

  // ✅ Validación segura de las variables
  if (!firebaseClientEmail || !firebasePrivateKey || !firebaseProjectId) {
    throw new Error('Faltan variables de entorno para Firebase Admin')
  }

  const serviceAccount: FirebaseServiceAccount = {
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey.replace(/\\n/g, '\n')
  }

  initializeApp({
    credential: cert(serviceAccount)
  })
  // ✅ Instancia reutilizable de Firestore
}
db = getFirestore()
// ✅ Colecciones tipadas y reutilizables
export const model = {
  me: db.collection('Me'),
  portfolio: db.collection('Portfolio'),
  socialMedia: db.collection('SocialMedia'),
  testimonial: db.collection('Testimonial')
}
