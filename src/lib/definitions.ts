export type FormData = {
  [key: string]: string;
  FromCountry: string;
  FromName: string;
  FromCompany: string;
  FromPhone: string;
  FromStreet1: string;
  FromStreet2: string;
  FromCity: string;
  FromZip: string;
  FromState: string;
  ToCountry: string;
  ToName: string;
  ToCompany: string;
  ToPhone: string;
  ToStreet1: string;
  ToStreet2: string;
  ToCity: string;
  ToZip: string;
  ToState: string;
  Length: string;
  Height: string;
  Width: string;
  Weight: string;
  Reference: string;
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

export type DuoplaneResponseData = {
  id: number;
  public_reference: string;
  shipping_address: DuoplaneAddress;
  order_items: OrderItems;
}[];

export type Shipment = {
  id: number;
  weight: string;
};

export type PO = {
  duoplaneId: number;
  id: string;
  address: DuoplaneAddress;
  shipments: Shipment[];
  order_items: OrderItems;
};

export type PoOrders = PO[];

export type DuoplaneState = DuoplaneResponseData[number] & { active: boolean };

export type OrderItems = {
  id: string;
  quantity: number;
}[];

export type DuoplaneAddress = {
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

export type DuoplaneResponseHeaders = {
  "duoplane-total-count": string;
  "duoplane-has-next-page": boolean;
  "duoplane-requests-left": string;
  "duoplane-retry-after-seconds": string;
};

export type DuoplanePayload = {
  shipment: {
    shipper_name: string;
    shipment_items_attributes: {
      order_item_id: number;
      quantity: number;
    }[];
    shipment_trackings_attributes: {
      tracking: string;
    }[];
  };
};
