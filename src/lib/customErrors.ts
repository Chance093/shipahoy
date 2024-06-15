export class AddressParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AddressParsingError";
  }
}

export class DuoplaneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuoplaneError";
  }
}

export class CostCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CostCalculationError";
  }
}
