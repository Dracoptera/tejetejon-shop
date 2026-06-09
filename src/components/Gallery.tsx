import { useNavigate } from 'react-router-dom';
import { useState, useCallback, memo, useMemo } from 'react';
import { productos } from '../data/products';
import { Producto } from '../types';
import { ShippingSection } from './ShippingSection';

type SortOption = 'default' | 'alpha' | 'price-asc' | 'price-desc';

function parsePrice(precio: string): number {
  return parseInt(precio.replace(/[$,]/g, ''), 10);
}

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
  const [sort, setSort] = useState<SortOption>('default');

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

  const sorted = useMemo(() => {
    const list = [...productos];
    if (sort === 'alpha') return list.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    if (sort === 'price-asc') return list.sort((a, b) => parsePrice(a.precio) - parsePrice(b.precio));
    if (sort === 'price-desc') return list.sort((a, b) => parsePrice(b.precio) - parsePrice(a.precio));
    return list;
  }, [sort]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Orden original' },
    { value: 'alpha', label: 'Alfabético' },
    { value: 'price-asc', label: 'Menor precio' },
    { value: 'price-desc', label: 'Mayor precio' },
  ];

  return (
    <section className="gallery-section">
      <div className="sort-bar">
        {sortOptions.map(opt => (
          <button
            key={opt.value}
            className={`sort-btn${sort === opt.value ? ' active' : ''}`}
            onClick={() => setSort(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {sorted.map((producto, index) => (
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

      <ShippingSection />
    </section>
  );
}

