"use client";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/solid";
import useAdmin from "~/hooks/useAdmin";
import InvoiceTable from "../components/InvoiceTable";
import ShippingHistoryTable from "../components/ShippingHistoryTable";
import PricingTable from "../components/PricingTable";

export default function Admin() {
  const {
    userMemberships,
    isLoaded,
    userId,
    setUserId,
    invoices,
    isInvoicesError,
    invoicesError,
    amount,
    isAmountError,
    amountError,
    fetchUser,
    addBalance,
    addedBalance,
    setAddedBalance,
    paymentMethod,
    setPaymentMethod,
    counts,
    isCountsError,
    countsError,
  } = useAdmin();

  if (isInvoicesError) throw invoicesError;
  if (isAmountError) throw amountError;
  if (isCountsError) throw countsError;

  if (isLoaded) {
    if (!userMemberships.data) return <p>Something went wrong!</p>;
    else {
      const adminOrganization = userMemberships.data.find((org) => org.role === "org:admin");

      if (!adminOrganization || adminOrganization.role !== "org:admin") {
        return <p>Please sign into an Admin Account</p>;
      } else
        return (
          <main className="flex min-h-screen flex-col">
            <h1 className="mx-4 flex items-center gap-2 border-b border-gray-600/50 py-4 text-2xl">
              <GlobeAsiaAustraliaIcon className="w-12" />
              Proglo Shipping
            </h1>
            <section className="flex flex-1 flex-col gap-8 p-8">
              <h1 className="text-center text-3xl">Admin Panel</h1>
              <section className="flex gap-8">
                <section className="flex-1 rounded-2xl bg-linear-gradient">
                  <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-4 rounded-2xl bg-radial-gradient p-5">
                    <h2 className="text-2xl">Search User:</h2>

                    <input
                      type="text"
                      placeholder="User Id"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                      }}
                      className="w-80 rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                    />
                    <button onClick={fetchUser} className="my-2 w-48 cursor-pointer rounded-md bg-[#b4a3d8] p-4 text-center text-black">
                      Search User
                    </button>
                  </div>
                </section>
                {amount && amount.amount !== undefined ? (
                  <section className="flex-1 rounded-2xl bg-linear-gradient">
                    <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] translate-x-[1.5px] translate-y-[1.5px] flex-col justify-between gap-4 rounded-2xl bg-radial-gradient p-5">
                      <h2 className="text-2xl">Balance: ${!amount ? "0.00" : amount.amount}</h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                          <input
                            type="number"
                            placeholder="Add balance"
                            value={addedBalance}
                            onChange={(e) => setAddedBalance(e.target.value)}
                            className="w-80 rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                            min={0}
                          />
                          <select
                            name="payment-method"
                            id="payment-method"
                            className="w-80 rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <option value="" className="border-gray-600/50 bg-[#1a1a1b]"></option>
                            <option value="ACH" className="border-gray-600/50 bg-[#1a1a1b]">
                              ACH
                            </option>
                            <option value="Zelle" className="border-gray-600/50 bg-[#1a1a1b]">
                              Zelle
                            </option>
                            <option value="Wire" className="border-gray-600/50 bg-[#1a1a1b]">
                              Wire
                            </option>
                          </select>
                        </div>
                        <button
                          onClick={addBalance}
                          className="my-2 w-48 cursor-pointer justify-end rounded-md bg-[#b4a3d8] p-4 text-center text-black"
                        >
                          Update Balance
                        </button>
                      </div>
                    </div>
                  </section>
                ) : null}
              </section>
              {amount === undefined ? null : <PricingTable userId={userId} />}
              {!invoices ? null : <InvoiceTable invoices={invoices} />}
              {counts?.orderCount === undefined ? null : <ShippingHistoryTable type="admin" userId={userId} orderCount={counts?.orderCount} />}
            </section>
          </main>
        );
    }
  }
}
