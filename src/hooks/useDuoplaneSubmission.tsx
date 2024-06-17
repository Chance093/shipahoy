"use client";
import { type FormEvent, useState } from "react";
import { CostCalculationError, DuoplaneError } from "~/lib/customErrors";
import { type Pricing, type Shipments } from "~/lib/definitions";

export default function useDuoplaneSubmission(shipments: Shipments, pricing: Pricing) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmationDisplayed, setIsConfirmationDisplayed] = useState(false);
  const [labelPrices, setLabelPrices] = useState<string[]>([]);

  const submitDuoplane = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      validateShipments(shipments);

      const weights: string[] = [];
      shipments.forEach((shipment) => shipment.partialShipments.forEach((partial) => weights.push(partial.weight)));

      const prices = calculateDuoplaneCost(weights, pricing);
      setLabelPrices(prices);

      setIsConfirmationDisplayed(true);
    } catch (err) {
      if (err instanceof DuoplaneError) {
        setErrorMessage(err.message);
      } else {
        throw err;
      }
    }
  };

  const validateShipments = (shipments: Shipments) => {
    if (shipments.length === 0) throw new DuoplaneError("Please add a shipment.");

    shipments.forEach((shipment) => {
      shipment.partialShipments.forEach((partialShipment) => {
        if (partialShipment.weight === "") throw new DuoplaneError(`PO ${shipment.id}: Empty weight fields must be filled out or deleted.`);
        if (!Number.isInteger(Number(partialShipment.weight)) || Number.isNaN(Number(partialShipment.weight)))
          throw new DuoplaneError(`PO ${shipment.id}: All weight fields must be whole numbers`);

        if (Number(partialShipment.weight) <= 0 || Number(partialShipment.weight) > 70)
          throw new DuoplaneError(`PO ${shipment.id}: All weight fields must be between 0 - 70 lbs.`);
      });
    });
  };

  const calculateDuoplaneCost = (weights: string[], pricing: Pricing) => {
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
  return { labelPrices, errorMessage, isConfirmationDisplayed, setIsConfirmationDisplayed, submitDuoplane };
}
