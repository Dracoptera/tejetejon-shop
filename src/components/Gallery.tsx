import { useNavigate } from 'react-router-dom';
import { productos } from '../data/products';
import { Producto } from '../types';

export function Gallery() {
  const navigate = useNavigate();

  const handleProductClick = (producto: Producto) => {
    navigate(`/producto/${producto.id}`);
  };

  return (
    <section className="gallery-section">
      <div className="gallery-grid">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="product-card"
            onClick={() => handleProductClick(producto)}
          >
            <div className="product-image">
              {producto.images?.length ? (
                <img src={producto.images[0]} alt={producto.nombre} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                producto.imagen
              )}
            </div>
            <div className="product-info">
              <div className="product-name">{producto.nombre}</div>
              <div className="product-price">{producto.precio}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

