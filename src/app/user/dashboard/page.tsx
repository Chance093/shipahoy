import { api } from "~/trpc/server";
import ShippingHistoryTable from "./components/ShippingHistoryTable";

export default async function Dashboard() {
  const balance = await api.balance.getAmount.query();
  const shippingHistory = await api.labelGroup.getShippingHistory.query();
  let labelCount = 0;
  shippingHistory.map((item) => (labelCount += item.labelCount));

  return (
    <main className="ml-72 mt-16 flex flex-col gap-6 px-5 py-7">
      <h1 className="heading pl-2">Welcome Back!</h1>
      <section className="flex gap-12">
        <section className="card flex h-32 flex-1 flex-col justify-between p-5">
          <p className="font-bold">Labels Created</p>
          <p className="text-4xl">{labelCount}</p>
        </section>
        <section className="card flex h-32 flex-1 flex-col justify-between p-5">
          <p className="font-bold">Balance</p>
          <p className="text-4xl">$ {balance ? balance.amount : "0.00"}</p>
        </section>
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="subheading pl-2">Shipping History</h2>
        <ShippingHistoryTable />
      </section>
    </main>
  );
}
