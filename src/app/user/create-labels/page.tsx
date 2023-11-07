"use strict";
// import TestLabelsApiReq from './components/ApiReq';

import HandleCsv from './components/HandleCsv';
import SingleLabelCreation from './components/SingleLabelCreation';
import Modal from '~/app/components/Modal';

export default function placeholder() {
  async function onClose() {
    'use server';
    console.log('onClose');
  }

  async function onOk() {
    'use server';
    console.log('onOk');
  }

  return (
    <main className="ml-72 flex flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Create Labels</h1>

      <HandleCsv />
      <SingleLabelCreation />
    </main>
  );
}
