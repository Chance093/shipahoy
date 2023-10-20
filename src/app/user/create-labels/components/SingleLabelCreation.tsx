export default function SingleLabelCreation() {
    return (
        <section className='std-padding'>
            <div className='flex flex-col card'>
                <div className='card-heading subheading'>Create a single label</div>
                <div className='m-4 flex flex-col'>
                    <div className='flex justify-between items-end py-4 paragraph'><span className='field-label'>Service:</span> USPS Priority 0-70lbs</div>
                    <div className='flex justify-between items-end py-4 paragraph'><span className='field-label'>Label:</span> e-VS</div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="mx-4">
                        <label htmlFor="weight" className="field-label">Weight</label>
                        <input id="weight" type="text" className="input" placeholder="lbs" />
                    </div>
                    <div className="mx-4">
                        <label htmlFor="length" className="field-label">Length</label>
                        <input id="length" type="text" className="input" placeholder="inches"/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="width" className="field-label">Width</label>
                        <input id="width" type="text" className="input" placeholder="inches"/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="height" className="field-label">Height</label>
                        <input id="height" type="text" className="input" placeholder="inches"/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_name" className="field-label">Sender name</label>
                        <input id="sender_name" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_company" className="field-label">Sender company</label>
                        <input id="sender_company" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_address_line" className="field-label">Sender address line</label>
                        <input id="sender_address_line" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_address_line_2" className="field-label">Sender address line 2</label>
                        <input id="sender_address_line_2" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_zip code" className="field-label">Sender zip code</label>
                        <input id="code" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_city" className="field-label">Sender city</label>
                        <input id="sender_city" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_state" className="field-label">Sender state</label>
                        <input id="sender_state" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_country" className="field-label">Sender country</label>
                        <input id="sender_country" type="text" className="input" value="United States"/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="sender_phone" className="field-label">Sender phone</label>
                        <input id="sender_phone" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_name" className="field-label">Recipient name</label>
                        <input id="recipient_name" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_company" className="field-label">Recipient company</label>
                        <input id="recipient_company" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_address_line" className="field-label">Recipient address line</label>
                        <input id="recipient_address_line" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_address_line_2" className="field-label">Recipient address line 2</label>
                        <input id="recipient_address_line_2" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_zip code" className="field-label">Recipient zip code</label>
                        <input id="code" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_city" className="field-label">Recipient city</label>
                        <input id="recipient_city" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_state" className="field-label">Recipient state</label>
                        <input id="recipient_state" type="text" className="input" placeholder=""/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_country" className="field-label">Recipient country</label>
                        <input id="recipient_country" type="text" className="input" value="United States"/>
                    </div>
                    <div className="mx-4">
                        <label htmlFor="recipient_phone" className="field-label">Recipient phone</label>
                        <input id="recipient_phone" type="text" className="input" placeholder=""/>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <button className="my-4 w-1/2 flex justify-center items-center btn-primary">Create label</button>
                </div>
            </div>
        </section>
    )
}