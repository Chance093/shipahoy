import DuoplaneTable from "~/app/components/DuoplaneTable";

export default function Duoplane() {
  return (
    <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
        <h2 className="p-2 text-2xl">Duoplane Orders</h2>
        <DuoplaneTable />
      </div>
    </section>
  );
}
