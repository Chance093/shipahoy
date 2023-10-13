import { composeUploadHandlers } from "node_modules/@trpc/server/dist/adapters/node-http/content-type/form-data/uploadHandler";
import { useState } from "react";
export default function CsvHandler() {
    return <input type="file" className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "/>
}

