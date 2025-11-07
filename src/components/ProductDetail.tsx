import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { productos } from '../data/products';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const producto = productos.find((p) => p.id === id);
  const images = useMemo(() => producto?.images ?? [], [producto]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { prevId, nextId } = useMemo(() => {
    const ids = productos.map(p => p.id);
    const idx = ids.findIndex(pid => pid === id);
    if (idx === -1) return { prevId: undefined, nextId: undefined };
    const prev = ids[(idx - 1 + ids.length) % ids.length];
    const next = ids[(idx + 1) % ids.length];
    return { prevId: prev, nextId: next };
  }, [id]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [id]);

  useEffect(() => {
    if (producto) {
      document.title = `${producto.nombre} - Tienda de Amigurumi`;
    } else {
      document.title = 'Producto no encontrado - Tienda de Amigurumi';
    }
  }, [producto]);

  if (!producto) {
    return (
      <section className="detail-section">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver a la galería
        </button>
        <div className="detail-container">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe.</p>
        </div>
      </section>
    );
  }

  const goPrev = () => {
    if (!images.length) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (!images.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  }, []);

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        closeLightbox();
      }
    };

    if (lightboxOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [lightboxOpen, closeLightbox]);

  // Preload adjacent images for smoother carousel experience
  useEffect(() => {
    if (!images.length) return;
    
    const preloadImages = [currentIndex];
    if (images.length > 1) {
      preloadImages.push((currentIndex + 1) % images.length);
      preloadImages.push((currentIndex - 1 + images.length) % images.length);
    }
    
    preloadImages.forEach(idx => {
      const img = new Image();
      img.src = images[idx];
    });
  }, [currentIndex, images]);

  // Cleanup: restore body overflow when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <section className="detail-section">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Volver a la galería
      </button>
      <div className="detail-container">
        <div className="detail-header">
          <div className="detail-image">
            {images.length > 0 ? (
              <div className="carousel">
                <div className="carousel-main">
                  <button className="carousel-nav left" aria-label="Anterior" onClick={goPrev}>‹</button>
                  <div 
                    style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
                    onClick={() => openLightbox(currentIndex)}
                  >
                    <img
                      key={images[currentIndex]}
                      src={images[currentIndex]}
                      alt={`${producto.nombre} ${currentIndex + 1}`}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      className="carousel-main-img"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '12px',
                        transition: 'opacity 0.2s ease-in-out'
                      }}
                    />
                  </div>
                  <button className="carousel-nav right" aria-label="Siguiente" onClick={goNext}>›</button>
                </div>
                {images.length > 1 && (
                  <div className="carousel-thumbs">
                    {images.map((src, idx) => (
                      <button
                        key={src + idx}
                        className={`thumb ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => {
                          setCurrentIndex(idx);
                          openLightbox(idx);
                        }}
                        aria-label={`Imagen ${idx + 1}`}
                      >
                        <img
                          src={src}
                          alt={`${producto.nombre} miniatura ${idx + 1}`}
                          loading={idx < 3 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0'}}>
                Sin imagen disponible
              </div>
            )}
          </div>
          <div className="detail-info">
            <h2>{producto.nombre}</h2>
            <div className="detail-price">{producto.precio}</div>
          </div>
        </div>
        <div className="product-pager">
          <button
            className="pager-button"
            onClick={() => prevId && navigate(`/producto/${prevId}`)}
            aria-label="Producto anterior"
          >
            ← Anterior
          </button>
          <button
            className="pager-button"
            onClick={() => nextId && navigate(`/producto/${nextId}`)}
            aria-label="Producto siguiente"
          >
            Siguiente →
          </button>
        </div>
        <div className="detail-specs">
          <h3>Detalles del Producto</h3>
          <div className="spec-item">
            <span className="spec-label">Tamaño:</span>
            <span className="spec-value">{producto.tamaño}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Materiales:</span>
            <span className="spec-value">{producto.materiales}</span>
          </div>
        </div>
        {producto.notas && (
          <div className="product-notes">
            <h3>Notas</h3>
            <p>{producto.notas}</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && images.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button 
            className="lightbox-close" 
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button 
                className="lightbox-nav lightbox-prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button 
                className="lightbox-nav lightbox-next" 
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex]}
              alt={`${producto.nombre} ${lightboxIndex + 1}`}
              className="lightbox-image"
            />
            {images.length > 1 && (
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

