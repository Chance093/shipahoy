"use client";

// import { useEffect } from "react";
import useAdminPricing from "~/hooks/useAdminPricing";

export default function PricingTable({ userId }: { userId: string }) {
  const { pricingInputs, handleChange, addPricing, isLoading } = useAdminPricing(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-1 flex-col rounded-2xl bg-linear-gradient">
      <div className="flex h-[calc(100%-3px)] w-[calc(100%-3px)] flex-1 translate-x-[1.5px] translate-y-[1.5px] flex-col gap-4 rounded-2xl bg-radial-gradient p-5">
        <h2 className="p-2 text-2xl">User Pricing</h2>
        <section className="flex gap-12">
          <section className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="zeroToFour" className="pl-2 text-lg">
                0lbs - 3.99lbs:
              </label>
              <input
                id="zeroToFour"
                type="text"
                onChange={(e) => handleChange({ zeroToFour: e.target.value })}
                value={pricingInputs.zeroToFour}
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fourToEight" className="pl-2 text-lg">
                4lbs - 7.99lbs:
              </label>
              <input
                id="fourToEight"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ fourToEight: e.target.value })}
                value={pricingInputs.fourToEight}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="eightToFifteen" className="pl-2 text-lg">
                8lbs - 14.99lbs:
              </label>
              <input
                id="eightToFifteen"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ eightToFifteen: e.target.value })}
                value={pricingInputs.eightToFifteen}
              />
            </div>
          </section>
          <section className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="fifteenToTwentyFive" className="pl-2 text-lg">
                15lbs - 24.99lbs:
              </label>
              <input
                id="fifteenToTwentyFive"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ fifteenToTwentyFive: e.target.value })}
                value={pricingInputs.fifteenToTwentyFive}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="twentyFiveToThirtyFive" className="pl-2 text-lg">
                25lbs - 34.99lbs:
              </label>
              <input
                id="twentyFiveToThirtyFive"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ twentyFiveToThirtyFive: e.target.value })}
                value={pricingInputs.twentyFiveToThirtyFive}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="thirtyFiveToFortyFive" className="pl-2 text-lg">
                35lbs - 44.99lbs:
              </label>
              <input
                id="thirtyFiveToFortyFive"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ thirtyFiveToFortyFive: e.target.value })}
                value={pricingInputs.thirtyFiveToFortyFive}
              />
            </div>
          </section>
          <section className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="fortyFiveToFiftyFive" className="pl-2 text-lg">
                45lbs - 54.99lbs:
              </label>
              <input
                id="fortyFiveToFiftyFive"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ fortyFiveToFiftyFive: e.target.value })}
                value={pricingInputs.fortyFiveToFiftyFive}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="fiftyFiveToSixtyFive" className="pl-2 text-lg">
                55lbs - 64.99lbs:
              </label>
              <input
                id="fiftyFiveToSixtyFive"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ fiftyFiveToSixtyFive: e.target.value })}
                value={pricingInputs.fiftyFiveToSixtyFive}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sixtyFiveToSeventy" className="pl-2 text-lg">
                65lbs - 70lbs:
              </label>
              <input
                id="sixtyFiveToSeventy"
                type="text"
                className="rounded-md border border-gray-600/50 bg-black bg-opacity-0 p-2 focus:outline-none"
                onChange={(e) => handleChange({ sixtyFiveToSeventy: e.target.value })}
                value={pricingInputs.sixtyFiveToSeventy}
              />
            </div>
          </section>
        </section>
        <button className="my-2 w-48 cursor-pointer justify-end rounded-md bg-purple p-4 text-center" onClick={addPricing}>
          Update Pricing
        </button>
      </div>
    </section>
  );
}
