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
  const balance = api.balance.getAmount.useQuery();
  const updateBalance = api.balance.update.useMutation();
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

  function prepCsvContents(fileContents: string): [string[], string[][]] | void {
    const rows: string[] = fileContents?.split("\r\n");
    const [columnHeaders, ...rowsOfValues]: string[][] = rows.map((row) => row.split(","));
    newCheckpoint("prepCsvContents() → Column headers and rows of values are extracted from CSV.");
    if (columnHeaders && rowsOfValues) return [columnHeaders, rowsOfValues];
    newCheckpoint("prepCsvContents() → Column headers and rows of values are not extracted from CSV.");
  }

  function transformCsvContents([columnHeaders, rowsOfValues]: [string[], string[][]]): Map<string, string[]> {
    const transformedCsvContents = new Map<string, string[]>();
    for (const header of columnHeaders) transformedCsvContents.set(header, []);
    for (const row of rowsOfValues) {
      for (let x = 0; x < row.length; ++x) {
        const header = columnHeaders[x]!;

        transformedCsvContents.get(header)!.push(row[x]!);
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
      const payloadObject: FormData = initialState;
      for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
        payloadObject[columnHeader as keyof typeof payloadObject] = rowsInColumn[x]!;
      }
      payload.push(payloadObject);
    }
    newCheckpoint("createPayload() → Payload created:");
    return payload;
  }

  function calculateTotalPrice(data: string[]) {
    const weights = data.map((z) => +z);
    const prices: number[] = [];
    weights.map((weight) => {
      switch (true) {
        case 0 < weight && weight <= 7.99:
          prices.push(5.5);
          break;
        case 8 <= weight && weight <= 14.99:
          prices.push(11);
          break;
        case 15 <= weight && weight <= 24.99:
          prices.push(11.5);
          break;
        case 25 <= weight && weight <= 34.99:
          prices.push(12);
          break;
        case 35 <= weight && weight <= 44.99:
          prices.push(12.5);
          break;
        case 45 <= weight && weight <= 54.99:
          prices.push(12.5);
          break;
        case 55 <= weight && weight <= 70.0:
          prices.push(12.5);
          break;
        default:
          prices.push(0);
      }
    });
    const totalPrice = prices.reduce((a, b) => a + b);
    return totalPrice.toFixed(2);
  }

  function csvHandlingHelper(event: React.ChangeEvent<HTMLInputElement>): void {
    setShowErrorModal(false);
    setPayload([]);
    newCheckpoint("csvHandlingHelper() → Checkpoints enabled.");
    const [file, reader]: [File | null, FileReader] = getFileAndInitNewReader(event);
    const fileName: string = file?.name ?? "No file selected.";
    setFileName(fileName);
    if (file) reader.readAsText(file), newCheckpoint("csvHandlingHelper() → ProgressEvent<FileReader> triggered.");
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      newCheckpoint("csvHandlingHelper() → ProgressEvent<FileReader> loaded.");
      const fileContents = getFileContents(readerEvent);
      const preppedCsvContents = prepCsvContents(fileContents as string) as [string[], string[][]];
      const [validationCheckpoints, errorFlags]: [string[], string[]] = handleValidation(preppedCsvContents);
      for (const checkpoint of validationCheckpoints) newCheckpoint(checkpoint);

      if (errorFlags.length) {
        setRenderableErrorFlags(errorFlags);
        newCheckpoint("csvHandlingHelper() → Error flags detected, modal will be shown.");
        setShowErrorModal(true);
        return;
      }

      const transformedCsvContents: Map<string, string[]> = transformCsvContents(preppedCsvContents);
      const payloadSize: number = getPayloadSize(transformedCsvContents);
      const payload = createPayload(transformedCsvContents, payloadSize);
      const weights = payload.map((order) => order.Weight ?? "0");
      console.log(weights);
      const price = calculateTotalPrice(weights);
      setPayload(payload);
      setTotalPrice(price);

      console.log(checkpoints.join("\n\n")); //* uncomment when debugging
      console.log(payload); //* uncomment when debugging
    };
  }

  async function submitOrder(e: FormEvent) {
    e.preventDefault();
    if (!balance.data?.amount) return;
    if (parseFloat(totalPrice) === 0) return;
    if (parseFloat(balance.data?.amount) < parseFloat(totalPrice)) {
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
    const newBalance = parseFloat(balance.data.amount) - parseFloat(totalPrice);
    updateBalance.mutate({ amount: newBalance.toString() });
    setRenderableErrorFlags([]);
    router.push("/user/dashboard");
    router.refresh();
  }

  return { submitOrder, fileName, csvHandlingHelper, totalPrice, showErrorModal, renderableErrorFlags };
}
