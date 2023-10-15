'use client';
'use strict';
import test from 'node:test';
import React, { useState, useEffect } from 'react';
export default function CsvHandler() {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [fileContents, setFileContents] = useState<string | ArrayBuffer | null>(null);
    const [errorFlags, setErrorFlags] = useState<string[]>([]);

    // @subroutine {Function} Pure: [File | null, FileReader] -> extract & return the file from the upload (change) event and a new file reader
    // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
    function getFileAndInitNewReader(event: React.ChangeEvent<HTMLInputElement>): [File | null, FileReader] {
        return [event.target.files?.[0] ?? null, new FileReader()];
    }

    // @subroutine {Function} Pure: ProgressEvent<FileReader> -> return the result of the file reader 'no result' if null
    // @argument {ProgressEvent<FileReader>} event: the progress event triggered from a file reader load
    function fileLoaded(event: ProgressEvent<FileReader>): string | ArrayBuffer | null {
        return event.target?.result ?? 'no result';
    }

    function prepCsvContents(fileContents: string) {
        const rows: string[] = fileContents?.split('\r\n');
        const [columnHeaders, ...rowValues]: [string[], string[][]] = rows.map(row => row.split(',')) as [string[], string[][]];
        return [columnHeaders, rowValues];
    }

    // @subroutine {Function} Pure: string[] -> return the expected column headers, which derive from a CSV template; last checked 14 Oct 2023
    function getExpectedColumnHeaders(): string[] {
        return ['FromCountry', 'FromName', 'FromCompany', 'FromPhone', 'FromStreet1', 'FromStreet2', 'FromCity', 'FromZip', 'FromState', 'ToCountry', 'ToName', 'ToCompany', 'ToPhone', 'ToStreet1', 'ToStreet2', 'ToCity', 'ToZip', 'ToState', 'Length', 'Height', 'Width', 'Weight'];
    }

    // @subroutine {Function} Pure: string -> return the error flag message for the given error flag type
    // @argument {string} errorFlagType: the type of error flag
    function getErrorFlagMessage(errorFlagType: string, ...errorFlagDetails): string {
        switch (errorFlagType) {
            case 'column header length':
                return 'Your CSV\'s column headers do not match those of our template.';
            case 'column header value':
                return '';
            default:
                return '';
        }
    }

    function validateColumnHeaders(columnHeaders: string[]) {
        const expectedColumnHeaders: string[] = getExpectedColumnHeaders();
        if (columnHeaders.length !== expectedColumnHeaders.length) {
            const errorFlagType: string = 'column header length';
            const errorFlagMessage: string = getErrorFlagMessage(errorFlagType);
            setErrorFlags([errorFlagMessage]);
        }
        for (let x = 0; x < expectedColumnHeaders.length; ++x) {
            const errorFlagType: string = 'column header value';
            const errorFlagMessage: string = getErrorFlagMessage(errorFlagType);
            if (columnHeaders[x] !== expectedColumnHeaders[x]) {
                setErrorFlags([...errorFlags, `Column ${x + 1}'s header is ${columnHeaders[x]}; it should be ${expectedColumnHeaders[x]}.`]);
            }
        }

    }

    function validateRowValues(rowValues: string[][]) {

    }

    function validateCsvContents([columnHeaders, rowValues]: [string[], string[][]]) {
        const columnHeaderValidationResult = validateColumnHeaders(columnHeaders);
        
    }

    // @subroutine {Procedure && Helper} Void -> from file upload, extract the file and read it as text for now
    // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
    function csvHandlingHelper(event: React.ChangeEvent<HTMLInputElement>): void {
        const [file, reader]: [File | null, FileReader] = getFileAndInitNewReader(event);       
        if (file) setUploadedFile(file);
        if (file) reader.readAsText(file);
        reader.onload = (event) => setFileContents(fileLoaded(event));
        const preppedCsvContents = prepCsvContents(fileContents as string);
        const isCsvValid = validateCsvContents(preppedCsvContents);
        
    }

    useEffect(() => {
        // console.log(uploadedFile);
        // console.log(fileContents);
    }, [uploadedFile, fileContents]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gradient-start to-gradient-end">
            <input onChange={csvHandlingHelper} name='upload_csv' id='upload_csv' type="file" accept=".csv" className="upload-btn"/>
            <div className='paragraph'>{ uploadedFile ? uploadedFile.name : '' }</div>
            <div>{ errorFlags }</div>
        </div>
    )
}