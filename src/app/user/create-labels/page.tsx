"use strict";
// import TestLabelsApiReq from './components/ApiReq';

import HandleCsv from "./components/HandleCsv";
import SingleLabelCreation from "./components/SingleLabelCreation";
import Modal from "~/app/components/Modal";

export default function placeholder() {
  async function onClose() {
    "use server";
    console.log("onClose");
  }

  async function onOk() {
    "use server";
    console.log("onOk");
  }

  return (
    <main className="ml-72 flex flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Create Labels</h1>

      <HandleCsv />
      <section className="my-8 flex items-center gap-8">
        <div className="flex-1 border-b border-[#b4a3d8]"></div>
        <div className="h-2 w-2 rounded-full bg-[#b4a3d8]"></div>
        <div className="flex-1 border-b border-[#b4a3d8]"></div>
      </section>
      <SingleLabelCreation />
    </main>
  );
}
