import React from "react";
import { Ad } from "../models/Ad";
import { useNavigate } from "react-router-dom";

interface AdCardProps {
  ad: Ad;
}

const AdCard: React.FC<AdCardProps> = ({ ad }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/ad/${ad.id}`); // Redirigir al detalle del anuncio
  };

  return (
    <div
      onClick={handleCardClick}
      className="card bg-base-100 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
    >
      <figure>
        <img
          src={ad.coverImage || ad.images[0]}
          alt={ad.title}
          className="w-full h-48 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{ad.title}</h2>
        <p>{ad.description}</p>
        <div
          className={`badge ${
            ad.status === "draft" ? "badge-warning" : "badge-success"
          }`}
        >
          {ad.status === "draft" ? "Borrador" : "Publicado"}
        </div>
      </div>
    </div>
  );
};

export default AdCard;
