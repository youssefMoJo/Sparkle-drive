const pricingData = {
  carTypes: {
    Cydan: {
      Exterior: {
        "Basic Clean": 1000,
        "Premium Shine": 2000,
        "Ultimate Spa": 3000,
      },
      Interior: 100,
      Both: {
        "Basic Clean": 1,
        "Premium Shine": 2,
        "Ultimate Spa": 3,
      },
    },
    SUV: {
      Exterior: {
        "Basic Clean": 4000,
        "Premium Shine": 5000,
        "Ultimate Spa": 6000,
      },
      Interior: 200,
      Both: {
        "Basic Clean": 4,
        "Premium Shine": 5,
        "Ultimate Spa": 6,
      },
    },
    Truck: {
      Exterior: {
        "Basic Clean": 7000,
        "Premium Shine": 8000,
        "Ultimate Spa": 9000,
      },
      Interior: 300,
      Both: {
        "Basic Clean": 7,
        "Premium Shine": 8,
        "Ultimate Spa": 9,
      },
    },
  },
  totalPrices: 0,
};

export default pricingData;
