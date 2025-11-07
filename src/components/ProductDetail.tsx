import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { productos } from '../data/products';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const producto = productos.find((p) => p.id === id);
  const images = useMemo(() => producto?.images ?? [], [producto]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      key={images[currentIndex]}
                      src={images[currentIndex]}
                      alt={`${producto.nombre} ${currentIndex + 1}`}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
                        onClick={() => setCurrentIndex(idx)}
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
    </section>
  );
}

