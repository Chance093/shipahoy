"use strict";
"use client";
import { useState, type FormEvent } from "react";
import Modal from "~/app/components/Modal";
import { api } from "~/trpc/react";
import useCreateLabels from "~/hooks/useCreateLabels";
import handleValidation from "~/lib/handleValidation";
import { useRouter } from "next/navigation";
import { type FormData } from "~/lib/definitions";

export default function HandleCsv() {
  const [fileName, setFileName] = useState<string>("Choose a CSV");
  const [payload, setPayload] = useState<Record<string, string>[]>([]);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
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

  // @subroutine {Function} Pure: [File | null, FileReader] -> extract & return the file from the upload (change) event and a new file reader
  // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
  function getFileAndInitNewReader(event: React.ChangeEvent<HTMLInputElement>): [File | null, FileReader] {
    const file: File | null = event.target.files?.[0] ?? null;
    const reader = new FileReader();
    newCheckpoint("getFileAndInitNewReader() → File initialized and new FileReader() defined.");
    return [file, reader];
  }

  // @subroutine {Function} Pure: ProgressEvent<FileReader> -> extract & return the file contents from the file reader load event
  // @argument {ProgressEvent<FileReader>} event: the progress event triggered from a file reader load
  function getFileContents(event: ProgressEvent<FileReader>): string | Error {
    const rawFileContents = event.target?.result ?? null;
    if (!rawFileContents || rawFileContents instanceof ArrayBuffer) return new Error("getFileContents() → Raw file contents are not a string");
    newCheckpoint("getFileContents() → Raw file contents stored.");
    const regex = /"[^"]*"/g;
    const fileContents = rawFileContents.replace(regex, (match) => match.replace(/,/g, ""));
    newCheckpoint("getFileContents() → Inline commas removed from CSV - if any.");
    return fileContents;
  }

  // @subroutine {Function} Pure: string -> return the column headers and rows of values from the CSV
  // @argument {string} fileContents: the contents of the CSV
  function prepCsvContents(fileContents: string): [string[], string[][]] | void {
    const rows: string[] = fileContents?.split("\r\n");
    const [columnHeaders, ...rowsOfValues]: string[][] = rows.map((row) => row.split(","));
    newCheckpoint("prepCsvContents() → Column headers and rows of values are extracted from CSV.");
    if (columnHeaders && rowsOfValues) return [columnHeaders, rowsOfValues];
    newCheckpoint("prepCsvContents() → Column headers and rows of values are not extracted from CSV.");
  }

  // @subroutine {Function} Pure: Map<string, string[]> -> return a map such that each key is a column header and each value is an array of values for that column
  // @argument {string[]} columnHeaders: the column headers from the CSV
  // @argument {string[][]} rowsOfValues: the rows of values from the CSV
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

  // @subroutine {Function} Pure: Map<string, string[]> -> return the size of the payload, which is the number of rows in a column
  // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x)
  function getPayloadSize(transformedCsvContents: Map<string, string[]>): number {
    let payloadSize = 0;

    for (const rowsInColumn of transformedCsvContents.values()) {
      payloadSize = rowsInColumn.length;
      break;
    }
    newCheckpoint(`getPayloadSize() → Payload size calculated, there are ${payloadSize} labels in this request.`);
    return payloadSize;
  }

  // @subroutine {Function} Pure: Map<string, string[]> -> return an array of objects, each object is a payload for a label
  // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x)
  function createPayload(transformedCsvContents: Map<string, string[]>, payloadSize: number) {
    const payload: Record<string, string>[] = [];

    for (let x = 0; x < payloadSize; ++x) {
      const payloadObject: Record<string, string> = {};
      for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
        payloadObject[columnHeader] = rowsInColumn[x]!;
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

  // @subroutine {Procedure && Helper} Void -> from file upload, extract the file and read it as text for now
  // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
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
    storeData(tracking, links, payload as FormData[], labelPrices);
    setTotalPrice("0.00");
    setPayload([]);
    const newBalance = parseFloat(balance.data.amount) - parseFloat(totalPrice);
    updateBalance.mutate({ amount: newBalance.toString() });
    setRenderableErrorFlags([]);
    router.push("/user/dashboard");
    router.refresh();
  }

  return (
    <>
      <form onSubmit={submitOrder} className="rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col gap-8 rounded-2xl bg-radial-gradient p-5">
          <h2 className="text-center text-2xl">Upload CSV</h2>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="service">Service:</label>
            <select name="service" id="service" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
              <option value="usps priority 0-70lbs">USPS Priority 0-70lbs</option>
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="label">Label:</label>
            <select name="label" id="label" className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none">
              <option value="usps priority 0-70lbs">e-VS</option>
            </select>
          </div>

          <div className="flex justify-between">
            <label htmlFor="upload_csv" className="w-44 cursor-pointer items-start rounded-md bg-[#b4a3d8] p-4 text-center text-black">
              {fileName.length > 13 ? fileName.substring(0, 13) + " . . ." : fileName}
            </label>
            <input onChange={csvHandlingHelper} id="upload_csv" type="file" accept=".csv" className="hidden" />
            <button
              disabled={totalPrice === "0.00" ? true : false}
              className="w-52 cursor-pointer items-start rounded-md bg-purple p-4 text-center disabled:opacity-50"
            >
              Purchase ${totalPrice}
            </button>
          </div>
        </div>
      </form>
      <Modal
        showModal={showErrorModal}
        title="Your CSV is invalid."
        onClose={() => {
          return 0;
        }}
      >
        <div className="flex flex-col">
          {renderableErrorFlags.map((errorFlag, index) => (
            <div key={index} className="text-warning">
              {errorFlag}
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
