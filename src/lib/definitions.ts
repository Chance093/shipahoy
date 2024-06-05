export type FormData = {
  [key: string]: string;
  FromCountry: string;
  FromName: string;
  FromCompany: string;
  FromPhone: string;
  FromStreet: string;
  FromStreet2: string;
  FromCity: string;
  FromZip: string;
  FromState: string;
  ToCountry: string;
  ToName: string;
  ToCompany: string;
  ToPhone: string;
  ToStreet: string;
  ToStreet2: string;
  ToCity: string;
  ToZip: string;
  ToState: string;
  Length: string;
  Height: string;
  Width: string;
  Weight: string;
};

export type Pricing = {
  zeroToFour: string;
  fourToEight: string;
  eightToFifteen: string;
  fifteenToTwentyFive: string;
  twentyFiveToThirtyFive: string;
  thirtyFiveToFortyFive: string;
  fortyFiveToFiftyFive: string;
  fiftyFiveToSixtyFive: string;
  sixtyFiveToSeventy: string;
};

export type ShippingHistory = {
  id: number;
  createdAt: Date | null;
  labelCount: number;
  totalPrice: string;
  pdfLink: string;
  csvLink: string;
  zipLink: string;
  shippingService: {
    service: string;
  };
}[];

export type Invoices = {
  id: number;
  amount: string;
  paymentMethod: string;
  createdAt: Date | null;
  paymentStatus: {
    status: string | null;
  };
}[];

export type HandleChange = (fields: Partial<FormData>) => void;
export type UpdateWeight = (value: string) => void;

export type Payload = Record<string, string>;

export type Links = {
  pdf: string;
  csv: string;
  zip: string;
};

export type ParsedResponse = { links: Links; tracking: string[]; labelPrices: string[] };

export type ResponseData = {
  type: string;
  message: string;
  bulkOrder: BulkOrder;
};

interface BulkOrder {
  _id: string;
  user: string;
  orders: Order[];
  labelType: string;
  total: number;
  status: string;
  uuid: string;
  csv: string;
  pdf: string;
  zip: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  csvLink: string;
  pdfLink: string;
  zipLink: string;
}

interface Order {
  _id: string;
  uuid: string;
  user: string;
  isApi: boolean;
  labelType: LabelType;
  price: number;
  status: string;
  pdf: string;
  tracking: string;
  tracking_details: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LabelType {
  _id: string;
  name: string;
  uid: string;
}

export type ErrorFlagDetails = Array<string | number | Map<string, number[]> | undefined>;

export type ParsedAddressResponse = {
  data: {
    components: {
      city_name: string;
      default_city_name: string;
      delivery_point: string;
      delivery_point_check_digit: string;
      plus4_code: string;
      primary_number: string;
      secondary_designator: string | undefined;
      secondary_number: string | undefined;
      state_abbreviation: string;
      street_name: string;
      street_predirection: string | undefined;
      street_postdirection: string | undefined;
      street_suffix: string;
      zipcode: string;
    };
  }[];
};

export type FormattedAddress = {
  address: string;
  addressTwo: string;
  zipcode: string;
  city: string;
  state: string;
};

export type duoplaneResponseData = {
  public_reference: string;
  shipping_address: {
    first_name: string;
    last_name: string;
    company_name: string;
    address_1: string;
    address_2: string | null;
    city: string;
    province: string;
    province_iso: string;
    post_code: string;
    country: string;
  };
}[];

export type PartialShipment = {
  weight: string;
  qty: number;
};

export type PO = {
  id: string;
  buyer: string;
  address: string;
  partialShipments: PartialShipment[];
};

export type Shipments = (PO | undefined)[];
