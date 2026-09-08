import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';

export const BUSINESS_COLLECTIONS = {
  users: 'users',
  sales: 'sales',
  stock: 'stock',
  inventory: 'inventory',
  orders: 'orders',
  customers: 'customers',
  staff: 'staff',
  expenses: 'expenses',
  settings: 'settings',
  products: 'products',
  bookings: 'bookings',
  menu: 'menu',
  tables: 'tables',
};

const withAuditFields = (data = {}, userId) => ({
  ...data,
  userId,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

export async function createUserProfile(uid, profile) {
  const payload = {
    ...profile,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, BUSINESS_COLLECTIONS.users, uid), payload, { merge: true });
  const savedDoc = await getDoc(doc(db, BUSINESS_COLLECTIONS.users, uid));
  return savedDoc.exists() ? { id: savedDoc.id, ...savedDoc.data() } : { id: uid, ...payload };
}

export async function getUserProfile(uid) {
  const userRef = doc(db, BUSINESS_COLLECTIONS.users, uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
}

export async function addBusinessItem(collectionName, userId, item) {
  const payload = withAuditFields(item, userId);
  const docRef = await addDoc(collection(db, collectionName), payload);

  const savedDoc = await getDoc(docRef);
  return savedDoc.exists() ? { id: savedDoc.id, ...savedDoc.data() } : { id: docRef.id, ...payload };
}

export async function getBusinessItems(collectionName, userId) {
  const q = query(collection(db, collectionName), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function updateBusinessItem(collectionName, userId, itemId, updates) {
  const itemRef = doc(db, collectionName, itemId);
  const itemSnap = await getDoc(itemRef);

  if (!itemSnap.exists()) {
    throw new Error(`Item not found in ${collectionName}`);
  }

  const currentData = itemSnap.data();
  if (currentData.userId !== userId) {
    throw new Error('You do not have permission to update this item.');
  }

  await updateDoc(itemRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  const updatedDoc = await getDoc(itemRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function deleteBusinessItem(collectionName, userId, itemId) {
  const itemRef = doc(db, collectionName, itemId);
  const itemSnap = await getDoc(itemRef);

  if (!itemSnap.exists()) {
    throw new Error(`Item not found in ${collectionName}`);
  }

  if (itemSnap.data().userId !== userId) {
    throw new Error('You do not have permission to delete this item.');
  }

  await deleteDoc(itemRef);
  return true;
}

export async function saveBusinessCollection(collectionName, userId, items = []) {
  const existingItems = await getBusinessItems(collectionName, userId);
  const existingIds = new Set(existingItems.map((item) => item.id));

  const operations = items.map(async (item) => {
    if (item.id && existingIds.has(item.id)) {
      return updateBusinessItem(collectionName, userId, item.id, item);
    }

    return addBusinessItem(collectionName, userId, item);
  });

  return Promise.all(operations);
}

export async function syncUserBusinessSnapshot(userId, snapshot = {}) {
  const entries = Object.entries(snapshot);

  const results = await Promise.all(
    entries.map(async ([collectionName, items]) => {
      if (!Array.isArray(items)) return { collectionName, items: [] };

      const syncedItems = await Promise.all(
        items.map(async (item) => {
          if (item.id) {
            try {
              return updateBusinessItem(collectionName, userId, item.id, item);
            } catch (error) {
              return addBusinessItem(collectionName, userId, item);
            }
          }

          return addBusinessItem(collectionName, userId, item);
        })
      );

      return { collectionName, items: syncedItems };
    })
  );

  return Object.fromEntries(results.map(({ collectionName, items }) => [collectionName, items]));
}

export async function loadUserBusinessSnapshot(userId, collectionNames = Object.values(BUSINESS_COLLECTIONS)) {
  const entries = await Promise.all(
    collectionNames.map(async (collectionName) => {
      const items = await getBusinessItems(collectionName, userId);
      return [collectionName, items];
    })
  );

  return Object.fromEntries(entries);
}

export function getSafeUserData(user) {
  if (!user) return null;

  return {
    id: user.uid || user.id,
    userId: user.uid || user.id,
    email: user.email || user.emailAddress || '',
    ...user,
  };
}
