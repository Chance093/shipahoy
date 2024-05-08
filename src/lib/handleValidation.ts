import { EXPECTED_COLUMN_HEADERS } from "./lists";

const getErrorFlagMessage = (
  errorFlagType: string,
  newValidationCheckpoint: (checkpoint: string) => number,
  columnHeader: string | undefined,
  invalidIndexes: Map<string, number[]> | undefined,
) => {
  newValidationCheckpoint(`getErrorFlagMessage() → New error flag: '${errorFlagType}'`);
  const errorFlagMessage: string[] = [];
  switch (errorFlagType) {
    case "column header missing":
      errorFlagMessage.push(`Column ${columnHeader} is missing`);
      return errorFlagMessage;
    case "column should not be included":
      errorFlagMessage.push(`Column ${columnHeader} should not be included`);
      return errorFlagMessage;
    case "one or more empty values":
      for (const [headerName, rows] of invalidIndexes!) {
        errorFlagMessage.push(`${headerName} has empty values in row(s): ${rows.length > 1 ? rows.join(", ") : rows[0]}`);
      }
      return errorFlagMessage;
    default:
      return errorFlagMessage;
  }
};

const validateColumnHeaders = (headers: Map<string, number>, errorFlags: string[], newValidationCheckpoint: (checkpoint: string) => number) => {

  if (headers.size !== EXPECTED_COLUMN_HEADERS.length) {
    const errorFlagType = "column header length";
    const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, newValidationCheckpoint);
    errorFlags.push(...errorFlagMessage);
  }

  for (let x = 0; x < EXPECTED_COLUMN_HEADERS.length; ++x) {
    const header = EXPECTED_COLUMN_HEADERS[x]!;

    if (headers.has(header)) continue;

    const errorFlagType = "column header value";

    /*
      ! TODO: Edit the error message such that there is no comparison
      ! i.e. what was previously "Column 4's header is 'Address line 1'; it should be 'Full Name'."
      ! should be "Column header 'Full name' is missing"
    */
    const errorFlagMessage: string[] = getErrorFlagMessage(
      errorFlagType,
      newValidationCheckpoint,
      x + 1,
      header,
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

function handleValidation([headers, csvValues]: [Map<string, number>, string[][]]): [string[], string[]] {
  const errorFlags: string[] = [];
  const validationCheckpoints: string[] = [];
  const newValidationCheckpoint = (checkpoint: string) => validationCheckpoints.push(checkpoint);

  newValidationCheckpoint("useValidation → Array to store error flags is initialized.");

  validateColumnHeaders(headers, errorFlags, newValidationCheckpoint);
  validateRowValues(columnHeaders, rowsOfValues, errorFlags, newValidationCheckpoint);

  newValidationCheckpoint(
    `validateCsvContents() → Validation for column headers and row values done. Is the CSV valid: ${!errorFlags.length ? "Yes" : "No"}`,
  );

  return [validationCheckpoints, errorFlags];
}

export default handleValidation;
