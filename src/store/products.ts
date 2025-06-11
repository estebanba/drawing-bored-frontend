import { create } from "zustand";
import axios from "axios";

// Product type
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// Zustand store state and actions for products
interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

// Zustand store for products CRUD
export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch all products from backend
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/mysql/products");
      set({ products: res.data.products || [] });
    } catch {
      set({ error: "Failed to fetch products" });
    } finally {
      set({ loading: false });
    }
  },

  // Add a new product
  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      await axios.post("/mysql/products", product);
      await get().fetchProducts(); // Refresh list
    } catch {
      set({ error: "Failed to add product" });
    } finally {
      set({ loading: false });
    }
  },

  // Update an existing product
  updateProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/mysql/products/${product.id}`, product);
      await get().fetchProducts(); // Refresh list
    } catch {
      set({ error: "Failed to update product" });
    } finally {
      set({ loading: false });
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/mysql/products/${id}`);
      await get().fetchProducts(); // Refresh list
    } catch {
      set({ error: "Failed to delete product" });
    } finally {
      set({ loading: false });
    }
  },
}));
