import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Ad } from "../models/Ad";

const AdDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      if (!id) return;
      const adDoc = doc(db, "ads", id);
      const adSnap = await getDoc(adDoc);
      if (adSnap.exists()) {
        setAd(adSnap.data() as Ad);
      } else {
        console.error("Anuncio no encontrado");
      }
    };
    fetchAd();
  }, [id]);

  if (!ad) {
    return <p className="text-center text-gray-500">Cargando anuncio...</p>;
  }

  const createdAt = ad.createdAt
    ? (ad.createdAt as any).toDate
      ? (ad.createdAt as any).toDate() // Si es un Timestamp
      : ad.createdAt // Si ya es un Date
    : null;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
      <p className="text-gray-700 mb-4">{ad.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ad.images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`Imagen ${index + 1}`}
            className="w-full h-64 object-cover rounded"
          />
        ))}
      </div>
      <div className="mt-4">
        <span
          className={`badge ${
            ad.status === "draft" ? "badge-warning" : "badge-success"
          }`}
        >
          {ad.status === "draft" ? "Borrador" : "Publicado"}
        </span>
        <p className="text-sm text-gray-500 mt-2">
          Creado por: {ad.createdBy || "Anónimo"}
        </p>
        <p className="text-sm text-gray-500">
          Fecha: {createdAt ? createdAt.toLocaleDateString() : "Desconocida"}
        </p>
      </div>
    </div>
  );
};

export default AdDetailPage;
