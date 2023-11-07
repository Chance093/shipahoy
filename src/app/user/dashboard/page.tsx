import { api } from "~/trpc/server";
import ShippingHistoryTable from "./components/ShippingHistoryTable";
import { DocumentPlusIcon, BanknotesIcon } from "@heroicons/react/24/solid";

export default async function Dashboard() {
  const balance = await api.balance.getAmount.query();
  const shippingHistory = await api.labelGroup.getShippingHistory.query();
  let labelCount = 0;
  shippingHistory.map((item) => (labelCount += item.labelCount));

  return (
    <main className="ml-72 flex flex-col gap-8 px-10 py-10">
      <h1 className="pl-2 text-4xl">Dashboard</h1>
      <section className="flex gap-8">
        <section className="bg-linear-gradient h-48 w-80 rounded-2xl">
          <div className="bg-radial-gradient flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-test-gray/10 flex h-10 w-10 items-center justify-center rounded-full">
                <DocumentPlusIcon className="text-test-purple w-6" />
              </div>
              <p className="text-xl">Labels</p>
            </div>
            <p className="py-4 text-5xl">{labelCount}</p>
          </div>
        </section>
        <section className="bg-linear-gradient h-48 w-80 rounded-2xl">
          <div className="bg-radial-gradient flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="bg-test-gray/10 flex h-10 w-10 items-center justify-center rounded-full">
                <BanknotesIcon className="text-test-purple w-6" />
              </div>
              <p className="text-xl">Balance</p>
            </div>
            <p className="py-4 text-5xl">
              $ {balance ? balance.amount : "0.00"}
            </p>
          </div>
        </section>
      </section>

      <ShippingHistoryTable />
    </main>
  );
}
