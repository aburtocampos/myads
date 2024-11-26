export interface Ad {
  id: string; // ID generado por Firebase
  title: string; // Título del anuncio
  description: string; // Descripción
  images: { url: string; deleteUrl: string }[]; // URLs de imágenes (máximo 6)
  coverImage: string; // URL de la imagen de portada
  status: "draft" | "published"; // Estado del anuncio
  createdBy: string; // Usuario que creó el anuncio
  createdAt: Date; // Fecha de creación
  }
  