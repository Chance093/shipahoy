import { zipCodeRegex, phoneNumberRegex } from "~/lib/regex";

export const formInputs = [
  { id: 31, label: "Name", property: "FromName", required: true },
  { id: 32, label: "Company Name", property: "FromCompany", required: false },
  { id: 33, label: "Address", property: "FromStreet", required: true },
  { id: 34, label: "Address 2 (Optional)", property: "FromStreet2", required: false },
  { id: 35, label: "Zip Code", property: "FromZip", required: true, regEx: zipCodeRegex.toString().slice(1, -1) },
  { id: 36, label: "City", property: "FromCity", required: true },
  { id: 37, label: "State", property: "FromState", required: true, selectInput: true },
  { id: 38, label: "Country", property: "FromCountry", required: true, readOnly: true },
  { id: 39, label: "Phone Number (Optional)", property: "FromPhone", required: false, regEx: phoneNumberRegex.toString().slice(1, -1) },
  { id: 41, label: "Name", property: "ToName", required: true },
  { id: 42, label: "Company Name", property: "ToCompany", required: false },
  { id: 43, label: "Address", property: "ToStreet", required: true },
  { id: 44, label: "Address 2 (Optional)", property: "ToStreet2", required: false },
  { id: 45, label: "Zip Code", property: "ToZip", required: true, regEx: zipCodeRegex.toString().slice(1, -1) },
  { id: 46, label: "City", property: "ToCity", required: true },
  { id: 47, label: "State", property: "ToState", required: true, selectInput: true },
  { id: 48, label: "Country", property: "ToCountry", required: true, readOnly: true },
  { id: 49, label: "Phone Number (Optional)", property: "ToPhone", required: false, regEx: phoneNumberRegex.toString().slice(1, -1) },
  { id: 51, label: "Height (inches)", property: "Height", required: true },
  { id: 52, label: "Weight (lbs)", property: "Weight", required: true },
  { id: 53, label: "Length (inches)", property: "Length", required: true },
  { id: 54, label: "Width (inches)", property: "Width", required: true },
];

export const statesList = [
  { name: "", abbreviation: "" },
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

export const initialPricingState = {
  zeroToFour: "7.00",
  fourToEight: "9.00",
  eightToFifteen: "14.00",
  fifteenToTwentyFive: "18.00",
  twentyFiveToThirtyFive: "22.00",
  thirtyFiveToFortyFive: "26.00",
  fortyFiveToFiftyFive: "28.00",
  fiftyFiveToSixtyFive: "30.00",
  sixtyFiveToSeventy: "32.00",
};

export const initialState = {
  FromCountry: "United States",
  FromName: "",
  FromCompany: "",
  FromPhone: "",
  FromStreet: "",
  FromStreet2: "",
  FromCity: "",
  FromZip: "",
  FromState: "",
  ToCountry: "United States",
  ToName: "",
  ToCompany: "",
  ToPhone: "",
  ToStreet: "",
  ToStreet2: "",
  ToCity: "",
  ToZip: "",
  ToState: "",
  Length: "",
  Height: "",
  Width: "",
  Weight: "",
};

export const EXPECTED_COLUMN_HEADERS = [
  "FromCountry",
  "FromName",
  "FromCompany",
  "FromPhone",
  "FromStreet",
  "FromStreet2",
  "FromCity",
  "FromZip",
  "FromState",
  "ToCountry",
  "ToName",
  "ToCompany",
  "ToPhone",
  "ToStreet",
  "ToStreet2",
  "ToCity",
  "ToZip",
  "ToState",
  "Length",
  "Height",
  "Width",
  "Weight",
];
