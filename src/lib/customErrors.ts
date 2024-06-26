import { AxiosError } from "axios";

// * Error used for bad request with Smarty Parsing API
// TODO: Use this error properly. Replace all instances with FormUIError
export class AddressParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AddressParsingError";
  }
}

// * Error used when I want duoplane error to be displayed on duoplane table
export class DuoplaneAxiosClientError extends AxiosError {
  constructor(message: string) {
    super(message);
    this.name = "DuoplaneAxiosClientError";
  }
}

// * Error used when I want duoplane error to be displayed on error.tsx page
export class DuoplaneAxiosRedirectError extends AxiosError {
  constructor(message: string) {
    super(message);
    this.name = "DuoplaneAxiosServerError";
  }
}

// * Error used when something goes wrong in cost calculation function
export class CostCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CostCalculationError";
  }
}

// * Error used when labels were created in weship but failed to store in db
export class LabelCreationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LabelCreationError";
  }
}

// * Error used when an error needs to be rendered on form
export class FormUIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormUIError";
  }
}

// * Error for Balance Update TRPC Procedure
export class BalanceUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BalanceUpdateError";
  }
}

// * Error for creating a shipment through duoplane api
export class DuoplaneCreateShipmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuoplaneCreateShipmentError";
  }
}

// * Error for Label Upload TRPC Procedure
export class LabelUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LabelUploadError";
  }
}

// * Error for Order and Label Count TRPC procedure
export class OrderAndLabelCountError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderAndLabelCountError";
  }
}
