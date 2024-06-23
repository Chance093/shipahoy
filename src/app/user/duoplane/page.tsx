import DuoplaneTable from "~/app/components/DuoplaneTable";
import { api } from "~/trpc/server";

export default async function Duoplane() {
  const pricing = await api.pricing.getPricing.query();
  const balance = await api.balance.getAmount.query();

  if (balance.amount === null) throw new Error("Balance amount not found");

  return (
    <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
        <DuoplaneTable pricing={pricing} balance={Number(balance.amount)} />
      </div>
    </section>
  );
}
