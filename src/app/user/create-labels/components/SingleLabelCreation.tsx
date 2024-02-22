"use client";
import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import { zipCodeRegex, phoneNumberRegex } from "~/utils/regex";
import { createLabels } from "~/utils/createLabels";

export default function SingleLabelCreation() {
  type Links = {
    pdf: string;
    csv: string;
    zip: string;
  };
  const initialState = {
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
  const [formData, setFormData] = useState(initialState);
  const [price, setPrice] = useState("0.00");
  const [errorMessage, setErrorMessage] = useState("");

  const statesList = [
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

  const formInputs = [
    { id: 31, label: "Name", property: "FromName", required: true },
    { id: 32, label: "Company Name", property: "FromCompany", required: true },
    { id: 33, label: "Address", property: "FromStreet", required: true },
    { id: 34, label: "Address 2 (Optional)", property: "FromStreet2", required: false },
    { id: 35, label: "Zip Code", property: "FromZip", required: true, regEx: zipCodeRegex.toString().slice(1, -1) },
    { id: 36, label: "City", property: "FromCity", required: true },
    { id: 37, label: "State", property: "FromState", required: true, selectInput: true },
    { id: 38, label: "Country", property: "FromCountry", required: true, readOnly: true },
    { id: 39, label: "Phone Number (Optional)", property: "FromPhone", required: false, regEx: phoneNumberRegex.toString().slice(1, -1) },
    { id: 41, label: "Name", property: "ToName", required: true },
    { id: 42, label: "Company Name", property: "ToCompany", required: true },
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

  const handleChange = (fields: Partial<typeof formData>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const updateWeight = (value: string) => {
    setFormData((prev) => {
      return { ...prev, Weight: value };
    });
    switch (true) {
      case 0 < parseInt(value) && parseInt(value) <= 7.99:
        setPrice("5.50");
        break;
      case 8 <= parseInt(value) && parseInt(value) <= 14.99:
        setPrice("11.00");
        break;
      case 15 <= parseInt(value) && parseInt(value) <= 24.99:
        setPrice("11.50");
        break;
      case 25 <= parseInt(value) && parseInt(value) <= 34.99:
        setPrice("12.00");
        break;
      case 35 <= parseInt(value) && parseInt(value) <= 44.99:
        setPrice("12.50");
        break;
      case 45 <= parseInt(value) && parseInt(value) <= 54.99:
        setPrice("12.50");
        break;
      case 55 <= parseInt(value) && parseInt(value) <= 70.0:
        setPrice("12.50");
        break;
      default:
        setPrice("0.00");
    }
  };

  const createLabelGroup = api.label.createLabel.useMutation({
    onSuccess: () => {
      setPrice("0.00");
      setFormData(initialState);
    },
  });

  const updateBalance = api.balance.update.useMutation();

  const balance = api.balance.getAmount.useQuery();

  const storeData = (tracking: string[], links: Links, payload: (typeof initialState)[], price: string) => {
    if (!links || !tracking) return;
    createLabelGroup.mutate({ orders: payload, links: links, tracking: tracking, labelPrices: [price] });
  };

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!balance.data?.amount) return;
    if (parseFloat(price) === 0) return;
    if (formData.FromStreet === formData.ToStreet) {
      setErrorMessage("Sender Address cannot be the same as Recipient Address.");
      return;
    }
    if (parseFloat(balance.data?.amount) < parseFloat(price)) {
      setErrorMessage("Insufficient funds. Please add more to your balance.");
      return;
    }
    const apiResponse = await createLabels([formData]);
    if (apiResponse instanceof Error) {
      setErrorMessage(`${JSON.stringify(apiResponse)}`);
      return;
    }
    const { tracking, links } = apiResponse;
    storeData(tracking, links, [formData], price);
    const newBalance = parseFloat(balance.data.amount) - parseFloat(price);
    updateBalance.mutate({ amount: newBalance.toString() });
    setErrorMessage("");
  };

  return (
    <>
      <h1 className="pl-2 text-4xl">Create Single Label</h1>
      <form onSubmit={(e) => onFormSubmit(e)} className="grid grid-cols-2 grid-rows-[1fr_auto] gap-6">
        <section className="rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">From</h2>
            {formInputs.map((input, idx) => {
              if (idx > 8) return;
              if (input.selectInput)
                return (
                  <div className="flex flex-col gap-2" key={input.id}>
                    <label htmlFor={input.property}>{input.label}</label>
                    <select
                      id={input.property}
                      onChange={(e) => handleChange({ [input.property]: e.target.value })}
                      className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                      required={input.required}
                    >
                      {statesList.map((state, idx) => {
                        return (
                          <option value={state.abbreviation} key={idx} className="border-gray-600/50 bg-[#1a1a1b]">
                            {state.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              else
                return (
                  <div className="flex flex-col gap-2" key={input.id}>
                    <label htmlFor={input.property}>{input.label}</label>
                    <input
                      type="text"
                      id={input.property}
                      onChange={(e) => handleChange({ [input.property]: e.target.value })}
                      value={formData[input.property as keyof typeof formData]}
                      className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                      required={input.required}
                      pattern={input.regEx}
                      autoComplete="off"
                      readOnly={input.readOnly}
                    />
                  </div>
                );
            })}
          </div>
        </section>
        <section className="rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">To</h2>
            {formInputs.map((input, idx) => {
              if (idx <= 8 || idx >= 18) return;
              if (input.selectInput)
                return (
                  <div className="flex flex-col gap-2" key={input.id}>
                    <label htmlFor={input.property}>{input.label}</label>
                    <select
                      id={input.property}
                      onChange={(e) => handleChange({ [input.property]: e.target.value })}
                      className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                      required={input.required}
                    >
                      {statesList.map((state, idx) => {
                        return (
                          <option value={state.abbreviation} key={idx} className="border-gray-600/50 bg-[#1a1a1b]">
                            {state.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                );
              else
                return (
                  <div className="flex flex-col gap-2" key={input.id}>
                    <label htmlFor={input.property}>{input.label}</label>
                    <input
                      type="text"
                      id={input.property}
                      onChange={(e) => handleChange({ [input.property]: e.target.value })}
                      value={formData[input.property as keyof typeof formData]}
                      className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                      required={input.required}
                      pattern={input.regEx}
                      autoComplete="off"
                      readOnly={input.readOnly}
                    />
                  </div>
                );
            })}
          </div>
        </section>
        <section className="col-start-1 col-end-3 rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-8 rounded-2xl bg-radial-gradient p-5">
            <h2 className="text-center text-2xl">Package Dimensions</h2>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="service">Service:</label>
              <select name="service" id="service" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
                <option value="usps priority 0-70lbs">USPS Priority 0-70lbs</option>
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="label">Label:</label>
              <select name="label" id="label" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
                <option value="e-VS">e-VS</option>
              </select>
            </div>
            <section className="flex gap-4">
              <div className="flex flex-1 flex-col gap-8">
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor="height">Height (inches):</label>
                  <input
                    id="height"
                    type="number"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                    value={formData.Height}
                    onChange={(e) => handleChange({ Height: e.target.value })}
                    autoComplete="off"
                    min="1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="weight">Weight (lbs):</label>
                  <input
                    id="weight"
                    type="number"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                    value={formData.Weight}
                    onChange={(e) => updateWeight(e.target.value)}
                    autoComplete="off"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-8">
                <div className="flex flex-1 flex-col gap-2">
                  <label htmlFor="length">Length (inches):</label>
                  <input
                    id="length"
                    type="number"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                    value={formData.Length}
                    onChange={(e) => handleChange({ Length: e.target.value })}
                    autoComplete="off"
                    min="1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="width">Width (inches):</label>
                  <input
                    id="width"
                    type="number"
                    className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                    value={formData.Width}
                    onChange={(e) => handleChange({ Width: e.target.value })}
                    autoComplete="off"
                    min="1"
                  />
                </div>
              </div>
            </section>
            <section className="flex items-center justify-between">
              <p className="pl-4 text-xl text-red-400">{errorMessage}</p>
              <button
                type="submit"
                disabled={price === "0.00" ? true : false}
                className="w-48 cursor-pointer rounded-md bg-purple p-4 text-center disabled:opacity-50"
              >
                Purchase ${price}
              </button>
            </section>
          </div>
        </section>
      </form>
    </>
  );
}
