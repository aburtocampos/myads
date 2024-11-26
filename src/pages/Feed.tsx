import React, { useEffect, useState, useContext } from "react";
import AdCard from "../components/AdCard";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { getPublishedAds } from "../services/adsService";
import { SearchContext } from "../App";
import "../assets/masonry.css";

const Feed: React.FC = () => {
  const { searchQuery } = useContext(SearchContext);
  const { data: ads, loadMoreRef, isLoading } = useInfiniteScroll(getPublishedAds);
  const [filteredAds, setFilteredAds] = useState(ads);

  useEffect(() => {
    setFilteredAds(
      ads.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, ads]);

  return (
    <div className="p-4">
      {filteredAds.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 text-lg">No hay anuncios publicados.</p>
      )}
      {filteredAds.length > 0 && (
        <div
          className="masonry-grid"
          style={{
            columnGap: "1rem",
            columnCount: "4",
          }}
        >
          {filteredAds.map((ad) => (
            <div key={ad.id} className="mb-6 break-inside-avoid">
              <AdCard ad={ad} />
            </div>
          ))}
        </div>
      )}
      {isLoading && ads.length > 0 && (
        <p className="text-center text-gray-500 text-lg">Cargando más anuncios...</p>
      )}
      <div ref={loadMoreRef} className="h-4"></div>
    </div>
  );
};

export default Feed;
