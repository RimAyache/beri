
export interface PriceBucket {
  label: string;
  min: number;
  max: number | null;
}

export const config = {
  apiUrl: 'http://localhost:4000/api',
  productsApiUrl: 'https://fakestoreapi.com',

  httpStatus: {
    unauthorized: 401,
    notFound: 404,
  },

  auth: {
    minPasswordLength: 6,
  },

  cart: {
    maxQuantityPerItem: 10,
    giftWrapPrice: 10,
    freeShippingThreshold: 75,
    shippingFee: 10,
  },

  home: {
    featuredProductCount: 6,
    galleryTileCount: 5,
  },

  shop: {
    pageSize: 9,
    priceBuckets: [
      { label: 'Under $25', min: 0, max: 25 },
      { label: '$25 - $50', min: 25, max: 50 },
      { label: '$50 - $100', min: 50, max: 100 },
      { label: '$100 & Above', min: 100, max: null },
    ] as PriceBucket[],
  },

  productDetail: {
    relatedProductsLimit: 4,
    discountPercent: 20,
    stockBarReference: 50,
    demoCountdown: '05:23:47',
  },

  rating: {
    starCount: 5,
  },

  percentMax: 100,

  statCard: {
    sparklineWidth: 100,
    sparklineHeight: 30,
  },

  admin: {
    gridPageSize: 10,
    grid: {
      idColumnMaxWidth: 90,
      orderIdColumnMaxWidth: 140,
      dateColumnMaxWidth: 140,
      actionColumnMaxWidth: 100,
      nameColumnFlex: 1,
      descriptionColumnFlex: 2,
      borderRadius: 8,
    },
  },

  gridTheme: {
    accentColor: '#7b1e3b',
    fontFamily: 'Poppins, sans-serif',
    headerFontFamily: 'Volkhov, serif',
    headerBackgroundColor: '#2e1118',
    headerTextColor: '#ffffff',
  },

  locale: {
    id: 'en-US',
    currency: 'USD',
  },
};
