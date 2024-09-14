import React from "react";
import { Heart } from "react-feather";
import { motion } from "framer-motion";

interface GalleryProps {
  images: Array<{ id: number; download_url: string; author: string }>;
  loading: boolean;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onImageClick: (id: number) => void;
}

interface GalleryGridProps {
  images: GalleryProps["images"];
  loading: boolean;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onImageClick: (id: number) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  loading,
  favorites,
  onToggleFavorite,
  onImageClick,
}) => {
  return (
    <div className="px-[20%] pt-[10%] pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          images.map((image) => (
            <motion.div
              key={image.id}
              className="w-full aspect-square overflow-hidden relative group cursor-pointer rounded-lg shadow-lg"
              onClick={() => onImageClick(Number(image.id))}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
            >
              <motion.img
                src={image.download_url}
                alt={image.author}
                className="w-full h-full object-cover"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              />
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(Number(image.id));
                }}
                className="absolute top-4 right-4 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  size={24}
                  color={favorites.includes(Number(image.id)) ? "red" : "black"}
                  fill={favorites.includes(Number(image.id)) ? "red" : "none"}
                />
              </motion.button>
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ y: 20 }}
                whileHover={{ y: 0 }}
              >
                <p className="font-semibold">{image.author}</p>
              </motion.div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryGrid;
