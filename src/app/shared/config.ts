import { PriceBucket } from './models/shop.model';

export const config = {
  apiUrl: 'http://localhost:4000/api',
  productsApiUrl: 'https://fakestoreapi.com',

  httpStatus: {
    unauthorized: 401,
    notFound: 404,
  },

  auth: {
    minPasswordLength: 6,
    fallbackToken: 60 * 60 * 1000,
  },

  cart: {
    maxQuantityPerItem: 10,
    freeShippingThreshold: 75,
    shippingFee: 10,
    storageKey: 'beri.cart',
  },

  home: {
    featuredProductCount: 6,
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
    saleCountdownSeconds: 5 * 60 * 60 + 23 * 60 + 47,
  },

  time: {
    tickIntervalMs: 1000,
    msPerSecond: 1000,
    secondsPerMinute: 60,
    minutesPerHour: 60,
    clockDigits: 2,
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

  owner: {
    name: 'Rim Ayache',
    role: 'Computer Engineering Student & Developer',
    location: 'Beirut, Lebanon',
    email: 'rim.ayache@lau.edu',
  },

  support: {
    email: 'support@beri.com',
    phone: '+1 (800) 555-0142',
    hours: 'Monday to Friday, 9:00 – 18:00 (GMT)',
    responseTime: 'within one business day',
  },
};
