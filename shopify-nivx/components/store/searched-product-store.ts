import { create } from 'zustand';

export type SearchedProduct = {
  shopifyid: string;
  title: string;
  description: string;
  image: string;
  handle: string;
};

type SearchedProductsState = {
  products: SearchedProduct[];
  // eslint-disable-next-line no-unused-vars
  setProducts: (products: SearchedProduct[]) => void;
};

export const useSearchedProductsStore = create<SearchedProductsState>((set) => ({
  products: [],
  setProducts: (products) => set({ products })
}));
