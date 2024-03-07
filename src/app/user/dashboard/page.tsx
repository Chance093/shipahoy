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
    <>
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
    </>
  );
}
