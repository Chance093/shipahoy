'use strict';
// @subroutine {Function} Impure: boolean -> validate the column headers and row values then return true if both are vlaid, false otherwise
// @argument {string[]} columnHeaders: the column headers from the CSV
// @argument {string[][]} rowsOfValues: the rows of values from the CSV
function useValidation([columnHeaders, rowsOfValues]: [string[], string[][]]): [string[], string[]] {
    type ErrorFlagDetails = Array<string | number | Map<string, number[]> | undefined>;
    const EXPECTED_COLUMN_HEADERS: string[] = ['FromCountry', 'FromName', 'FromCompany', 'FromPhone', 'FromStreet1', 'FromStreet2', 'FromCity', 'FromZip', 'FromState', 'ToCountry', 'ToName', 'ToCompany', 'ToPhone', 'ToStreet1', 'ToStreet2', 'ToCity', 'ToZip', 'ToState', 'Length', 'Height', 'Width', 'Weight'];
    
    const errorFlags: string[] = [];

    const validationCheckpoints: string[] = [];
    const newValidationCheckpoint = (checkpoint: string) => validationCheckpoints.push(checkpoint);

    newValidationCheckpoint('useValidation → Array to store error flags is initialized.');

    // @subroutine {Function} Pure: string -> return the error flag message for the given error flag type
    // @argument {string} errorFlagType: the type of error flag
    const getErrorFlagMessage = (errorFlagType: string, ...errorFlagDetails: ErrorFlagDetails): string[] => {
        newValidationCheckpoint(`getErrorFlagMessage() → New error flag: '${errorFlagType}', ${errorFlagDetails}`);
        const errorFlagMessage: string[] = [];
        switch (errorFlagType) {
            case 'column header length':
                errorFlagMessage.push('Your CSV\'s column headers do not match those of our template.');
                return errorFlagMessage; 
            case 'column header value':
                const [columnNumber, invalidColumnHeader, expectedColumnHeader] = errorFlagDetails as [number, string, string];; 
                errorFlagMessage.push(`Column ${columnNumber}'s header is ${invalidColumnHeader}; it should be ${expectedColumnHeader}.`);
                return errorFlagMessage; 
            case 'one or more empty values':
                const invalidIndexes = errorFlagDetails[0] as Map<string, number[]>;
                for (const [key, value] of invalidIndexes) {
                    const columnNumbers = value.join(', ');
                    errorFlagMessage.push(`${key} has empty values in column(s): ${columnNumbers}.`);
                }
                return errorFlagMessage; 
            default:
                return errorFlagMessage;
        }
    }

    // @subroutine {Function} Impure: boolean -> return true if the user's CSV's column headers are equivalent to the expected column headers, false otherwise
    // @argument {string[]} columnHeaders: the column headers from the user's CSV
    const validateColumnHeaders = (): void => {
        if (columnHeaders.length !== EXPECTED_COLUMN_HEADERS.length) {
            const errorFlagType: string = 'column header length';
            const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType);
            errorFlags.push(...errorFlagMessage);
        }
        for (let x = 0; x < EXPECTED_COLUMN_HEADERS.length; ++x) {
            if (columnHeaders[x] === EXPECTED_COLUMN_HEADERS[x]) continue;
            const errorFlagType: string = 'column header value';
            const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, x + 1, columnHeaders[x], EXPECTED_COLUMN_HEADERS[x]);
            errorFlags.push(...errorFlagMessage);
        }
        newValidationCheckpoint(`validateColumnHeaders() → Validation for column headers done, there were ${errorFlags.length} errors flagged`);
    }

    // @subroutine {Function} Impure: boolean -> return true if all required columns contain row values, false otherwise
    // @argument {string[][]} rowsOfValues: the rows of values from the user's CSV
    const validateRowValues = (): void => {
        const invalidIndexes: Map<string, number[]> = new Map();
        const regexToIgnoreAddressLine2: RegExp = /Street2|Company/;
        for (let x = 0; x < rowsOfValues.length; ++x) {
            if (!rowsOfValues[x]) continue;
            for (let y = 0; y < rowsOfValues[x]!.length; ++y) {
                const value = rowsOfValues[x]![y] as string;
                if (regexToIgnoreAddressLine2.test(columnHeaders[y]!)) continue;
                if (value.length > 0) continue;
                const keyName: string = `Row: ${x + 1}`;
                const columnNumber: number = y + 1;
                if (invalidIndexes.has(keyName)) {
                    invalidIndexes.get(keyName)!.push(columnNumber);
                    continue;
                }
                invalidIndexes.set(keyName, [columnNumber]);
            }
        }
        if (!invalidIndexes.size) return;
        const errorFlagType: string = 'one or more empty values';
        const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, invalidIndexes);
        errorFlags.push(...errorFlagMessage);
        newValidationCheckpoint(`validateRowValues() → Validation for row values done, there were ${errorFlags.length} errors flagged`);
    }

    validateColumnHeaders(), validateRowValues();

    newValidationCheckpoint(`validateCsvContents() → Validation for column headers and row values done. Is the CSV valid: ${!errorFlags.length ? 'Yes' : 'No'}`)
    return [validationCheckpoints, errorFlags];
}

export default useValidation;