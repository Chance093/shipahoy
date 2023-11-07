"use strict";
// import TestLabelsApiReq from './components/ApiReq';
import HandleCsv from "./components/HandleCsv";
import SingleLabelCreation from "./components/SingleLabelCreation";
export default function placeholder() {
  return (
    <main className="ml-72 flex flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Create Labels</h1>
      <HandleCsv />
      <SingleLabelCreation />
    </main>
  );
}
