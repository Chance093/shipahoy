import { AxiosError } from "axios";

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

export class DuoplaneAxiosClientError extends AxiosError {
  constructor(message: string) {
    super(message);
    this.name = "DuoplaneAxiosClientError";
  }
}

export class DuoplaneAxiosRedirectError extends AxiosError {
  constructor(message: string) {
    super(message);
    this.name = "DuoplaneAxiosServerError";
  }
}

export class CostCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CostCalculationError";
  }
}
