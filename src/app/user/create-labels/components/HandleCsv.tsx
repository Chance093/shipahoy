"use strict";
"use client";
import { useState } from "react";
import TestLabelsApiReq from "./ApiReq";
import Modal from "~/app/components/Modal";
import useValidation from "~/utils/handleValidation";
import { redirect } from "next/navigation";
import { render } from "react-dom";
import { set } from "date-fns";
export default function HandleCsv() {
  const [fileName, setFileName] = useState<string>("No file selected.");
  const [payload, setPayload] = useState<object[]>([]);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [renderableErrorFlags, setRenderableErrorFlags] = useState<string[]>(
    [],
  );
  const checkpoints: string[] = [];

  function newCheckpoint(checkpoint: string): void {
    checkpoints.push(checkpoint);
  }

  // @subroutine {Function} Pure: [File | null, FileReader] -> extract & return the file from the upload (change) event and a new file reader
  // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
  function getFileAndInitNewReader(
    event: React.ChangeEvent<HTMLInputElement>,
  ): [File | null, FileReader] {
    const file: File | null = event.target.files?.[0] ?? null;
    const reader = new FileReader();
    newCheckpoint(
      "getFileAndInitNewReader() → File initialized and new FileReader() defined.",
    );
    return [file, reader];
  }

  // @subroutine {Function} Pure: ProgressEvent<FileReader> -> extract & return the file contents from the file reader load event
  // @argument {ProgressEvent<FileReader>} event: the progress event triggered from a file reader load
  function getFileContents(
    event: ProgressEvent<FileReader>,
  ): string | ArrayBuffer | null {
    const fileContents: string | ArrayBuffer | null =
      event.target?.result ?? null;
    newCheckpoint("getFileContents() → Raw file contents stored.");
    return fileContents;
  }

  // @subroutine {Function} Pure: string -> return the column headers and rows of values from the CSV
  // @argument {string} fileContents: the contents of the CSV
  function prepCsvContents(
    fileContents: string,
  ): [string[], string[][]] | void {
    const rows: string[] = fileContents?.split("\r\n");
    const [columnHeaders, ...rowsOfValues]: string[][] = rows.map((row) =>
      row.split(","),
    );
    newCheckpoint(
      "prepCsvContents() → Column headers and rows of values are extracted from CSV.",
    );
    if (columnHeaders && rowsOfValues) return [columnHeaders, rowsOfValues];
    newCheckpoint(
      "prepCsvContents() → Column headers and rows of values are not extracted from CSV.",
    );
  }

  // @subroutine {Procedure} Void -> log the instructions for now, the modal needs to be implemented
  // @argument {string} title: the title describing what the modal is for
  // @argument {string} message: a message letting the user know what to do
  function userInstructionModal(title: string, message: string) {
    newCheckpoint(`userInstructionModal() → ${title}: ${message}`);
    console.log("%s\n%s", title, message);
  }
  // @subroutine {Function} Pure: Map<string, string[]> -> return a map such that each key is a column header and each value is an array of values for that column
  // @argument {string[]} columnHeaders: the column headers from the CSV
  // @argument {string[][]} rowsOfValues: the rows of values from the CSV
  function transformCsvContents([columnHeaders, rowsOfValues]: [
    string[],
    string[][],
  ]): Map<string, string[]> {
    const transformedCsvContents = new Map<string, string[]>();
    for (const header of columnHeaders) transformedCsvContents.set(header, []);
    for (const row of rowsOfValues) {
      for (let x = 0; x < row.length; ++x) {
        const header = columnHeaders[x]!;
        transformedCsvContents.get(header)!.push(row[x]!);
      }
    }
    newCheckpoint(
      "transformCsvContents() → CSV contents transformed from (x, y) to (y, x).",
    );
    return transformedCsvContents;
  }

  // @subroutine {Function} Pure: Map<string, string[]> -> return the size of the payload, which is the number of rows in a column
  // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x)
  function getPayloadSize(
    transformedCsvContents: Map<string, string[]>,
  ): number {
    let payloadSize = 0;
    for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
      payloadSize = rowsInColumn.length;
      break;
    }
    newCheckpoint(
      `getPayloadSize() → Payload size calculated, there are ${payloadSize} labels in this request.`,
    );
    return payloadSize;
  }

  // @subroutine {Function} Pure: Map<string, string[]> -> return an array of objects, each object is a payload for a label
  // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x)
  function createPayload(
    transformedCsvContents: Map<string, string[]>,
    payloadSize: number,
  ): object[] {
    const payload: object[] = [];
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

  // @subroutine {Procedure && Helper} Void -> from file upload, extract the file and read it as text for now
  // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
  function csvHandlingHelper(event: React.ChangeEvent<HTMLInputElement>): void {
    setShowErrorModal(false);
    setPayload([]);
    newCheckpoint("csvHandlingHelper() → Checkpoints enabled.");
    const [file, reader]: [File | null, FileReader] =
      getFileAndInitNewReader(event);
    const fileName: string = file?.name ?? "No file selected.";
    setFileName(fileName);
    if (file)
      reader.readAsText(file),
        newCheckpoint(
          "csvHandlingHelper() → ProgressEvent<FileReader> triggered.",
        );
    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      newCheckpoint("csvHandlingHelper() → ProgressEvent<FileReader> loaded.");
      const fileContents = getFileContents(readerEvent);
      const preppedCsvContents = prepCsvContents(fileContents as string) as [
        string[],
        string[][],
      ];
      const [validationCheckpoints, errorFlags]: [string[], string[]] =
        useValidation(preppedCsvContents);
      for (const checkpoint of validationCheckpoints) newCheckpoint(checkpoint);
      if (errorFlags.length) {
        setRenderableErrorFlags(errorFlags);
        newCheckpoint(
          "csvHandlingHelper() → Error flags detected, modal will be shown.",
        );
        setShowErrorModal(true);
        return;
      }
      const transformedCsvContents: Map<string, string[]> =
        transformCsvContents(preppedCsvContents);
      const payloadSize: number = getPayloadSize(transformedCsvContents);
      const payload: object[] = createPayload(
        transformedCsvContents,
        payloadSize,
      );
      setRenderableErrorFlags(errorFlags);
      setPayload(payload);
      console.log(checkpoints.join("\n\n"));
    };
  }

  return (
    <>
      <section className="rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col gap-8 rounded-2xl bg-radial-gradient p-5">
          <h2 className="text-center text-2xl">Upload CSV</h2>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="service">Service:</label>
            <select
              name="service"
              id="service"
              className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
            >
              <option value="usps priority 0-70lbs">
                USPS Priority 0-70lbs
              </option>
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="label">Label:</label>
            <select
              name="label"
              id="label"
              className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
            >
              <option value="usps priority 0-70lbs">e-VS</option>
            </select>
          </div>

          <div className="flex justify-between">
            <label
              htmlFor="upload_csv"
              className="w-40 cursor-pointer items-start rounded-md bg-[#b4a3d8] p-4 text-center text-black"
            >
              Choose a CSV
            </label>
            <input
              onChange={csvHandlingHelper}
              id="upload_csv"
              type="file"
              accept=".csv"
              className="hidden"
            />
            <button
              disabled={true}
              className="w-40 cursor-pointer items-start rounded-md bg-purple p-4 text-center opacity-50"
            >
              Purchase $0
            </button>
          </div>
        </div>
        {/* <TestLabelsApiReq payload={ payload }/> */}
      </section>
      <Modal
        showModal={showErrorModal}
        title="Your CSV is invalid."
        onClose={() => {}}
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
