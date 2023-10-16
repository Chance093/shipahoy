'use client';
'use strict';
import React, { useState } from 'react';
import { set } from 'zod';
export default function CsvHandler() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [errorFlags, setErrorFlags] = useState<string[]>([]);

    // @subroutine {Procedure} Void -> reset the state of error flags to an empty array, there are no errors before a CSV is uploaded
    function resetErrorFlags() {
        setErrorFlags([]);
    }

    // @subroutine {Function} Pure: [File | null, FileReader] -> extract & return the file from the upload (change) event and a new file reader
    // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
    function getFileAndInitNewReader(event: React.ChangeEvent<HTMLInputElement>): [File | null, FileReader] {
        return [event.target.files?.[0] ?? null, new FileReader()];
    }

    // @subroutine {Function} Pure: ProgressEvent<FileReader> -> extract & return the file contents from the file reader load event
    // @argument {ProgressEvent<FileReader>} event: the progress event triggered from a file reader load
    function getFileContents(event: ProgressEvent<FileReader>): string | ArrayBuffer | null {
        return event.target?.result ?? null;
    }

    function prepCsvContents(fileContents: string): [string[], string[][]] {
        const rows: string[] = fileContents?.split('\r\n');
        const [columnHeaders, ...rowsOfValues]: string[][] = rows.map(row => row.split(','));
        return [columnHeaders, rowsOfValues];
    }

    // @subroutine {Function} Pure: string[] -> return the expected column headers, which derive from a CSV template; last checked 14 Oct 2023
    function getExpectedColumnHeaders(): string[] {
        return ['FromCountry', 'FromName', 'FromCompany', 'FromPhone', 'FromStreet1', 'FromStreet2', 'FromCity', 'FromZip', 'FromState', 'ToCountry', 'ToName', 'ToCompany', 'ToPhone', 'ToStreet1', 'ToStreet2', 'ToCity', 'ToZip', 'ToState', 'Length', 'Height', 'Width', 'Weight'];
    }

    // @subroutine {Function} Pure: string -> return the error flag message for the given error flag type
    // @argument {string} errorFlagType: the type of error flag
    function getErrorFlagMessage(errorFlagType: string, ...errorFlagDetails: Array<string | number | Map<string, number[]>>): string[] {
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
                    errorFlagMessage.push(`${key} has empty values in column(s) ${columnNumbers}.`);
                }
                return errorFlagMessage; 
            default:
                return errorFlagMessage;
        }
    }

    // @subroutine {Function} Impure: boolean -> return true if the user's CSV's column headers are equivalent to the expected column headers, false otherwise
    // @argument {string[]} columnHeaders: the column headers from the user's CSV
    function validateColumnHeadersAndGetResult(columnHeaders: string[]): boolean {
        const expectedColumnHeaders: string[] = getExpectedColumnHeaders();
        if (columnHeaders.length !== expectedColumnHeaders.length) {
            const errorFlagType: string = 'column header length';
            const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType);
            setErrorFlags([...errorFlagMessage]);
        }
        for (let x = 0; x < expectedColumnHeaders.length; ++x) {
            if (columnHeaders[x] === expectedColumnHeaders[x]) continue;
            const errorFlagType: string = 'column header value';
            const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, x + 1, columnHeaders[x], expectedColumnHeaders[x]);
            setErrorFlags([...errorFlags, ...errorFlagMessage]);
        }
        if (errorFlags.length) return false;
        return true;
    }

    // @subroutine {Function} Impure: boolean -> return true if all required columns contain row values, false otherwise
    // @argument {string[][]} rowsOfValues: the rows of values from the user's CSV
    function validateRowValuesAndGetResult(rowsOfValues: string[][]): boolean {
        const invalidIndexes: Map<string, number[]> = new Map();
        const regexToIgnoreAddressLine2: RegExp = /Street2/;
        for (let x = 0; x < rowsOfValues.length; ++x) {
            for (let y = 0; y < rowsOfValues[x].length; ++y) {
                const value: string = rowsOfValues[x][y];
                if (regexToIgnoreAddressLine2.test(value)) continue;
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
        if (invalidIndexes.size) return true;
        const errorFlagType: string = 'one or more empty values';
        const errorFlagMessage: string[] = getErrorFlagMessage(errorFlagType, invalidIndexes);
        setErrorFlags([...errorFlags, ...errorFlagMessage]);
        return false
    }

    // @subroutine {Function} Impure: boolean -> validate the column headers and row values then return true if both are vlaid, false otherwise
    // @argument {string[]} columnHeaders: the column headers from the CSV
    // @argument {string[][]} rowsOfValues: the rows of values from the CSV
    function validateCsvContents([columnHeaders, rowsOfValues]: [string[], string[][]]) {
        const columnHeaderValidationResult = validateColumnHeadersAndGetResult(columnHeaders);
        const rowValueValidationResult = validateRowValuesAndGetResult(rowsOfValues);
        if (columnHeaderValidationResult && rowValueValidationResult) return true;
        return false;
    }

    // @subroutine {Procedure} Void -> log the instructions for now, the modal needs to be implemented
    // @argument {string} title: the title describing what the modal is for
    // @argument {string} message: a message letting the user know what to do
    function userInstructionModal(title: string, message: string) {
        console.log('%s\n%s', title, message);
    }
    // @subroutine {Function} Pure: Map<string, string[]> -> return a map such that each key is a column header and each value is an array of values for that column
    // @argument {string[]} columnHeaders: the column headers from the CSV
    // @argument {string[][]} rowsOfValues: the rows of values from the CSV
    function transformCsvContents([columnHeaders, rowsOfValues]: [string[], string[][]]): Map<string, string[]> {
        const transformedCsvContents: Map<string, string[]> = new Map();
        for (const header of columnHeaders) transformedCsvContents.set(header, []);
        for (const row of rowsOfValues) {
            for (let x = 0; x < row.length; ++x) {
                const header: string = columnHeaders[x];
                transformedCsvContents.get(header)!.push(row[x]);
            }
        }
        return transformedCsvContents;
    }

    // @subroutine {Function} Pure: Map<string, string[]> -> return the size of the payload, which is the number of rows in a column
    // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x)
    function getPayloadSize(transformedCsvContents: Map<string, string[]>): number {
        let payloadSize: number = 0;
        for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
            payloadSize = rowsInColumn.length;
            break;
        }
        return payloadSize;
    }

    // @subroutine {Function} Pure: Map<string, string[]> -> return an array of objects, each object is a payload for a label
    // @argument {Map<string, string[]>} transformedCsvContents: the CSVs contents transformed from (x, y) to (y, x) 
    function createPayload(transformedCsvContents: Map<string, string[]>, payloadSize: number): object[] {
        const payload: object[] = [];
        for (let x = 0; x < payloadSize; ++x) {
            const payloadObject: { [key: string]: string} = {};
            for (const [columnHeader, rowsInColumn] of transformedCsvContents) {
                payloadObject[columnHeader] = rowsInColumn[x];
            }
            payload.push(payloadObject);
        }
        return payload;
    }

    // @subroutine {Procedure && Helper} Void -> from file upload, extract the file and read it as text for now
    // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
    function csvHandlingHelper(event: React.ChangeEvent<HTMLInputElement>): void {
        resetErrorFlags();
        const [file, reader]: [File | null, FileReader] = getFileAndInitNewReader(event);       
        if (file) reader.readAsText(file);
        reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
            const fileContents = getFileContents(readerEvent);
            const preppedCsvContents = prepCsvContents(fileContents as string) as [string[], string[][]];
            const csvValidationResult: boolean = validateCsvContents(preppedCsvContents);
            if (!csvValidationResult) return userInstructionModal('Your CSV is invalid.', 'Please fix the errors and try again.'); 
            const transformedCsvContents: Map<string, string[]> = transformCsvContents(preppedCsvContents);
            const payloadSize: number = getPayloadSize(transformedCsvContents);
            const payload: object[] = createPayload(transformedCsvContents, payloadSize);
            console.log(payload);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gradient-start to-gradient-end">
            <input onChange={csvHandlingHelper} name='upload_csv' id='upload_csv' type="file" accept=".csv" className="upload-btn"/>
            <div className='paragraph'>{ uploadedFile ? uploadedFile.name : '' }</div>
            <div className='text-red-500'>{ errorFlags }</div>
        </div>
    )
}