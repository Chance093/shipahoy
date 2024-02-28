import { api } from "~/trpc/server";
import ShippingHistoryTable from "./components/ShippingHistoryTable";
import { DocumentPlusIcon, BanknotesIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

export default async function Dashboard() {
  const balance = await api.balance.getAmount.query();
  const shippingHistory = await api.labelGroup.getShippingHistory.query();
  let labelCount = 0;
  shippingHistory.map((item) => (labelCount += item.labelCount));

  return (
    <main className="ml-72 flex min-h-screen flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Dashboard</h1>
      <section className="flex gap-8">
        <section className="h-48 w-80 rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between rounded-2xl bg-radial-gradient p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-custom-gray/10">
                <DocumentPlusIcon className="w-6 text-purple" />
              </div>
              <p className="text-xl">Labels</p>
            </div>
            <p className="py-4 text-5xl">{labelCount}</p>
          </div>
        </section>
        <section className="h-48 w-80 rounded-2xl bg-linear-gradient">
          <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between rounded-2xl bg-radial-gradient p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-custom-gray/10">
                <ClipboardDocumentListIcon className="w-6 text-purple" />
              </div>
              <p className="text-xl">Orders</p>
            </div>
            <p className="py-4 text-5xl">{shippingHistory.length}</p>
          </div>
        </section>
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
      </section>

      <ShippingHistoryTable />
    </main>
  );
}
