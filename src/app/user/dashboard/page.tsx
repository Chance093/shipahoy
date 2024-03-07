import { api } from "~/trpc/server";
import ShippingHistoryTable from "./components/ShippingHistoryTable";
import Card from "./components/Card";
import { DocumentPlusIcon, BanknotesIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

export default async function Dashboard() {
  const balance = await api.balance.getAmount.query();
  const shippingHistory = await api.labelGroup.getShippingHistory.query();
  let labelCount = 0;
  shippingHistory.forEach((item) => (labelCount += item.labelCount));

  return (
    <main className="ml-72 flex min-h-screen flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Dashboard</h1>
      <section className="flex gap-8">
        <Card title="Labels" body={labelCount}>
          <DocumentPlusIcon className="w-6 text-purple" />
        </Card>
        <Card title="Orders" body={shippingHistory.length}>
          <ClipboardDocumentListIcon className="w-6 text-purple" />
        </Card>
        <Card title="Balance" body={`$${balance ? balance.amount : "0.00"}`}>
          <BanknotesIcon className="w-6 text-purple" />
        </Card>
      </section>

      <ShippingHistoryTable shippingHistory={shippingHistory} />
    </main>
  );
}
