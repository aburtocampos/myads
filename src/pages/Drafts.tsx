import React, { useEffect, useState, useContext } from "react";
import { Ad } from "../models/Ad";
import { getDraftAds, deleteAd, publishAd, updateAd } from "../services/adsService";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../App";
import PlaceholderImage from "../components/PlaceholderImage";

const Drafts: React.FC = () => {
  const { searchQuery } = useContext(SearchContext);
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      const fetchedAds = await getDraftAds();
      setAds(fetchedAds);
      setFilteredAds(fetchedAds);
    };
    fetchAds();
  }, []);

  useEffect(() => {
    setFilteredAds(
      ads.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, ads]);

  const handlePublish = async (id: string) => {
    await publishAd(id);
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === id ? { ...ad, status: "published" } : ad
      )
    );
  };

  const handleUnpublish = async (id: string) => {
    await updateAd(id, { status: "draft" });
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === id ? { ...ad, status: "draft" } : ad
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este anuncio?")) {
      await deleteAd(id);
      setAds((prev) => prev.filter((ad) => ad.id !== id));
      setFilteredAds((prev) => prev.filter((ad) => ad.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Drafts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className="card bg-base-100 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/ad/${ad.id}`)}
          >
            <figure>
              {ad.coverImage || ad.images.length > 0 ? (
                <img
                  src={ad.coverImage || ad.images[0].url}
                  alt={ad.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <PlaceholderImage />
              )}
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
              <div className="card-actions justify-end mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${ad.id}`);
                  }}
                  className="btn btn-sm btn-primary"
                  disabled={ad.status === "published"}
                >
                  Editar
                </button>
                {ad.status === "draft" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePublish(ad.id);
                    }}
                    className="btn btn-sm btn-success"
                  >
                    Publicar
                  </button>
                )}
                {ad.status === "published" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnpublish(ad.id);
                    }}
                    className="btn btn-sm btn-warning"
                  >
                    Despublicar
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ad.id);
                  }}
                  className="btn btn-sm btn-error"
                  disabled={ad.status === "published"}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drafts;
