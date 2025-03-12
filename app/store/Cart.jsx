import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/app/store/Auth";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      // Get user's cart
      getCart: async () => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${SERVER_API}/cart`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            set({ cart: data.data });
            return { success: true, data: data.data };
          } else {
            throw new Error(data.message || 'Failed to fetch cart');
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Add item to cart
      addToCart: async (productId, quantity = 1) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${SERVER_API}/cart/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ productId, quantity })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
          }
          
          if (data.success) {
            set({ cart: data.data });
            return { success: true, data: data.data };
          } else {
            throw new Error(data.message || 'Failed to add item to cart');
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Update cart item quantity
      updateCartItem: async (itemId, quantity) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${SERVER_API}/cart/item/${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ quantity })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
          }
          
          if (data.success) {
            set({ cart: data.data });
            return { success: true, data: data.data };
          } else {
            throw new Error(data.message || 'Failed to update cart item');
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Remove item from cart
      removeCartItem: async (itemId) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${SERVER_API}/cart/item/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
          }
          
          if (data.success) {
            set({ cart: data.data });
            return { success: true, data: data.data };
          } else {
            throw new Error(data.message || 'Failed to remove item from cart');
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      checkout: async (paymentMethod, customerInfo) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${SERVER_API}/cart/checkout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ paymentMethod, customerInfo })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
          }
          
          if (data.success) {
            // Reset cart after successful checkout
            set({ cart: null });
            return { 
              success: true, 
              data: data.data,
              message: 'Checkout completed successfully'
            };
          } else {
            throw new Error(data.message || 'Failed to complete checkout');
          }
        } catch (error) {
          set({ error: error.message });
          return { 
            success: false, 
            message: error.message,
            // If there are unavailable items, pass them along
            unavailableItems: error.unavailableItems || []
          };
        } finally {
          set({ loading: false });
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${SERVER_API}/cart/clear`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
          }
          
          if (data.success) {
            set({ cart: data.data });
            return { success: true, data: data.data };
          } else {
            throw new Error(data.message || 'Failed to clear cart');
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },
      
      // Add to cart from QR code (reusing existing function from product store)
      addToCartFromQrCode: async (productId, quantity = 1) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          const response = await fetch(`${SERVER_API}/product/qr/${productId}/add-to-cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ quantity })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to add product to cart');
          }
          
          if (data.success) {
            set({ cart: data.data });
            return { success: true, data: data.data };
          } else {
            throw new Error(data.message || 'Failed to add product to cart');
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Admin function to get all carts
      getAllCarts: async (params = {}) => {
        try {
          set({ loading: true, error: null });
          const accessToken = useAuthStore.getState().accessToken;
          
          if (!accessToken) {
            throw new Error('Authentication required');
          }
          
          // Build query string from params
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, value);
            }
          });
          
          const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
          
          const response = await fetch(`${SERVER_API}/cart/all${queryString}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.success) {
            return { 
              success: true, 
              data: data.data, 
              total: data.total, 
              totalPages: data.totalPages, 
              currentPage: data.currentPage 
            };
          } else {
            throw new Error(data.message || 'Failed to fetch carts');
          }
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Reset cart data
      clearCartData: () => {
        set({ 
          cart: null,
          error: null
        });
      }
    }),
    {
      name: "cart-store",
      getStorage: () => localStorage,
    }
  )
);