"use client";
import { useState } from "react";

export type FormData = {
  fromName: string;
  fromCompanyName: string;
  fromAddress: string;
  fromAddress2: string;
  fromZipCode: string;
  fromCity: string;
  fromState: string;
  fromCountry: string;
  fromPhoneNumber: string;
  toName: string;
  toCompanyName: string;
  toAddress: string;
  toAddress2: string;
  toZipCode: string;
  toCity: string;
  toState: string;
  toCountry: string;
  toPhoneNumber: string;
  service: string;
  label: string;
  height: string;
  weight: string;
  length: string;
  width: string;
};

export const initialState = {
  fromName: "Chance",
  fromCompanyName: "",
  fromAddress: "",
  fromAddress2: "",
  fromZipCode: "",
  fromCity: "",
  fromState: "",
  fromCountry: "United States",
  fromPhoneNumber: "",
  toName: "",
  toCompanyName: "",
  toAddress: "",
  toAddress2: "",
  toZipCode: "",
  toCity: "",
  toState: "",
  toCountry: "United States",
  toPhoneNumber: "",
  service: "usps priority 0-70lbs",
  label: "e-VS",
  height: "",
  weight: "",
  length: "",
  width: "",
};

export const useFormValidation = () => {
  const [formData, setFormData] = useState({
    fromName: "",
    fromCompanyName: "",
    fromAddress: "",
    fromAddress2: "",
    fromZipCode: "",
    fromCity: "",
    fromState: "",
    fromCountry: "United States",
    fromPhoneNumber: "",
    toName: "",
    toCompanyName: "",
    toAddress: "",
    toAddress2: "",
    toZipCode: "",
    toCity: "",
    toState: "",
    toCountry: "United States",
    toPhoneNumber: "",
    service: "usps priority 0-70lbs",
    label: "e-VS",
    height: "",
    weight: "",
    length: "",
    width: "",
  });

  const handleChange = (fields: Partial<FormData>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

  return { formData, handleChange };
};
