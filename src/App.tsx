import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Gallery } from './components/Gallery';
import { ProductDetail } from './components/ProductDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>
            <Link to="/" className="logo-link">
              Tejetejón - Amigurumis
            </Link>
          </h1>
          <p className="subtitle">Creaciones hechas a mano con amor</p>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2025 Tejetejón. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

