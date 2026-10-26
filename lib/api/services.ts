import { apiClient, STORE_SLUG } from "./client";
import {
  ApiResponse,
  StoreInfo,
  MainCategory,
  ProductItem,
  ProductFilterParams,
  UserAddress,
  AuthLoginResponse,
} from "./types";

export const etrolleyApi = {
  // -------------------------------------------------------------
  // 1. Setting & Home Store Endpoints
  // -------------------------------------------------------------
  getStoreInfo: async (slug: string = STORE_SLUG) => {
    return apiClient<ApiResponse<StoreInfo>>(`/api/v1/store/${slug}/info`);
  },

  getStoreHome: async (slug: string = STORE_SLUG) => {
    return apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/home/v1`).catch(() =>
      apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/home`)
    );
  },

  getStoreHomeV1: async (slug: string = STORE_SLUG) => {
    return apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/home/v1`);
  },

  // -------------------------------------------------------------
  // 2. Categories
  // -------------------------------------------------------------
  getMainCategories: async (params?: {
    search?: string;
    sort_by?: string;
    per_page?: number;
    page?: number;
    slug?: string;
  }) => {
    const slug = params?.slug || STORE_SLUG;
    return apiClient<ApiResponse<{ data: MainCategory[]; meta?: any; links?: any }>>(
      `/api/v1/store/${slug}/main-categories`,
      {
        params: {
          search: params?.search,
          sort_by: params?.sort_by,
          per_page: params?.per_page || 10,
          page: params?.page || 1,
        },
      }
    );
  },

  getCategoryById: async (id: number | string, slug: string = STORE_SLUG) => {
    return apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/main-categories/${id}`).catch(() =>
      apiClient<ApiResponse<any>>(`/main-categories/${id}`)
    );
  },

  // -------------------------------------------------------------
  // 3. Products
  // -------------------------------------------------------------
  getProducts: async (params?: ProductFilterParams, slug: string = STORE_SLUG) => {
    return apiClient<ApiResponse<ProductItem[]>>(
      `/api/v1/store/${slug}/products/filter`,
      {
        params: params as any,
      }
    );
  },

  getProductById: async (productId: number | string, slug: string = STORE_SLUG) => {
    return apiClient<ApiResponse<{ id: number; product: ProductItem; images?: any[]; similar_products?: ProductItem[] }>>(
      `/${slug}/products/${productId}`
    );
  },

  toggleFavorite: async (productId: number, slug: string = STORE_SLUG) => {
    const params = new URLSearchParams();
    params.append("product_id", String(productId));

    return apiClient<ApiResponse<any>>(
      `/api/v1/store/${slug}/products/favorite/toggle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    ).catch(() =>
      apiClient<ApiResponse<any>>(`/${slug}/products/favorite/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })
    );
  },

  matchProductOptions: async (productId: number, values: number[], slug: string = STORE_SLUG) => {
    const params = new URLSearchParams();
    params.append("product_id", String(productId));
    values.forEach((v, index) => {
      params.append(`values[${index}]`, String(v));
    });

    return apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/product-options/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }).catch(() =>
      apiClient<ApiResponse<any>>(`/${slug}/product-options/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })
    );
  },

  // -------------------------------------------------------------
  // 4. Cart & Checkout
  // -------------------------------------------------------------
  syncCart: async (items: { product_id: number; quantity: number; total_price?: number; [key: string]: any }[], slug: string = STORE_SLUG) => {
    // Backend expects form-urlencoded: items[0][product_id], items[0][quantity], items[0][total_price]
    const buildBody = (currentItems: typeof items) => {
      const params = new URLSearchParams();
      currentItems.forEach((item, index) => {
        params.append(`items[${index}][product_id]`, String(item.product_id));
        params.append(`items[${index}][quantity]`, String(item.quantity));
        if (item.total_price !== undefined) {
          params.append(`items[${index}][total_price]`, String(item.total_price));
        }
      });
      return params.toString();
    };

    const sendRequest = (bodyStr: string) =>
      apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyStr,
      }).catch(() =>
        apiClient<ApiResponse<any>>(`/${slug}/cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyStr,
        })
      );

    try {
      return await sendRequest(buildBody(items));
    } catch (err: any) {
      // Backend validates total_price strictly against database price:
      // "message.totalprice_error message.true_price 120"
      const message = err?.message || err?.data?.message || "";
      const match = message.match(/true_price\s+([0-9.]+)/);
      if (match && match[1]) {
        const correctSinglePrice = parseFloat(match[1]);
        const adjustedItems = items.map((it) => ({
          ...it,
          total_price: Number((correctSinglePrice * it.quantity).toFixed(2)),
        }));
        return await sendRequest(buildBody(adjustedItems));
      }
      throw err;
    }
  },

  initCheckout: async (items: {
    product_id: number;
    quantity: number;
    total_price: number;
    option_check?: any[];
    final_option?: number;
  }[]) => {
    return apiClient<ApiResponse<any>>("/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
          total_price: Number(it.total_price.toFixed ? it.total_price.toFixed(2) : it.total_price),
          option_check: it.option_check || [],
          ...(it.final_option !== undefined ? { final_option: it.final_option } : {}),
        })),
      }),
    });
  },

  createOrder: async (items: {
    product_id: number;
    quantity: number;
    total_price: number;
    option_check?: any[];
    final_option?: number;
  }[]) => {
    return etrolleyApi.initCheckout(items);
  },

  // -------------------------------------------------------------
  // 5. Authentication & Profile
  // -------------------------------------------------------------
  login: async (credentials: { identifier: string; type?: "email" | "phone"; password: string }, slug: string = STORE_SLUG) => {
    const params = new URLSearchParams();
    params.append("type", credentials.type || (credentials.identifier.includes("@") ? "email" : "phone"));
    params.append("identifier", credentials.identifier.trim());
    params.append("password", credentials.password);

    return apiClient<ApiResponse<AuthLoginResponse>>(`/api/v1/store/${slug}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  },

  checkAndSendOtp: async (identifier: string, type?: "phone" | "email", slug: string = STORE_SLUG) => {
    const detectedType = type || (identifier.includes("@") ? "email" : "phone");
    const params = new URLSearchParams();
    params.append("type", detectedType);
    params.append("identifier", identifier.trim());

    return apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/auth/check-and-send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  },

  verifyRegisterOtp: async (data: {
    identifier: string;
    type?: "email" | "phone";
    code: string;
  }, slug: string = STORE_SLUG) => {
    const detectedType = data.type || (data.identifier.includes("@") ? "email" : "phone");
    const params = new URLSearchParams();
    params.append("type", detectedType);
    params.append("identifier", data.identifier.trim());
    params.append("code", data.code.trim());

    return apiClient<ApiResponse<{ token: string }>>(`/api/v1/store/${slug}/auth/verify-register-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  },

  register: async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    token: string;
  }, slug: string = STORE_SLUG) => {
    const params = new URLSearchParams();
    params.append("token", data.token);
    params.append("name", data.name);
    params.append("email", data.email);
    if (data.phone) params.append("phone", data.phone);
    params.append("password", data.password);
    params.append("password_confirmation", data.password_confirmation);

    return apiClient<ApiResponse<AuthLoginResponse>>(`/api/v1/store/${slug}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  },

  forgotPassword: async (identifier: string, type?: "email" | "phone", slug: string = STORE_SLUG) => {
    const detectedType = type || (identifier.includes("@") ? "email" : "phone");
    const params = new URLSearchParams();
    params.append("type", detectedType);
    params.append("identifier", identifier.trim());

    return apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  },

  verifyResetCode: async (data: { identifier: string; code: string; type?: "email" | "phone" }, slug: string = STORE_SLUG) => {
    const detectedType = data.type || (data.identifier.includes("@") ? "email" : "phone");
    const params = new URLSearchParams();
    params.append("type", detectedType);
    params.append("identifier", data.identifier.trim());
    params.append("code", data.code.trim());

    return apiClient<ApiResponse<{ reset_token: string }>>(`/api/v1/store/${slug}/auth/verify-reset-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  },

  resetPassword: async (data: {
    reset_token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }, slug: string = STORE_SLUG) => {
    const params = new URLSearchParams();
    params.append("reset_token", data.reset_token);
    params.append("email", data.email);
    params.append("password", data.password);
    params.append("password_confirmation", data.password_confirmation);

    return apiClient<ApiResponse<any>>(`/api/v1/store/${slug}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  },

  getProfile: async () => {
    return apiClient<ApiResponse<any>>("/auth/profile");
  },

  updateProfile: async (data: { name: string; phone?: string; email: string }) => {
    return apiClient<ApiResponse<any>>("/auth/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      }),
    });
  },

  updateProfilePassword: async (password: string, password_confirmation: string) => {
    const formData = new FormData();
    formData.append("password", password);
    formData.append("password_confirmation", password_confirmation);
    return apiClient<ApiResponse<any>>("/auth/profile/update-password", {
      method: "POST",
      body: formData,
    });
  },

  updateProfileImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    return apiClient<ApiResponse<any>>("/auth/profile/update-image", {
      method: "POST",
      body: formData,
    });
  },

  getUserOrders: async () => {
    return apiClient<ApiResponse<any>>("/auth/profile/orders");
  },

  getWallet: async () => {
    return apiClient<ApiResponse<any>>("/auth/wallet");
  },

  getPoints: async () => {
    return apiClient<ApiResponse<any>>("/auth/points");
  },

  // -------------------------------------------------------------
  // 6. User Addresses & Locations (Countries, Cities, Regions)
  // -------------------------------------------------------------
  getCountries: async (slug: string = STORE_SLUG) => {
    return apiClient<ApiResponse<any[]>>(`/api/v1/store/${slug}/market/countries`).catch(() =>
      apiClient<ApiResponse<any[]>>("/api/v1/store/elegant-fashion/market/countries")
    );
  },

  getCitiesByCountry: async (countryId: number | string) => {
    return apiClient<ApiResponse<any[]>>(`/market/countries/${countryId}/cities`).catch(() =>
      apiClient<ApiResponse<any[]>>(`/api/v1/store/${STORE_SLUG}/market/countries/${countryId}/cities`)
    );
  },

  getActiveRegionsByCity: async (cityId: number | string) => {
    return apiClient<ApiResponse<any[]>>(`/api/market/${cityId}/active-regions`).catch(() =>
      apiClient<ApiResponse<any[]>>(`/api/v1/store/${STORE_SLUG}/market/${cityId}/active-regions`)
    );
  },

  getAddresses: async () => {
    return apiClient<ApiResponse<UserAddress[]>>("/user/addresses");
  },

  getAddressById: async (addressId: number | string) => {
    return apiClient<ApiResponse<UserAddress>>(`/user/addresses/${addressId}`);
  },

  saveAddress: async (address: UserAddress) => {
    return apiClient<ApiResponse<any>>("/user/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
    });
  },

  updateAddress: async (id: number | string, address: UserAddress) => {
    return apiClient<ApiResponse<any>>(`/user/addresses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
    });
  },

  deleteAddress: async (id: number | string) => {
    return apiClient<ApiResponse<any>>(`/user/addresses/${id}`, {
      method: "DELETE",
    });
  },

  // -------------------------------------------------------------
  // 7. Orders
  // -------------------------------------------------------------
  getOrderById: async (orderId: number | string) => {
    return apiClient<ApiResponse<any>>(`/orders/${orderId}`);
  },

  cancelOrder: async (orderId: number | string) => {
    return apiClient<ApiResponse<any>>(`/orders/${orderId}/cancel`);
  },

  // -------------------------------------------------------------
  // 8. Notifications
  // -------------------------------------------------------------
  getNotifications: async () => {
    return apiClient<ApiResponse<any>>("/notifications");
  },

  clearAllNotifications: async () => {
    return apiClient<ApiResponse<any>>("/notifications/clear-all", {
      method: "DELETE",
    });
  },

  deleteNotification: async (id: number | string) => {
    return apiClient<ApiResponse<any>>(`/notifications/${id}`, {
      method: "DELETE",
    });
  },
};
