export function ShippingSection() {
  return (
    <div className="shipping-section">
      <h2 className="shipping-title">Entregas y envíos</h2>
      <div className="shipping-grid">
        <div className="shipping-card">
          <div className="shipping-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <path d="M16 8h4l3 5v3h-7V8z"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <h3>Todo el país</h3>
          <p>Enviamos a cualquier punto del Uruguay por <strong>DAC</strong></p>
        </div>

        <div className="shipping-card">
          <div className="shipping-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <h3>Montevideo</h3>
          <p>También despachamos por <strong>PedidosYa</strong></p>
        </div>

        <div className="shipping-card">
          <div className="shipping-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Entrega personal</h3>
          <p>Coordinamos lugar y horario por{' '}
            <a href="https://www.instagram.com/tejetejon.uy" target="_blank" rel="noopener noreferrer" className="shipping-link">Instagram</a>
          </p>
        </div>
      </div>
    </div>
  );
}
