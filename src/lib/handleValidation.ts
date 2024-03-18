import { EXPECTED_COLUMN_HEADERS } from "./lists";
import { type ErrorFlagDetails } from "./definitions";

const getErrorFlagMessage = (
  errorFlagType: string,
  newValidationCheckpoint: (checkpoint: string) => number,
  ...errorFlagDetails: ErrorFlagDetails
) => {
  newValidationCheckpoint(`getErrorFlagMessage() → New error flag: '${errorFlagType}', ${JSON.stringify(errorFlagDetails)}`);
  const errorFlagMessage: string[] = [];
  switch (errorFlagType) {
    case "column header length":
      errorFlagMessage.push("Your CSV's column headers do not match those of our template.");
      return errorFlagMessage;
    case "column header value":
      const [columnNumber, invalidColumnHeader, expectedColumnHeader] = errorFlagDetails as [number, string, string];
      errorFlagMessage.push(`Column ${columnNumber}'s header is ${invalidColumnHeader}; it should be ${expectedColumnHeader}.`);
      return errorFlagMessage;
    case "one or more empty values":
      const invalidIndexes = errorFlagDetails[0] as Map<string, number[]>;
      for (const [key, value] of invalidIndexes) {
        const columnNumbers = value.join(", ");
        errorFlagMessage.push(`${key} has empty values in column(s): ${columnNumbers}.`);
      }
      return errorFlagMessage;
    default:
      return errorFlagMessage;
  }
};

const validateColumnHeaders = (columnHeaders: string[], errorFlags: string[], newValidationCheckpoint: (checkpoint: string) => number) => {
  if (columnHeaders.length !== EXPECTED_COLUMN_HEADERS.length) {
    const errorFlagType = "column header length";
    const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, newValidationCheckpoint);
    errorFlags.push(...errorFlagMessage);
  }
  for (let x = 0; x < EXPECTED_COLUMN_HEADERS.length; ++x) {
    if (columnHeaders[x] === EXPECTED_COLUMN_HEADERS[x]) continue;
    const errorFlagType = "column header value";
    const errorFlagMessage: string[] = getErrorFlagMessage(
      errorFlagType,
      newValidationCheckpoint,
      x + 1,
      columnHeaders[x],
      EXPECTED_COLUMN_HEADERS[x],
    );
    errorFlags.push(...errorFlagMessage);
  }
  newValidationCheckpoint(`validateColumnHeaders() → Validation for column headers done, there were ${errorFlags.length} errors flagged`);
};

const validateRowValues = (
  columnHeaders: string[],
  rowsOfValues: string[][],
  errorFlags: string[],
  newValidationCheckpoint: (checkpoint: string) => number,
) => {
  const invalidIndexes = new Map<string, number[]>();
  const regexToIgnoreAddressLine2 = /Street2|Company/;
  for (let x = 0; x < rowsOfValues.length; ++x) {
    if (!rowsOfValues[x]) continue;
    for (let y = 0; y < rowsOfValues[x]!.length; ++y) {
      const value = rowsOfValues[x]![y]!;
      if (regexToIgnoreAddressLine2.test(columnHeaders[y]!)) continue;
      if (value.length > 0) continue;
      const keyName = `Row: ${x + 1}`;
      const columnNumber: number = y + 1;
      if (invalidIndexes.has(keyName)) {
        invalidIndexes.get(keyName)!.push(columnNumber);
        continue;
      }
      invalidIndexes.set(keyName, [columnNumber]);
    }
  }
  if (!invalidIndexes.size) return;
  const errorFlagType = "one or more empty values";
  const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, newValidationCheckpoint, invalidIndexes);
  errorFlags.push(...errorFlagMessage);
  newValidationCheckpoint(`validateRowValues() → Validation for row values done, there were ${errorFlags.length} errors flagged`);
};

function handleValidation([columnHeaders, rowsOfValues]: [string[], string[][]]): [string[], string[]] {
  const errorFlags: string[] = [];
  const validationCheckpoints: string[] = [];
  const newValidationCheckpoint = (checkpoint: string) => validationCheckpoints.push(checkpoint);

  newValidationCheckpoint("useValidation → Array to store error flags is initialized.");

  validateColumnHeaders(columnHeaders, errorFlags, newValidationCheckpoint);
  validateRowValues(columnHeaders, rowsOfValues, errorFlags, newValidationCheckpoint);

  newValidationCheckpoint(
    `validateCsvContents() → Validation for column headers and row values done. Is the CSV valid: ${!errorFlags.length ? "Yes" : "No"}`,
  );

  return [validationCheckpoints, errorFlags];
}

export default handleValidation;
