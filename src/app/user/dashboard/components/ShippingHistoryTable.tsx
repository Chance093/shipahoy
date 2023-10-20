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
    <div className='w-full card overflow-x-scroll'>
      <table className='border-collapse text-left overflow-x-scroll'>
        <thead>
          <tr className='border-b border-purple-200/20'>
            <th className='p-5'>#</th>
            <th className='p-5'>Date</th>
            <th className='p-5'>Size</th>
            <th className='p-5'>Type</th>
            <th className='p-5'>Price</th>
            <th className='p-5'>Files</th>
          </tr>
        </thead>

        <tbody>
          {shippingHistory?.map((item) => (
            <>
              <tr
                className='border-b border-purple-200/20 text-xs whitespace-nowrap'
                key={item.label_group.id}
              >
                <td className='p-5' key={item.label_group.id}>
                  {item.invoice.id}
                </td>
                <td className='p-5' key={item.label_group.id}>
                  {format(item.invoice.createAt!, 'MM-dd-yyyy')}
                </td>
                <td className='p-5' key={item.label_group.id}>
                  {item.label_group.labelCount}
                </td>
                <td className='p-5' key={item.label_group.id}>
                  {item.shipping_service.service}
                </td>
                <td className='p-5' key={item.label_group.id}>
                  ${item.invoice.totalPrice}
                </td>
                <td className='p-5' key={item.label_group.id}>
                  ^
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
