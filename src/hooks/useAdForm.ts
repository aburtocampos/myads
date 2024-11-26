import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Ad } from "../models/Ad";
import { createAd, updateAd } from "../services/adsService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useAdForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [localImages, setLocalImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<{ url: string; deleteUrl: string; markedForDeletion?: boolean }[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar datos al editar
  useEffect(() => {
    if (id) {
      const fetchAd = async () => {
        const adDoc = doc(db, "ads", id);
        const adSnap = await getDoc(adDoc);

        if (adSnap.exists()) {
          const adData = adSnap.data() as Ad;
          setTitle(adData.title);
          setDescription(adData.description);
          setPreviewImages(adData.images);
          setCoverImageIndex(
            adData.images.findIndex((img) => img.url === adData.coverImage) ?? null
          );
          setIsEditing(true);
        } else {
          console.error("El anuncio no existe.");
        }
      };
      fetchAd();
    } else {
      setPreviewImages([]);
      setCoverImageIndex(null);
    }
  }, [id]);

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (localImages.length + previewImages.length >= 6) {
        alert("Solo se pueden subir un máximo de 6 imágenes.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = { url: reader.result as string, deleteUrl: "", markedForDeletion: false };
        setPreviewImages((prev) => {
          const isDuplicate = prev.some((img) => img.url === newImage.url);
          return isDuplicate ? prev : [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);

      setLocalImages((prev) => [...prev, file]);
    }
  };

  const handleRemoveImage = async (index: number, isLocal: boolean) => {
    if (isLocal) {
      setLocalImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPreviewImages((prev) =>
        prev.map((img, i) => (i === index ? { ...img, markedForDeletion: true } : img))
      );
    }
  
    // Si se elimina la portada, reasignar una nueva o dejarla en null
    if (index === coverImageIndex) {
      const remainingImages = previewImages.filter((_, i) => i !== index);
      setCoverImageIndex(remainingImages.length > 0 ? 0 : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const uploadPromises = localImages.map(async (file, index) => {
        const formData = new FormData();
        formData.append("image", file);
  
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        if (data.success) {
          // Sincronizar con previewImages
          setPreviewImages((prev) =>
            prev.map((img, i) =>
              i === previewImages.length - localImages.length + index
                ? { url: data.data.url, deleteUrl: data.data.delete_url }
                : img
            )
          );
          return {
            url: data.data.url,
            deleteUrl: data.data.delete_url,
          };
        } else {
          console.error("Error al subir la imagen:", data.error.message);
          return null;
        }
      });
  
      const uploadedResults = await Promise.all(uploadPromises);
  
      // Filtrar imágenes válidas
      const validUploadedImages = uploadedResults.filter(
        (img) => img !== null
      ) as { url: string; deleteUrl: string }[];
  
      // Combinar y filtrar duplicados
      const allImages = [
        ...previewImages.filter((img) => img.url.startsWith("http")), // Solo imágenes subidas
        ...validUploadedImages,
      ].filter(
        (image, index, self) =>
          index === self.findIndex((i) => i.url === image.url)
      );
  
      // Validar portada
      const coverImage =
        coverImageIndex !== null && allImages[coverImageIndex]
          ? allImages[coverImageIndex].url
          : allImages[0]?.url || "";
  
      const ad: Partial<Ad> = {
        title,
        description,
        images: allImages,
        coverImage,
      };
  
      // Guardar anuncio
      if (isEditing && id) {
        await updateAd(id, ad);
  
        // Eliminar imágenes marcadas para eliminación
        const imagesToDelete = previewImages.filter((img) => img.markedForDeletion);
        await Promise.all(
          imagesToDelete.map(async (img) => {
            if (img.deleteUrl) {
              try {
                await fetch(img.deleteUrl, { method: "DELETE" });
              } catch (error) {
                console.error(`Error al eliminar imagen: ${img.url}`, error);
              }
            }
          })
        );
  
        navigate("/drafts");
      } else {
        await createAd({
          ...ad,
          status: "draft",
          createdBy: "user-id",
          createdAt: new Date(),
        } as Ad);
  
        navigate("/drafts");
      }
    } catch (error) {
      console.error("Error al guardar el anuncio:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCancel = () => {
    navigate("/drafts");
  };

  return {
    title,
    description,
    previewImages,
    coverImageIndex,
    isEditing,
    loading,
    setTitle,
    setDescription,
    handleImageSelection,
    handleRemoveImage,
    handleSubmit,
    handleCancel,
    setCoverImageIndex
  };
};
