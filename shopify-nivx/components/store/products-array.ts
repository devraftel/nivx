import { create } from 'zustand';

export type MYProduct = {
  shopifyid: string;
  title: string;

  description: string;
  image: string;
  handle: string;
};

type ProductsState = {
  products: MYProduct[];
  setProducts: (products: MYProduct[]) => void;
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  setProducts: (products) => set({ products })
}));
