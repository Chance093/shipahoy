import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/solid";

export default function Admin() {
  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="mx-4 flex items-center gap-2 border-b border-gray-600/50 py-4 text-2xl">
        <GlobeAsiaAustraliaIcon className="w-12" />
        Proglo Shipping
      </h1>
      <section className="flex-1 p-8">
        <h1 className="text-center text-3xl">Admin Panel</h1>
        <section>
          <h2>Select a User</h2>
          <input type="text" placeholder="User Id" />
        </section>
        <section>
          <h2>Balance: $100</h2>
          <input type="text" placeholder="Add balance" />
        </section>
        <section>
          <h2>Invoice History</h2>
          {/* Invoice Table */}
        </section>
        <section>
          <h3>Shipping History</h3>
          {/* Shipping Table */}
        </section>
      </section>
    </main>
  );
}
