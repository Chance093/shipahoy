"use client";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function DownloadButton({ fileLink }: { fileLink: string }) {
  async function requestFile() {
    function downloadFile(url: string, filename: string): void {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    try {
      const response = await fetch(fileLink);
      const contents = await response.blob();
      const url = URL.createObjectURL(contents);
      const fileExtension = fileLink.match(/\.([^.]+)$/)?.[1];
      const fileName = fileLink.match(/(?<=-)[^-\.]+(?=\.[^-]*$)/)?.[0];
      downloadFile(url, `${fileName}${fileExtension}`);
      console.log(`Status: ${response.status}`);
      return response.status;
    } catch (error) {
      console.log(`%cReq failed: ${JSON.stringify(error)}`, "color: red");
      return new Error(`Req failed: ${JSON.stringify(error)}`);
    }
  }

  return (
    <button className="flex h-8 w-12 cursor-pointer items-center justify-center rounded-md bg-[#b4a3d8] text-black" onClick={requestFile}>
      <ArrowDownTrayIcon className="w-6" />
    </button>
  );
}
