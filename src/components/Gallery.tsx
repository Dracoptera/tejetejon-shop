import { useNavigate } from 'react-router-dom';
import { useState, useCallback, memo } from 'react';
import { productos } from '../data/products';
import { Producto } from '../types';

interface ProductCardProps {
  producto: Producto;
  index: number;
  onProductClick: (producto: Producto) => void;
  onImageLoad: (imageSrc: string) => void;
  loadedImages: Set<string>;
}

const ProductCard = memo(({ producto, index, onProductClick, onImageLoad, loadedImages }: ProductCardProps) => {
  const imageSrc = producto.images?.[0];
  const isFirstRow = index < 4;
  const isLoaded = imageSrc ? loadedImages.has(imageSrc) : false;

  return (
    <div
      className="product-card"
      onClick={() => onProductClick(producto)}
    >
      <div className="product-image">
        {imageSrc ? (
          <>
            {!isLoaded && (
              <div className="image-placeholder">
                <div className="loading-spinner"></div>
              </div>
            )}
            <img
              src={imageSrc}
              alt={producto.nombre}
              loading={isFirstRow ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={isFirstRow ? 'high' : 'auto'}
              className={`product-img ${isLoaded ? 'loaded' : ''}`}
              onLoad={() => onImageLoad(imageSrc)}
            />
          </>
        ) : (
          <div className="no-image-placeholder">
            Sin imagen
          </div>
        )}
      </div>
      <div className="product-info">
        <div className="product-name">{producto.nombre}</div>
        <div className="product-price">{producto.precio}</div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export function Gallery() {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleProductClick = useCallback((producto: Producto) => {
    navigate(`/producto/${producto.id}`);
  }, [navigate]);

  const handleImageLoad = useCallback((imageSrc: string) => {
    setLoadedImages(prev => {
      if (prev.has(imageSrc)) return prev;
      const next = new Set(prev);
      next.add(imageSrc);
      return next;
    });
  }, []);

  return (
    <section className="gallery-section">
      <div className="gallery-grid">
        {productos.map((producto, index) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            index={index}
            onProductClick={handleProductClick}
            onImageLoad={handleImageLoad}
            loadedImages={loadedImages}
          />
        ))}
      </div>
    </section>
  );
}

