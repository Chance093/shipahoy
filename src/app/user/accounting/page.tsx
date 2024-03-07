import { api } from "~/trpc/server";
import InvoiceTable from "./components/InvoiceTable";
import { BanknotesIcon } from "@heroicons/react/24/solid";

export default async function accounting() {
  const balance = await api.balance.getAmount.query();
  return (
    <>
      <section className="h-48 w-80 rounded-2xl bg-linear-gradient">
        <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between rounded-2xl bg-radial-gradient p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-custom-gray/10">
              <BanknotesIcon className="w-6 text-purple" />
            </div>
            <p className="text-xl">Balance</p>
          </div>
          <p className="py-4 text-5xl">$ {balance ? balance.amount : "0.00"}</p>
        </div>
      </section>
      <InvoiceTable />
    </>
  );
}
