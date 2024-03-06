"use client";
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { api } from "~/trpc/react";
import DownloadButton from "../user/dashboard/components/DownloadButton";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

export default function Admin() {
  const router = useRouter();
  const { userMemberships, isLoaded } = useOrganizationList({ userMemberships: true });
  const [userId, setUserId] = useState("");
  const [addedBalance, setAddedBalance] = useState(0);
  const [shippingHistory, setShippingHistory] = useState<
    | {
        id: number;
        createdAt: Date | null;
        labelCount: number;
        totalPrice: string;
        pdfLink: string;
        csvLink: string;
        zipLink: string;
        shippingService: {
          service: string;
        };
      }[]
    | undefined
  >([]);
  const [invoiceHistory, setInvoiceHistory] = useState<
    | {
        id: number;
        amount: string;
        paymentMethod: string;
        createdAt: Date | null;
        paymentStatus: {
          status: string | null;
        };
      }[]
    | undefined
  >([]);
  const [balance, setBalance] = useState<string | null | undefined>("0.00");
  const [isUserFetched, setIsUserFetched] = useState(false);

  const orders = api.labelGroup.getShippingHistoryByUserId.useQuery(userId);
  const invoices = api.invoice.getInvoicesByUserId.useQuery(userId);
  const amount = api.balance.getAmountByUserId.useQuery(userId);
  const updateBalance = api.balance.updateByUserId.useMutation();

  function fetchUser() {
    setIsUserFetched(false);
    setShippingHistory(orders.data);
    setInvoiceHistory(invoices.data);
    setBalance(amount.data?.amount);
    setIsUserFetched(true);
  }

  function addBalance() {
    if (!balance) return;
    updateBalance.mutate({ amount: (parseFloat(balance) + addedBalance).toString(), userId: userId });
    setBalance((parseFloat(balance) + addedBalance).toFixed(2).toString());
    setAddedBalance(0);
    router.refresh();
  }

  if (isLoaded) {
    // Find the admin organization from the loaded organization list
    const adminOrganization = userMemberships.data.find((org) => org.role === "org:admin");

    // If the user is not an admin, redirect to the homepage
    if (!adminOrganization || adminOrganization.role !== "org:admin") {
      return <p>You are not an Admin. Get out of here!</p>; // Replace '/' with the homepage URL
    } else
      return (
        <main className="flex min-h-screen flex-col">
          <h1 className="mx-4 flex items-center gap-2 border-b border-gray-600/50 py-4 text-2xl">
            <GlobeAsiaAustraliaIcon className="w-12" />
            Proglo Shipping
          </h1>
          <section className="flex flex-1 flex-col gap-8 p-8">
            <h1 className="text-center text-3xl">Admin Panel</h1>
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl">Search User:</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="User Id"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-80 rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                />
                <button onClick={fetchUser}>Search</button>
              </div>
            </section>
            {isUserFetched ? (
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl">Balance: ${balance}</h2>
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Add balance"
                    value={addedBalance}
                    onChange={(e) => setAddedBalance(parseFloat(e.target.value))}
                    className="w-80 rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                    min={0}
                  />
                  <button onClick={addBalance}>Update</button>
                </div>
              </section>
            ) : null}

            {invoiceHistory?.length === 0 ? null : (
              <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
                <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
                  <h2 className="p-2 text-2xl">Invoices</h2>
                  {invoiceHistory?.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center pb-8">
                      <p className="text-2xl">You have no invoices!</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="text-custom-gray ">
                        <tr className="border-b border-gray-600/50">
                          <th className="p-4 pb-6 font-normal">Date</th>
                          <th className="p-4 pb-6 font-normal">Amount</th>
                          <th className="p-4 pb-6 font-normal">Payment Method</th>
                          <th className="p-4 pb-6 font-normal">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceHistory?.length === 0 && <p>You have no invoices!</p>}
                        {invoiceHistory?.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-gray-600/50">
                            <td className="p-4 py-6">{invoice.createdAt ? format(invoice.createdAt, "MM-dd-yyyy") : ""}</td>
                            <td className="p-4 py-6">{invoice.amount}</td>
                            <td className="p-4 py-6">{invoice.paymentMethod}</td>
                            <td className="p-4 py-6">{invoice.paymentStatus.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            )}
            {shippingHistory?.length === 0 ? null : (
              <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
                <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-2 rounded-2xl bg-radial-gradient p-5">
                  <h2 className="p-2 text-2xl">Shipping History</h2>
                  {shippingHistory?.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center pb-8">
                      <p className="text-2xl">You have no orders!</p>
                    </div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="text-custom-gray ">
                        <tr className="border-b border-gray-600/50">
                          <th className="p-4 pb-6 font-normal">#</th>
                          <th className="p-4 pb-6 font-normal">Date</th>
                          <th className="p-4 pb-6 font-normal">Labels</th>
                          <th className="p-4 pb-6 font-normal">Type</th>
                          <th className="p-4 pb-6 font-normal">Price</th>
                          <th className="pb-2 font-normal">
                            <div className="w-12 text-center">PDF</div>
                          </th>
                          <th className="pb-2 font-normal">
                            <div className="w-12 text-center">CSV</div>
                          </th>
                          <th className="pb-2 font-normal">
                            <div className="w-12 text-center">ZIP</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shippingHistory?.map((group, idx) => (
                          <tr key={group.id} className="border-b border-gray-600/50">
                            <td className="p-4 py-6">{idx + 1}</td>
                            <td className="p-4 py-6">{group.createdAt ? format(group.createdAt, "MM-dd-yyyy") : ""}</td>
                            <td className="p-4 py-6">{group.labelCount}</td>
                            <td className="p-4 py-6">{group.shippingService.service}</td>
                            <td className="p-4 py-6">${group.totalPrice}</td>
                            <td className="py-6">
                              <DownloadButton fileLink={group.pdfLink} />
                            </td>
                            <td className="py-6">
                              <DownloadButton fileLink={group.csvLink} />
                            </td>
                            <td className="py-6">
                              <DownloadButton fileLink={group.zipLink} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>
            )}
          </section>
        </main>
      );
  }

  //   if (!has({ role: "org:admin" })) {
  //     router.push("/user/dashboard");
  //   }
}
