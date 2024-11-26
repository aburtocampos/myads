import { useState, useEffect, useRef } from "react";

function useInfiniteScroll<T extends { id: string }>(
  fetchData: (cursor?: string) => Promise<{ data: T[]; nextCursor?: string }>
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [cursor]);

  const loadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const response = await fetchData(cursor);
    setData((prev) => {
      // Usar un Map para garantizar que los elementos sean únicos
      const uniqueData = new Map(
        [...prev, ...response.data].map((item) => [item.id, item]) // Usar el `id` como clave
      );
      return Array.from(uniqueData.values()); // Convertir el Map de vuelta a un array
    });

    setCursor(response.nextCursor); // Actualizar el cursor
    setIsLoading(false);
  };

  return { data, loadMoreRef, isLoading };
}

export default useInfiniteScroll;
