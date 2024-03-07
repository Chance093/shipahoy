import { api } from "~/trpc/server";
import InvoiceTable from "./components/InvoiceTable";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import Card from "../dashboard/components/Card";

export default async function accounting() {
  const balance = await api.balance.getAmount.query();
  const invoices = await api.invoice.getInvoices.query();

  return (
    <>
      <Card title="Balance" body={`$${balance ? balance.amount : "0.00"}`}>
        <BanknotesIcon className="w-6 text-purple" />
      </Card>

      <InvoiceTable invoices={invoices} />
    </>
  );
}
