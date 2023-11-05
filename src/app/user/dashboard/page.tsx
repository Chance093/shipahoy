import { api } from "~/trpc/server";
import ShippingHistoryTable from "./components/ShippingHistoryTable";

export default async function Dashboard() {
  const balance = await api.balance.getAmount.query();
  const shippingHistory = await api.labelGroup.getShippingHistory.query();
  let labelCount = 0;
  shippingHistory.map((item) => (labelCount += item.labelCount));

  return (
    <main className="ml-72 flex flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Dashboard</h1>
      <section className="flex gap-8">
        <section className="bg-radial-gradient before:bg-linear-gradient relative flex  h-48 max-w-xs flex-1 flex-col justify-between rounded-lg  p-5 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-[194px] before:w-[322px] before:-translate-x-[1px] before:-translate-y-[1px] before:rounded-lg before:content-['']">
          <p>Labels</p>
          <p className="text-4xl">{labelCount}</p>
        </section>
        <section className="bg-radial-gradient before:bg-linear-gradient relative flex  h-48 max-w-xs flex-1 flex-col justify-between rounded-lg  p-5 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-[194px] before:w-[322px] before:-translate-x-[1px] before:-translate-y-[1px] before:rounded-lg before:content-['']">
          <p>Balance</p>
          <p className="text-4xl">$ {balance ? balance.amount : "0.00"}</p>
        </section>
      </section>
      <section className="bg-radial-gradient flex flex-col gap-2 rounded-lg">
        <h2 className=" pl-2">Shipping History</h2>
        <ShippingHistoryTable />
      </section>
    </main>
  );
}
