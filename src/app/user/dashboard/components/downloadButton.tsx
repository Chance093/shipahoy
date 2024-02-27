"use client";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function DownloadButton({ fileLink }: { fileLink: string }) {
  function downloadFile() {
    console.log(`Downloading file: ${fileLink}`);
  }

  return (
    <button className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-md bg-[#b4a3d8] text-black" onClick={downloadFile}>
      <ArrowDownTrayIcon className="w-6A" />
    </button>
  );
}
