// Datos de productos Amigurumi
const productos = [
    {
        id: 1,
        nombre: "Osito Teddy",
        precio: "$25.000",
        imagen: "🧸",
        tamaño: "20 cm",
        materiales: "Hilo de algodón, relleno sintético, hilo de bordar"
    },
    {
        id: 2,
        nombre: "Conejito Blanco",
        precio: "$22.000",
        imagen: "🐰",
        tamaño: "18 cm",
        materiales: "Hilo de algodón blanco, relleno sintético, ojos de seguridad"
    },
    {
        id: 3,
        nombre: "Gatito Gris",
        precio: "$28.000",
        imagen: "🐱",
        tamaño: "22 cm",
        materiales: "Hilo de algodón gris, relleno sintético, hilo de bordar"
    },
    {
        id: 4,
        nombre: "Perrito Café",
        precio: "$30.000",
        imagen: "🐶",
        tamaño: "25 cm",
        materiales: "Hilo de algodón café, relleno sintético, ojos de seguridad"
    },
    {
        id: 5,
        nombre: "Panda",
        precio: "$27.000",
        imagen: "🐼",
        tamaño: "20 cm",
        materiales: "Hilo de algodón blanco y negro, relleno sintético"
    },
    {
        id: 6,
        nombre: "Elefante Azul",
        precio: "$26.000",
        imagen: "🐘",
        tamaño: "19 cm",
        materiales: "Hilo de algodón azul, relleno sintético, hilo de bordar"
    },
    {
        id: 7,
        nombre: "Ovejita",
        precio: "$24.000",
        imagen: "🐑",
        tamaño: "18 cm",
        materiales: "Hilo de algodón blanco, relleno sintético, hilo rizado"
    },
    {
        id: 8,
        nombre: "Unicornio",
        precio: "$32.000",
        imagen: "🦄",
        tamaño: "23 cm",
        materiales: "Hilo de algodón multicolor, relleno sintético, hilo dorado"
    }
];

// Elementos del DOM
const galleryView = document.getElementById('gallery-view');
const detailView = document.getElementById('detail-view');
const galleryGrid = document.getElementById('gallery-grid');
const detailContainer = document.getElementById('detail-container');
const backButton = document.getElementById('back-button');
const logoLink = document.getElementById('logo-link');

// Cargar productos en la galería
function cargarProductos() {
    galleryGrid.innerHTML = '';
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => navegarAProducto(producto.id);
        
        card.innerHTML = `
            <div class="product-image">${producto.imagen}</div>
            <div class="product-info">
                <div class="product-name">${producto.nombre}</div>
                <div class="product-price">${producto.precio}</div>
            </div>
        `;
        
        galleryGrid.appendChild(card);
    });
}

// Navegar a una página de producto (actualiza la URL)
function navegarAProducto(id) {
    window.location.hash = `producto-${id}`;
    mostrarDetalles(id);
}

// Mostrar detalles de un producto
function mostrarDetalles(id) {
    const producto = productos.find(p => p.id === id);
    
    if (!producto) {
        // Si el producto no existe, mostrar la galería
        mostrarGaleria();
        return;
    }
    
    // Actualizar el título de la página
    document.title = `${producto.nombre} - Tienda de Amigurumi`;
    
    detailContainer.innerHTML = `
        <div class="detail-header">
            <div class="detail-image">${producto.imagen}</div>
            <div class="detail-info">
                <h2>${producto.nombre}</h2>
                <div class="detail-price">${producto.precio}</div>
            </div>
        </div>
        <div class="detail-specs">
            <h3>Detalles del Producto</h3>
            <div class="spec-item">
                <span class="spec-label">Tamaño:</span>
                <span class="spec-value">${producto.tamaño}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Materiales:</span>
                <span class="spec-value">${producto.materiales}</span>
            </div>
        </div>
    `;
    
    galleryView.classList.add('hidden');
    detailView.classList.remove('hidden');
    
    // Scroll al inicio
    window.scrollTo(0, 0);
}

// Mostrar la galería
function mostrarGaleria() {
    document.title = 'Tejetejón - Amigurumis';
    detailView.classList.add('hidden');
    galleryView.classList.remove('hidden');
    window.location.hash = '';
    window.scrollTo(0, 0);
}

// Volver a la galería
backButton.onclick = () => {
    mostrarGaleria();
};

// Logo también lleva a la galería
logoLink.onclick = (e) => {
    e.preventDefault();
    mostrarGaleria();
};

// Gestionar el routing basado en el hash de la URL
function manejarRuta() {
    const hash = window.location.hash;
    
    if (hash.startsWith('#producto-')) {
        const id = parseInt(hash.replace('#producto-', ''));
        mostrarDetalles(id);
    } else {
        mostrarGaleria();
    }
}

// Escuchar cambios en el hash (navegación del navegador)
window.addEventListener('hashchange', manejarRuta);

// Inicializar
cargarProductos();
manejarRuta(); // Cargar la vista correcta al iniciar

