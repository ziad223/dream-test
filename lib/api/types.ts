/**
 * Etrolley API Types based on Postman Collection
 */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  errors?: any;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
}

export interface StoreInfo {
  name: string;
  primary_color?: string;
  secondry_color?: string;
  country?: {
    id: number;
    code: string;
    flag: string;
    phone_length: number;
    unit: {
      ar: string;
      en: string;
    };
  };
  auth?: {
    type: number;
    sms_type: string;
    master_code: string;
  };
  seo?: {
    id: number;
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    key_word: { ar: string; en: string };
    meta_tag?: string;
    og_title?: { ar: string; en: string };
    og_description?: { ar: string; en: string };
    og_image?: string;
  };
  images?: {
    logo: string;
    footer_logo: string;
    fav_icon: string;
  };
  tax?: any;
  theme?: {
    id: number;
    name: string;
    header: string;
    footer: string;
    [key: string]: any;
  };
  is_gift?: boolean;
  is_delivery_later?: boolean;
  api_key_map?: string;
  is_last_news?: boolean;
  setting?: {
    product_layout?: string;
    option_layout?: string;
    product_box?: string;
    product_image?: string;
    coupon_active?: boolean;
    back_top?: boolean;
    cart_sticky?: boolean;
    cart_type?: string;
    theme_mode?: string;
    is_party_effect?: boolean;
    is_logout_message?: boolean;
    logout_message_text?: string;
    tagline?: string;
    second_tagline?: string;
    lang?: string;
    basic_lang?: string;
    is_services?: boolean;
    services_title?: string;
    is_step?: boolean;
    is_team?: boolean;
    steps_title?: string;
    team_title?: string;
    team_sub_title?: string;
    is_gift?: boolean;
    is_delivery_later?: boolean;
    is_guest_order?: boolean;
    is_digit_price?: boolean;
    is_metal?: boolean;
    is_map?: boolean;
    shop_page?: string;
    shop_image?: string;
    login_image?: string;
    logout_image?: string;
    empty_image?: string;
  };
  [key: string]: any;
}

export interface MainCategory {
  id: number;
  name: string | { en: string; ar: string };
  slug?: string;
  icon?: string | null;
  image?: string | null;
  sort?: number;
  direct_products_count?: number;
  sub_products_count?: number;
  total_products_count?: number;
  children_count?: number;
  sub_categories?: MainCategory[];
}

export interface CategoryDetailFilter {
  id: number;
  name: string;
  type?: string;
  price?: number;
  values?: { id: number; value_market_id?: number; name: string }[];
}

export interface CategoryDetailPrice {
  id: number;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  text?: string;
  value: string;
}

export interface CategoryDetailResponse {
  id: number;
  name: string;
  sub_categories?: any[];
  filters?: CategoryDetailFilter[];
  prices?: CategoryDetailPrice[];
  [key: string]: any;
}

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  old_price?: number | null;
  image?: string;
  images?: { id: number; image_path: string; thump_path?: string }[];
  is_favorit?: boolean;
  is_option?: number;
  qty?: number;
  rate?: number;
  count_rate?: number;
  category?: string | null;
  sku?: string;
  description?: string;
  sub_description?: string;
  similar_products?: ProductItem[];
  [key: string]: any;
}

export interface ProductFilterParams {
  section_id?: string | number;
  category_id?: string | number;
  brand_ids?: (string | number)[];
  from?: number;
  to?: number;
  rating?: number;
  word?: string;
  sort?: "sale_price" | "created_at" | "rate" | string;
  order_by?: "asc" | "desc";
  per_page?: number;
  page?: number;
  is_favourite?: boolean;
}

export interface UserAddress {
  id?: number;
  title: string;
  city_id: number;
  region_id?: number;
  street: string;
  building?: string;
  other_details?: string;
  lat?: number;
  long?: number;
}

export interface CountryItem {
  id: number;
  name: string;
  code?: string;
  flag?: string;
  currency?: string;
  currency_symbol?: string;
}

export interface CityItem {
  id: number;
  name: string;
  country_id?: number;
}

export interface RegionItem {
  id: number;
  name: string;
  city_id?: number;
}

export interface AuthLoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    image?: string;
  };
}

