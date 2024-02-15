'use strict';

interface Pricing {
 upperRelationalConstant: number;
 price: number | null;
}

function getPricing(userPricing: string): Pricing[] {
  switch (userPricing) {
    case 'internal':
      return [
        { upperRelationalConstant: 1, price: null },
        { upperRelationalConstant: 8, price: 5.5 },
        { upperRelationalConstant: 15, price: 11 },
        { upperRelationalConstant: 25, price: 11.5 },
        { upperRelationalConstant: 35, price: 12 },
        { upperRelationalConstant: 45, price: 12.5 },
        { upperRelationalConstant: 55, price: 12.5 },
        { upperRelationalConstant: 65, price: null },
        { upperRelationalConstant: 70, price: 12.5 }
      ];
    case 'external':
      return [
        { upperRelationalConstant: 1, price: 6 },
        { upperRelationalConstant: 8, price: 7 },
        { upperRelationalConstant: 15, price: 12  },
        { upperRelationalConstant: 25, price: 14  },
        { upperRelationalConstant: 35, price: 16  },
        { upperRelationalConstant: 45, price: 18  },
        { upperRelationalConstant: 55, price: 20  },
        { upperRelationalConstant: 65, price: 22  },
        { upperRelationalConstant: 70, price: 24  }
      ];
    default:
      return [
        { upperRelationalConstant: 1, price: 6 },
        { upperRelationalConstant: 8, price: 7 },
        { upperRelationalConstant: 15, price: 12  },
        { upperRelationalConstant: 25, price: 14  },
        { upperRelationalConstant: 35, price: 16  },
        { upperRelationalConstant: 45, price: 18  },
        { upperRelationalConstant: 55, price: 20  },
        { upperRelationalConstant: 65, price: 22  },
        { upperRelationalConstant: 70, price: 24  }
      ];
  }
}

function getlistOfLabelWeights(payload: any): number[] {
  const listOfLabelWeights: number[] = [];
  for (const label of payload) listOfLabelWeights.push(label.weight);
  return listOfLabelWeights;
}

function calculateTotalPrice(listOfLabelWeights: number[], pricing: Pricing[]): number {
  let totalPrice = 0;

  for (const weight of listOfLabelWeights) {
    const weightGroup = pricing.find((group) => weight <= group.upperRelationalConstant);

    if (weightGroup && weightGroup.price) {
      totalPrice += weightGroup.price;
    }
  }

  return totalPrice;
}

function helper() {
  const payload = [
    {
      weight: .5,
    },
    {
      weight: 7,
    },
    {
      weight: 37,
    },
    {
      weight: 43,
    },
    {
      weight: 22,
    },
    {
      weight: 8,
    },
    {
      weight: 19,
    },
    {
      weight: 55,
    },
    {
      weight: 62,
    },
    {
      weight: 64,
    },
    {
      weight: 68,
    },
    {
      weight: 52,
    },
    {
      weight: .8,
    },
    {
      weight: 2,
    },
    {
      weight: 31,
    },
    {
      weight: 12,
    },
    {
      weight: 10,
    },
    {
      weight: 48,
    },
    {
      weight: 23,
    },
  ];
  const listOfLabelWeights: number[] = getlistOfLabelWeights(payload);
  const clientCategory = 'internal';
  const pricing: Pricing[] = getPricing(clientCategory);
  const totalPrice = calculateTotalPrice(listOfLabelWeights, pricing);
  totalPrice;
}

helper();

