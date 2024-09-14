import React, { useState, useEffect, useCallback } from "react";
import GalleryGrid from "./GalleryGrid";

interface ImageDetails {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

interface ImageProps extends Pick<ImageDetails, "author" | "download_url"> {
  id: number;
  src: string;
  alt: string;
}

type PicsumItem = Pick<ImageDetails, "id" | "author" | "download_url">;

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("imageFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id];

      localStorage.setItem("imageFavorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=6`
      );
      if (!response.ok) {
        throw new Error("Falha ao carregar imagens");
      }
      const data = await response.json();
      const formattedImages: ImageProps[] = data.map((item: PicsumItem) => ({
        id: parseInt(item.id),
        src: item.download_url,
        alt: `Foto por ${item.author}`,
        download_url: item.download_url,
        author: item.author,
      }));
      setImages(formattedImages);
    } catch (err) {
      setError("Erro ao carregar imagens");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const fetchImageDetails = async (id: number) => {
    try {
      const response = await fetch(`https://picsum.photos/id/${id}/info`);
      if (!response.ok) throw new Error("Falha ao carregar detalhes da imagem");
      const data: ImageDetails = await response.json();
      setSelectedImage(data);
    } catch (err) {
      console.error("Erro ao buscar detalhes da imagem:", err);
    }
  };

  return (
    <div className="relative min-h-screen pt-20">
      <div className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 shadow-md z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-lg font-semibold text-gray-700">
            Página {page}
          </span>
          <button
            onClick={handleNextPage}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Próxima
          </button>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <GalleryGrid
          images={images}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onImageClick={fetchImageDetails}
        />
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Detalhes da Imagem</h2>
            <p>Autor: {selectedImage.author}</p>
            <p>
              Dimensões: {selectedImage.width} x {selectedImage.height}
            </p>
            <p>
              URL:{" "}
              <a
                href={selectedImage.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no Unsplash
              </a>
            </p>
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
