import type { Metadata } from "next";
import { api } from "~/trpc/server";
import ShippingHistoryTable from "../../components/ShippingHistoryTable";
import Card from "../../components/Card";
import { DocumentPlusIcon, BanknotesIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Proglo Shipping",
  description:
    "Manage and download all your created labels, track the number of labels made, and view your current balance on your personalized dashboard.",
};

export default async function Dashboard() {
  const balance = await api.balance.getAmount.query();
  const { labelCount, orderCount } = await api.userData.getLabelAndOrderCount.query();

  return (
    <>
      <section className="flex gap-8">
        <Card title="Labels" body={labelCount}>
          <DocumentPlusIcon className="w-6 text-purple" />
        </Card>
        <Card title="Orders" body={orderCount}>
          <ClipboardDocumentListIcon className="w-6 text-purple" />
        </Card>
        <Card title="Balance" body={`$${balance.amount}`}>
          <BanknotesIcon className="w-6 text-purple" />
        </Card>
      </section>

      <ShippingHistoryTable type="user" userId={undefined} orderCount={orderCount} />
    </>
  );
}
