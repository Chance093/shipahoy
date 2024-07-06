import type { Metadata } from "next";
import { api } from "~/trpc/server";
import InvoiceTable from "../../components/InvoiceTable";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import Card from "../../components/Card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Accounting | Proglo Shipping",
  description:
    "Track all your invoices and view your current balance. See a detailed list of all the wire transfers you've made and stay up-to-date with your account status",
};

export default async function Accounting() {
  const balance = await api.balance.getAmount.query();
  const invoiceCount = await api.userData.getInvoiceCount.query();

  return (
    <>
      <Card title="Balance" body={`$${balance.amount}`}>
        <BanknotesIcon className="w-6 text-purple" />
      </Card>

      <InvoiceTable type="user" userId={undefined} invoiceCount={invoiceCount} />
    </>
  );
}
