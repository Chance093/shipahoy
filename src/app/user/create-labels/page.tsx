'use strict';
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
    <main className='mt-16 ml-72'>

      <Modal title='Test Labels' onClose={onClose} onOk={onOk}> 
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam dignissimos vero error dolor, dicta a quaerat maiores est explicabo, illo eum, porro ipsum non officiis voluptatem odit neque reprehenderit vel?</p>
      </Modal>
      <HandleCsv />
      <SingleLabelCreation />
    </main>
  );
}
