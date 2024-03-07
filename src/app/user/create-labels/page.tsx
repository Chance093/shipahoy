"use strict";
// import TestLabelsApiReq from './components/ApiReq';

import HandleCsv from "./components/HandleCsv";
import SingleLabelCreation from "./components/SingleLabelCreation";

export default function placeholder() {
  return (
    <>
      <HandleCsv />
      <section className="my-8 flex items-center justify-center gap-12">
        <div className="h-2 w-2 rounded-full bg-white/50"></div>
        <div className="h-2 w-2 rounded-full bg-white/50"></div>
        <div className="h-2 w-2 rounded-full bg-white/50"></div>
      </section>
      <SingleLabelCreation />
    </>
  );
}
