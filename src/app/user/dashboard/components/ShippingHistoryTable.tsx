import { format } from 'date-fns';

type ShippingHistory =
  | {
      label_group: {
        id: number;
        userId: string;
        invoiceId: number;
        uspsServiceId: number | null;
        uspsExternalServiceId: number | null;
        labelCount: number;
        pdf: Blob;
      };
      shipping_service: {
        id: number;
        service: string;
      };
      invoice: {
        id: number;
        userId: string;
        balanceId: number;
        paymentStatusId: number;
        totalPrice: number;
        paymentMethod: string;
        createAt: number;
      };
    }[]
  | undefined;

export default function ShippingHistoryTable({
  shippingHistory,
}: {
  shippingHistory: ShippingHistory;
}) {
  return (
    <ul className='w-full card overflow-x-scroll text-left'>
      <li className='border-b border-purple-200/20 flex justify-between'>
        <p className='p-5'>#</p>
        <p className='p-5'>Date</p>
        <p className='p-5'>Size</p>
        <p className='p-5'>Type</p>
        <p className='p-5'>Price</p>
        <p className='p-5'>Files</p>
      </li>
      {shippingHistory?.map((item) => (
        <>
          <li
            className='border-b border-purple-200/20 text-xs flex justify-between'
            key={item.label_group.id}
          >
            <p className='p-5' key={item.label_group.id}>
              {item.invoice.id}
            </p>
            <p className='p-5' key={item.label_group.id}>
              {format(item.invoice.createAt!, 'MM-dd-yyyy')}
            </p>
            <p className='p-5' key={item.label_group.id}>
              {item.label_group.labelCount}
            </p>
            <p className='p-5' key={item.label_group.id}>
              {item.shipping_service.service}
            </p>
            <p className='p-5' key={item.label_group.id}>
              ${item.invoice.totalPrice}
            </p>
            <p className='p-5' key={item.label_group.id}>
              ^
            </p>
          </li>
        </>
      ))}
    </ul>
  );
}
