'use strict';
'use client';
import React, { useState } from 'react';
import TestLabelsApiReq from './ApiReq';
export default function HandleCsv() {
    const [allErrorFlags, setAllErrorFlags] = useState<string[]>([]);
    const [payload, setPayload] = useState<object[]>([]);

    // @subroutine {Procedure} Void -> initialize an array to store error flags
    function createErrorFlags(checkpoints: string[]): string[] {
        const errorFlags: string[] = [];
        checkpoints.push('resetErrorFlags() → Array to store error flags is initialized.');
        return errorFlags;
    }

    // @subroutine {Function} Pure: [File | null, FileReader] -> extract & return the file from the upload (change) event and a new file reader
    // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
    function getFileAndInitNewReader(checkpoints: string[], event: React.ChangeEvent<HTMLInputElement>): [File | null, FileReader] {
        const file: File | null = event.target.files?.[0] ?? null;
        const reader = new FileReader();
        checkpoints.push('getFileAndInitNewReader() → File initialized and new FileReader() defined.');
        return [file, reader];
    }

    // @subroutine {Function} Pure: ProgressEvent<FileReader> -> extract & return the file contents from the file reader load event
    // @argument {ProgressEvent<FileReader>} event: the progress event triggered from a file reader load
    function getFileContents(checkpoints: string[], event: ProgressEvent<FileReader>): string | ArrayBuffer | null {
        const fileContents: string | ArrayBuffer | null = event.target?.result ?? null;
        checkpoints.push('getFileContents() → Raw file contents stored.');
        return fileContents;
    }

    // @subroutine {Function} Pure: string -> return the column headers and rows of values from the CSV
    // @argument {string} fileContents: the contents of the CSV
    function prepCsvContents(checkpoints: string[], fileContents: string): [string[], string[][]] {
        const rows: string[] = fileContents?.split('\r\n');
        const [columnHeaders, ...rowsOfValues]: string[][] = rows.map(row => row.split(','));
        checkpoints.push('prepCsvContents() → Column headers and rows of values are extracted from CSV.');
        return [columnHeaders, rowsOfValues];
    }

    // @subroutine {Function} Pure: string[] -> return the expected column headers, which derive from a CSV template; last checked 14 Oct 2023
    function getExpectedColumnHeaders(checkpoints: string[]): string[] {
        const expectedColumnHeaders: string[] = ['FromCountry', 'FromName', 'FromCompany', 'FromPhone', 'FromStreet1', 'FromStreet2', 'FromCity', 'FromZip', 'FromState', 'ToCountry', 'ToName', 'ToCompany', 'ToPhone', 'ToStreet1', 'ToStreet2', 'ToCity', 'ToZip', 'ToState', 'Length', 'Height', 'Width', 'Weight'];
        checkpoints.push('getExpectedColumnHeaders() → Expected column headers initalized and returned.');
        return expectedColumnHeaders;
    }

    // @subroutine {Function} Pure: string -> return the error flag message for the given error flag type
    // @argument {string} errorFlagType: the type of error flag
    function getErrorFlagMessage(checkpoints: string[], errorFlagType: string, ...errorFlagDetails: Array<string | number | Map<string, number[]>>): string[] {
        checkpoints.push(`getErrorFlagMessage() → New error flag: '${errorFlagType}', ${errorFlagDetails}`);
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
    function validateColumnHeadersAndGetResult(errorFlags: string[], checkpoints: string[], columnHeaders: string[]): boolean {
        const expectedColumnHeaders: string[] = getExpectedColumnHeaders(checkpoints);
        if (columnHeaders.length !== expectedColumnHeaders.length) {
            const errorFlagType: string = 'column header length';
            const errorFlagMessage: string[] = getErrorFlagMessage(checkpoints, errorFlagType);
            errorFlags.push(...errorFlagMessage);
        }
        for (let x = 0; x < expectedColumnHeaders.length; ++x) {
            if (columnHeaders[x] === expectedColumnHeaders[x]) continue;
            const errorFlagType: string = 'column header value';
            const errorFlagMessage: string[] = getErrorFlagMessage(checkpoints, errorFlagType, x + 1, columnHeaders[x], expectedColumnHeaders[x]);
            errorFlags.push(...errorFlagMessage);
        }
        checkpoints.push(`validateColumnHeadersAndGetResult() → Validation for column headers done, there were ${errorFlags.length} errors flagged`);
        if (errorFlags.length) return false;
        return true;
    }

    // @subroutine {Function} Impure: boolean -> return true if all required columns contain row values, false otherwise
    // @argument {string[][]} rowsOfValues: the rows of values from the user's CSV
    function validateRowValuesAndGetResult(errorFlags: string[], checkpoints: string[], rowsOfValues: string[][], columnHeaders: string[]): boolean {
        const invalidIndexes: Map<string, number[]> = new Map();
        const regexToIgnoreAddressLine2: RegExp = /Street2|Company/;
        for (let x = 0; x < rowsOfValues.length; ++x) {
            for (let y = 0; y < rowsOfValues[x].length; ++y) {
                const value: string = rowsOfValues[x][y];
                if (regexToIgnoreAddressLine2.test(columnHeaders[y])) continue;
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
        if (!invalidIndexes.size) return true;
        const errorFlagType: string = 'one or more empty values';
        const errorFlagMessage: string[] = getErrorFlagMessage(checkpoints, errorFlagType, invalidIndexes);
        errorFlags.push(...errorFlagMessage);
        checkpoints.push(`validateRowValuesAndGetResult() → Validation for row values done, there were ${errorFlags.length} errors flagged`);
        return false
    }

    // @subroutine {Function} Impure: boolean -> validate the column headers and row values then return true if both are vlaid, false otherwise
    // @argument {string[]} columnHeaders: the column headers from the CSV
    // @argument {string[][]} rowsOfValues: the rows of values from the CSV
    function validateCsvContents(errorFlags: string[], checkpoints: string[], [columnHeaders, rowsOfValues]: [string[], string[][]]) {
        const columnHeaderValidationResult = validateColumnHeadersAndGetResult(errorFlags, checkpoints, columnHeaders);
        const rowValueValidationResult = validateRowValuesAndGetResult(errorFlags, checkpoints, rowsOfValues, columnHeaders);
        checkpoints.push(`validateCsvContents() → Validation for column headers and row values done. Columns header valid: ${columnHeaderValidationResult} & row values valid: ${rowValueValidationResult}`);
        if (columnHeaderValidationResult && rowValueValidationResult) return true;
        return false;
    }

    // @subroutine {Procedure} Void -> log the instructions for now, the modal needs to be implemented
    // @argument {string} title: the title describing what the modal is for
    // @argument {string} message: a message letting the user know what to do
    function userInstructionModal(checkpoints: string[], title: string, message: string) {
        checkpoints.push(`userInstructionModal() → ${title}: ${message}`);
        console.log('%s\n%s', title, message);
    }
    // @subroutine {Function} Pure: Map<string, string[]> -> return a map such that each key is a column header and each value is an array of values for that column
    // @argument {string[]} columnHeaders: the column headers from the CSV
    // @argument {string[][]} rowsOfValues: the rows of values from the CSV
    function transformCsvContents(checkpoints: string[], [columnHeaders, rowsOfValues]: [string[], string[][]]): Map<string, string[]> {
        const transformedCsvContents: Map<string, string[]> = new Map();
        for (const header of columnHeaders) transformedCsvContents.set(header, []);
        for (const row of rowsOfValues) {
            for (let x = 0; x < row.length; ++x) {
                const header: string = columnHeaders[x];
                transformedCsvContents.get(header)!.push(row[x]);
            }
        }
        checkpoints.push('transformCsvContents() → CSV contents transformed from (x, y) to (y, x).');
        return transformedCsvContents;
    }

    // @subroutine {Function} Pure: Map<string, string[]> -> return the size of the payload, which is the number of rows in a column
    // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x)
    function getPayloadSize(checkpoints: string[], transformedCsvContents: Map<string, string[]>): number {
        let payloadSize: number = 0;
        for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
            payloadSize = rowsInColumn.length;
            break;
        }
        checkpoints.push(`getPayloadSize() → Payload size calculated, there are ${payloadSize} labels in this request.`)
        return payloadSize;
    }

    // @subroutine {Function} Pure: Map<string, string[]> -> return an array of objects, each object is a payload for a label
    // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x) 
    function createPayload(checkpoints: string[], transformedCsvContents: Map<string, string[]>, payloadSize: number): object[] {
        const payload: object[] = [];
        for (let x = 0; x < payloadSize; ++x) {
            const payloadObject: { [key: string]: string} = {};
            for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
                payloadObject[columnHeader] = rowsInColumn[x];
            }
            payload.push(payloadObject);
        }
        checkpoints.push('createPayload() → Payload created:');
        return payload;
    }

    // @subroutine {Procedure && Helper} Void -> from file upload, extract the file and read it as text for now
    // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
    function csvHandlingHelper(event: React.ChangeEvent<HTMLInputElement>): void {
        setPayload([]);
        const checkpoints: string[] = ['csvHandlingHelper() → Checkpoints enabled.'];
        const errorFlags: string[] = createErrorFlags(checkpoints);
        const [file, reader]: [File | null, FileReader] = getFileAndInitNewReader(checkpoints, event);       
        if (file) reader.readAsText(file), checkpoints.push('csvHandlingHelper() → ProgressEvent<FileReader> triggered.');
        reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
            checkpoints.push('csvHandlingHelper() → ProgressEvent<FileReader> loaded.');
            const fileContents = getFileContents(checkpoints, readerEvent);
            const preppedCsvContents = prepCsvContents(checkpoints, fileContents as string) as [string[], string[][]];
            const csvValidationResult: boolean = validateCsvContents(errorFlags, checkpoints, preppedCsvContents);
            if (!csvValidationResult) {
                setAllErrorFlags(errorFlags);
                console.log(checkpoints.join('\n\n'));
                return userInstructionModal(checkpoints, 'Your CSV is invalid.', 'Please fix the errors and try again.');
            }  
            const transformedCsvContents: Map<string, string[]> = transformCsvContents(checkpoints, preppedCsvContents);
            const payloadSize: number = getPayloadSize(checkpoints, transformedCsvContents);
            const payload: object[] = createPayload(checkpoints, transformedCsvContents, payloadSize);
            setAllErrorFlags(errorFlags);
            setPayload(payload)
            // console.log(checkpoints.join('\n\n'));
        }
    }

    return (
        <section className="flex flex-col justify-center items-center gap-24 card">
            <input onChange={csvHandlingHelper} name='upload_csv' id='upload_csv' type="file" accept=".csv" className="upload-btn"/>
            { allErrorFlags.map((errorFlag, index) => <div key={index} className='text-warning'>{errorFlag}</div>) }
            <TestLabelsApiReq payload={ payload }/>
        </section>
    )
}