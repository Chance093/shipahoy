export type FormDataType = {
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

export type HandleChange = (fields: Partial<FormDataType>) => void;
export type UpdateWeight = (value: string) => void;
