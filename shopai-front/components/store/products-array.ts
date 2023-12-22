import { create } from 'zustand';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

type ProductsState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  setProducts: (products) => set({ products })
}));
