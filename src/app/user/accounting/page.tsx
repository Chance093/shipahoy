import { api } from "~/trpc/server";
import InvoiceTable from "./components/InvoiceTable";

export default async function accounting() {
  const balance = await api.balance.getAmount.query();
  return (
    <main className="ml-72 flex flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Accounting</h1>
      <section className="flex gap-12">
        <section className="bg-radial-gradient before:bg-linear-gradient relative flex  h-48 max-w-xs flex-1 flex-col justify-between rounded-lg  p-5 before:absolute before:bottom-0 before:left-0 before:right-0 before:top-0 before:-z-10 before:h-[194px] before:w-[322px] before:-translate-x-[1px] before:-translate-y-[1px] before:rounded-lg before:content-['']">
          <p>Balance</p>
          <p className="text-4xl">$ {balance ? balance.amount : "0.00"}</p>
        </section>
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="subheading pl-2">Invoices</h2>
        <InvoiceTable />
      </section>
    </main>
  );
}
