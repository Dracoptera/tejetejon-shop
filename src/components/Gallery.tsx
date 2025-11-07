import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { productos } from '../data/products';
import { Producto } from '../types';

export function Gallery() {
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleProductClick = (producto: Producto) => {
    navigate(`/producto/${producto.id}`);
  };

  const handleImageLoad = (imageSrc: string) => {
    setLoadedImages(prev => new Set(prev).add(imageSrc));
  };

  return (
    <section className="gallery-section">
      <div className="gallery-grid">
        {productos.map((producto, index) => {
          const imageSrc = producto.images?.[0];
          const isFirstRow = index < 4; // Load first 4 images immediately
          
          return (
            <div
              key={producto.id}
              className="product-card"
              onClick={() => handleProductClick(producto)}
            >
              <div className="product-image">
                {imageSrc ? (
                  <>
                    {!loadedImages.has(imageSrc) && (
                      <div className="image-placeholder" style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}>
                        <div className="loading-spinner" style={{
                          width: '40px',
                          height: '40px',
                          border: '3px solid #e0e0e0',
                          borderTop: '3px solid #667eea',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }}></div>
                      </div>
                    )}
                    <img
                      src={imageSrc}
                      alt={producto.nombre}
                      loading={isFirstRow ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={isFirstRow ? 'high' : 'auto'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: loadedImages.has(imageSrc) ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                      onLoad={() => handleImageLoad(imageSrc)}
                    />
                  </>
                ) : (
                  <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0'}}>
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
        })}
      </div>
    </section>
  );
}

