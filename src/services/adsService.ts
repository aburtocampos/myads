import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { Ad } from "../models/Ad";

const adsCollection = collection(db, "ads");

// Obtener anuncios publicados
export const getPublishedAds = async (
  cursor?: string
): Promise<{ data: Ad[]; nextCursor?: string }> => {
  const adsQuery = query(
    adsCollection,
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
    limit(10),
    ...(cursor ? [startAfter(cursor)] : [])
  );

  const snapshot = await getDocs(adsQuery);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Ad));
  const nextCursor = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1].id : undefined;

  return { data, nextCursor };
};

// Crear un nuevo anuncio
export const createAd = async (ad: Omit<Ad, "id">): Promise<void> => {
  await addDoc(adsCollection, ad); // No añadimos manualmente el `id`
};

// Actualizar un anuncio
export const updateAd = async (id: string, updatedAd: Partial<Ad>): Promise<void> => {
  const adDoc = doc(db, "ads", id);
  await updateDoc(adDoc, updatedAd);
};

// Eliminar un anuncio
export const deleteAd = async (id: string): Promise<void> => {
  const adDoc = doc(db, "ads", id);
  await deleteDoc(adDoc);
};

// Obtener anuncios en estado draft
export const getDraftAds = async (): Promise<Ad[]> => {
  const adsQuery = query(
    adsCollection,
    orderBy("createdAt", "desc") // Ordenar por fecha de creación
  );

  const snapshot = await getDocs(adsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Ad));
};

// Cambiar el estado de un anuncio a "published"
export const publishAd = async (id: string): Promise<void> => {
  const adRef = doc(db, "ads", id);
  await updateDoc(adRef, { status: "published" });
};
