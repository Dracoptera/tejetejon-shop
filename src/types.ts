export interface Producto {
  id: string;
  nombre: string;
  precio: string;
  tamaño: string;
  materiales: string;
  images?: string[]; // rutas relativas en /public/media
  notas?: string; // notas o descripción opcional del producto
}

