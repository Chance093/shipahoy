'use strict';
import axios from 'axios';
interface Payload {
    payload: object[]
}
export default function TestLabelsApiReq({ payload }: Payload ) {
    async function sendReq() {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://api.weshipsmart.com/api/v2/order/read-orders',
            headers: { 
                'x-api-key': '838f1031-44d9-4231-94dd-1e8f9e7b5148'
            }
        };

        axios(config)
            .then(response => {
                console.log(JSON.stringify(response.data));
            })
            .catch(error => {
                console.log(error);
            });
    }
  return (
    <div>
        <button onClick={sendReq} className='btn-primary'>Test request</button>
        { payload.map((label, index) => <div key={index} className='paragraph'>{JSON.stringify(label)}</div>) }
    </div>
  )
}