import { CostCalculationError } from "./customErrors";
import { type Pricing } from "./definitions";

export const calculateCost = (weights: string[], pricing: Pricing) => {
  if (weights.length === 0) throw new CostCalculationError("Could not calculate cost: No weights given.");

  const prices = weights.map((stringWeight) => {
    const weight = Number(stringWeight);
    switch (true) {
      case weight <= 0 || weight > 70: {
        throw new CostCalculationError("Weight must be between 0 and 70");
      }
      case weight <= 3.99:
        return pricing.zeroToFour;
      case weight <= 7.99:
        return pricing.fourToEight;
      case weight <= 14.99:
        return pricing.eightToFifteen;
      case weight <= 24.99:
        return pricing.fifteenToTwentyFive;
      case weight <= 34.99:
        return pricing.twentyFiveToThirtyFive;
      case weight <= 44.99:
        return pricing.thirtyFiveToFortyFive;
      case weight <= 54.99:
        return pricing.fortyFiveToFiftyFive;
      case weight <= 64.99:
        return pricing.fiftyFiveToSixtyFive;
      case weight <= 70:
        return pricing.sixtyFiveToSeventy;
      default:
        throw new CostCalculationError("Invalid weight");
    }
  });

  return prices;
};
