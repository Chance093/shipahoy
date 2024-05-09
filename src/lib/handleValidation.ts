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
  // Check for missing column headers
  for (const expectedHeader of EXPECTED_COLUMN_HEADERS) {
    if (headers.has(expectedHeader)) continue;
    const errorFlagType = "column header missing";
    const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, newValidationCheckpoint, expectedHeader, undefined);
    errorFlags.push(...errorFlagMessage);
  }

  // Check for column headers that shouldn't be included
  headers.forEach((_value, key) => {
    if (EXPECTED_COLUMN_HEADERS.includes(key)) return;
    const errorFlagType = "column should not be included";
    const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, newValidationCheckpoint, key, undefined);
    errorFlags.push(...errorFlagMessage);
  });

  newValidationCheckpoint(`validateColumnHeaders() → Validation for column headers done, there were ${errorFlags.length} errors flagged`);
};

const validateRowValues = (
  headers: Map<string, number>,
  csvValues: string[][],
  errorFlags: string[],
  newValidationCheckpoint: (checkpoint: string) => number,
) => {
  const invalidIndexes = new Map<string, number[]>();
  const regexToIgnore = /Street2|Company|Phone/;
  for (const [headerName, column] of headers) {
    if (regexToIgnore.test(headerName)) continue;
    if (!EXPECTED_COLUMN_HEADERS.includes(headerName)) continue;
    const columnValues = csvValues.map((row) => row[column]!);
    for (let x = 0; x < columnValues.length; ++x) {
      const value = columnValues[x]!;
      if (value.length > 0) continue;
      const row = x + 2;
      if (invalidIndexes.has(headerName)) {
        invalidIndexes.get(headerName)?.push(row);
        continue;
      }
      invalidIndexes.set(headerName, [row]);
    }
  }
  if (!invalidIndexes.size) return;
  const errorFlagType = "one or more empty values";
  const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, newValidationCheckpoint, undefined, invalidIndexes);
  errorFlags.push(...errorFlagMessage);
  newValidationCheckpoint(`validateRowValues() → Validation for row values done, there were ${errorFlags.length} errors flagged`);
};

function handleValidation(preppedCsvContents: [Map<string, number>, string[][]] | undefined): [string[], string[]] {
  const errorFlags: string[] = [];
  const validationCheckpoints: string[] = [];
  const newValidationCheckpoint = (checkpoint: string) => validationCheckpoints.push(checkpoint);

  newValidationCheckpoint("useValidation → Array to store error flags is initialized.");
  if (preppedCsvContents === undefined) {
    errorFlags.push("CSV is empty");
    return [validationCheckpoints, errorFlags];
  }

  const [headers, csvValues] = preppedCsvContents;

  validateColumnHeaders(headers, errorFlags, newValidationCheckpoint);
  validateRowValues(headers, csvValues, errorFlags, newValidationCheckpoint);

  newValidationCheckpoint(
    `validateCsvContents() → Validation for column headers and row values done. Is the CSV valid: ${!errorFlags.length ? "Yes" : "No"}`,
  );

  return [validationCheckpoints, errorFlags];
}

export default handleValidation;
