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
        const [columnHeaders, ...rowValues]: string[][] = rows.map(row => row.split(','));
        return [columnHeaders, rowValues];
    }

    // @subroutine {Procedure && Helper} Void -> from file upload, extract the file and read it as text for now
    // @argument {React.ChangeEvent<HTMLInputElement>} event: the change event triggered from a file upload
    function csvHandlingHelper(event: React.ChangeEvent<HTMLInputElement>): void {
        const [file, reader]: [File | null, FileReader] = getFileAndInitNewReader(event);       
        if (file) setUploadedFile(file);
        if (file) reader.readAsText(file);
        reader.onload = (event) => setFileContents(fileLoaded(event));
        const preppedCsvContents = prepCsvContents(fileContents as string);
        
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