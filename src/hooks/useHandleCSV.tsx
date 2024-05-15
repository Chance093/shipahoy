"use client";
import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";
import useCreateLabels from "~/hooks/useCreateLabels";
import handleValidation from "~/lib/handleValidation";
import { useRouter } from "next/navigation";
import { type FormData } from "~/lib/definitions";
import { initialState } from "~/lib/lists";

export default function useHandleCSV() {
  const [fileName, setFileName] = useState("Choose a CSV");
  const [payload, setPayload] = useState<FormData[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [renderableErrorFlags, setRenderableErrorFlags] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const checkpoints: string[] = [];
  const { createLabels, storeData } = useCreateLabels();
  const { data: balance, isError: isBalanceError, error: balanceError } = api.balance.getAmount.useQuery();
  const updateBalance = api.balance.update.useMutation({
    onError: (err) => {
      throw err;
    },
  });
  const { data: userPricing, isError: isUserPricingError, error: userPricingError } = api.pricing.getPricing.useQuery();
  const router = useRouter();

  function newCheckpoint(checkpoint: string): void {
    checkpoints.push(checkpoint);
  }

  function getFileAndInitNewReader(event: React.ChangeEvent<HTMLInputElement>): [File | null, FileReader] {
    const file: File | null = event.target.files?.[0] ?? null;
    const reader = new FileReader();
    newCheckpoint("getFileAndInitNewReader() → File initialized and new FileReader() defined.");
    return [file, reader];
  }

  function getFileContents(event: ProgressEvent<FileReader>): string | Error {
    const rawFileContents = event.target?.result ?? null;
    if (!rawFileContents || rawFileContents instanceof ArrayBuffer) return new Error("getFileContents() → Raw file contents are not a string");
    newCheckpoint("getFileContents() → Raw file contents stored.");
    const regex = /"[^"]*"/g;
    const fileContents = rawFileContents.replace(regex, (match) => match.replace(/,/g, ""));
    newCheckpoint("getFileContents() → Inline commas removed from CSV - if any.");
    return fileContents;
  }

  // * Take the fileContents and split into headers(map) and values(2D array)
  function prepCsvContents(fileContents: string): [Map<string, number>, string[][]] | undefined {
    const rows: string[] = fileContents?.split("\r\n");
    const csvValues = rows.map((row) => row.split(","));
    const headerData = csvValues.shift();

    // Check if CSV is empty
    if (headerData === undefined) {
      newCheckpoint("prepCsvContents() → CSV is empty.");
      return undefined;
    }

    // Initialize headers map that stores header name as key and column index as value
    const headers = new Map<string, number>();
    for (let x = 0; x < headerData.length; ++x) {
      const headerName = headerData[x];
      if (headerName === undefined) {
        newCheckpoint(`prepCsvContents() → Missing header at index ${x}.`);
        continue;
      }
      const column = x;
      headers.set(headerName, column);
    }
    console.log(JSON.stringify(csvValues));
    if (!headers || !csvValues) {
      newCheckpoint("prepCsvContents() → Column headers and rows of values are not extracted from CSV.");
      return undefined;
    }

    if (csvValues[0]!.length <= 1) {
      newCheckpoint("prepCsvContents() → No CSV Values");
      return undefined;
    }

    newCheckpoint("prepCsvContents() → Column headers and rows of values are extracted from CSV.");
    return [headers, csvValues];
  }

  function transformCsvContents([headers, csvValues]: [Map<string, number>, string[][]]): Map<string, string[]> {
    const transformedCsvContents = new Map<string, string[]>();
    const keys = [...headers.keys()];
    for (const key of keys) {
      transformedCsvContents.set(key, []);
      const column = headers.get(key);

      if (column === undefined) {
        newCheckpoint(`transformCsvContents() → Column index for ${key} is undefined.`);
        continue;
      }

      for (let x = 0; x < csvValues.length; ++x) {
        const row = csvValues[x];

        if (row === undefined) {
          newCheckpoint(`transformCsvContents() → Row ${x} is undefined.`);
          continue;
        }

        const value = row[column];
        if (value === undefined) {
          newCheckpoint(`transformCsvContents() → Value at row ${x} column ${column} is undefined.`);
          continue;
        }

        const bucket = transformedCsvContents.get(key);
        if (bucket === undefined) {
          newCheckpoint(`transformCsvContents() → Bucket for ${key} is undefined.`);
          continue;
        }

        bucket.push(value);
      }
    }

    newCheckpoint("transformCsvContents() → CSV contents transformed from (x, y) to (y, x).");
    return transformedCsvContents;
  }

  function getPayloadSize(transformedCsvContents: Map<string, string[]>): number {
    let payloadSize = 0;

    for (const rowsInColumn of transformedCsvContents.values()) {
      payloadSize = rowsInColumn.length;
      break;
    }
    newCheckpoint(`getPayloadSize() → Payload size calculated, there are ${payloadSize} labels in this request.`);
    return payloadSize;
  }

  function createPayload(transformedCsvContents: Map<string, string[]>, payloadSize: number) {
    const payload: FormData[] = [];

    for (let x = 0; x < payloadSize; ++x) {
      const payloadObject: FormData = { ...initialState };
      for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
        payloadObject[columnHeader] = rowsInColumn[x]!;
      }
      payload.push(payloadObject);
    }
    newCheckpoint("createPayload() → Payload created:");
    return payload;
  }

  // TODO: Refactor to implement with other weight checking function
  // TODO: Write test case for this
  function calculateTotalPrice(data: string[]) {
    const weights = data.map((x) => +x);
    const prices: number[] = [];
    weights.map((weight) => {
      switch (true) {
        case 0 < weight && weight <= 3.99: {
          const price = userPricing?.zeroToFour;
          prices.push(Number(price));
          break;
        }
        case 4 <= weight && weight <= 7.99: {
          const price = userPricing?.fourToEight;
          prices.push(Number(price));
          break;
        }
        case 8 <= weight && weight <= 14.99: {
          const price = userPricing?.eightToFifteen;
          prices.push(Number(price));
          break;
        }
        case 15 <= weight && weight <= 24.99: {
          const price = userPricing?.fifteenToTwentyFive;
          prices.push(Number(price));
          break;
        }
        case 25 <= weight && weight <= 34.99: {
          const price = userPricing?.twentyFiveToThirtyFive;
          prices.push(Number(price));
          break;
        }
        case 35 <= weight && weight <= 44.99: {
          const price = userPricing?.thirtyFiveToFortyFive;
          prices.push(Number(price));
          break;
        }
        case 45 <= weight && weight <= 54.99: {
          const price = userPricing?.fortyFiveToFiftyFive;
          prices.push(Number(price));
          break;
        }
        case 55 <= weight && weight <= 64.99: {
          const price = userPricing?.fiftyFiveToSixtyFive;
          prices.push(Number(price));
          break;
        }
        case 65 <= weight && weight <= 70: {
          const price = userPricing?.sixtyFiveToSeventy;
          prices.push(Number(price));
          break;
        }
        default: {
          throw new Error("Weight is out of range");
        }
      }
    });
    const totalPrice = prices.reduce((a, b) => a + b);
    return totalPrice.toFixed(2);
  }

  function csvHandlingHelper(event: React.ChangeEvent<HTMLInputElement>): void {
    setShowErrorModal(false);
    setPayload([]);
    setRenderableErrorFlags([]);
    newCheckpoint("csvHandlingHelper() → Checkpoints enabled.");
    const [file, reader]: [File | null, FileReader] = getFileAndInitNewReader(event);
    const fileName: string = file?.name ?? "No file selected.";
    setFileName(fileName);
    if (file) reader.readAsText(file), newCheckpoint("csvHandlingHelper() → ProgressEvent<FileReader> triggered.");
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      newCheckpoint("csvHandlingHelper() → ProgressEvent<FileReader> loaded.");
      const fileContents = getFileContents(readerEvent);
      const preppedCsvContents = prepCsvContents(fileContents as string);
      const [validationCheckpoints, errorFlags]: [string[], string[]] = handleValidation(preppedCsvContents);
      for (const checkpoint of validationCheckpoints) newCheckpoint(checkpoint);

      if (errorFlags.length || preppedCsvContents === undefined) {
        setRenderableErrorFlags(errorFlags);
        newCheckpoint("csvHandlingHelper() → Error flags detected, modal will be shown.");
        setShowErrorModal(true);
        return;
      }

      const transformedCsvContents: Map<string, string[]> = transformCsvContents(preppedCsvContents);
      const payloadSize: number = getPayloadSize(transformedCsvContents);
      const payload = createPayload(transformedCsvContents, payloadSize);
      const weights = payload.map((order) => order.Weight ?? "0");
      const price = calculateTotalPrice(weights);
      setPayload(payload);
      setTotalPrice(price);

      // console.log(checkpoints.join("\n\n")); //* uncomment when debugging
      console.log(payload); //* uncomment when debugging
    };
  }

  async function submitOrder(e: FormEvent) {
    e.preventDefault();
    if (!balance?.amount) return;
    if (parseFloat(totalPrice) === 0) return;
    if (parseFloat(balance.amount) < parseFloat(totalPrice)) {
      setRenderableErrorFlags((prev) => [...prev, "Insufficient funds. Please add more to your balance."]);
      return;
    }
    const apiResponse = await createLabels(payload);
    if (apiResponse instanceof Error) {
      setRenderableErrorFlags((prev) => [...prev, `${JSON.stringify(apiResponse)}`]);
      return;
    }
    const { tracking, links, labelPrices } = apiResponse;
    storeData(tracking, links, payload, labelPrices);
    setTotalPrice("0.00");
    setPayload([]);
    const newBalance = parseFloat(balance.amount) - parseFloat(totalPrice);
    updateBalance.mutate({ amount: newBalance.toString() });
    setRenderableErrorFlags([]);
    router.push("/user/dashboard");
    router.refresh();
  }

  return { submitOrder, fileName, csvHandlingHelper, totalPrice, showErrorModal, renderableErrorFlags, isBalanceError, isUserPricingError, balanceError, userPricingError };
}
