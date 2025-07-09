// src/types/Category.ts
// Define o tipo das categorias processadas no frontend
export interface Category {
    id: string; // Um ID único gerado no frontend (usaremos o slug)
    title: string; // Nome da categoria (mapeado de BackendProduct.categoria)
    slug: string; // Slug derivado do nome da categoria
    count: number; // Contagem de produtos nesta categoria
}