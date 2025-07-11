import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import type { FirebaseServiceAccount } from '~/types/firebase/firebase'

const { firebaseClientEmail, firebasePrivateKey, firebaseProjectId } = useRuntimeConfig()

const serviceAccount: FirebaseServiceAccount = {
  projectId: firebaseProjectId,
  privateKey: firebasePrivateKey?.replace(/\\n/g, '\n'),
  clientEmail: firebaseClientEmail
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  })
}

const db = getFirestore()
const me = db.collection('/Me')
const portfolio = db.collection('/Portfolio')
const socialMedia = db.collection('/SocialMedia')
export const model = { me, portfolio, socialMedia }
