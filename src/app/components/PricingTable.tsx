"use client";

// import { useEffect } from "react";
import useAdminPricing from "~/hooks/useAdminPricing";

export default function PricingTable({ userId }: { userId: string }) {
  const { pricingInputs, handleChange, addPricing, isLoading } = useAdminPricing(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <label htmlFor="">0-3.99</label>
        <input type="text" className="text-black" onChange={(e) => handleChange({ zeroToFour: e.target.value })} value={pricingInputs.zeroToFour} />
      </div>
      <div>
        <label htmlFor="">4-7.99</label>
        <input type="text" className="text-black" onChange={(e) => handleChange({ fourToEight: e.target.value })} value={pricingInputs.fourToEight} />
      </div>
      <div>
        <label htmlFor="">8-14.99</label>
        <input type="text" className="text-black" onChange={(e) => handleChange({ fourToEight: e.target.value })} value={pricingInputs.fourToEight} />
      </div>
      <div>
        <label htmlFor="">15-24.99</label>
        <input
          type="text"
          className="text-black"
          onChange={(e) => handleChange({ fifteenToTwentyFive: e.target.value })}
          value={pricingInputs.fifteenToTwentyFive}
        />
      </div>
      <div>
        <label htmlFor="">25-34.99</label>
        <input
          type="text"
          className="text-black"
          onChange={(e) => handleChange({ twentyFiveToThirtyFive: e.target.value })}
          value={pricingInputs.twentyFiveToThirtyFive}
        />
      </div>
      <div>
        <label htmlFor="">35-44.99</label>
        <input
          type="text"
          className="text-black"
          onChange={(e) => handleChange({ thirtyFiveToFortyFive: e.target.value })}
          value={pricingInputs.thirtyFiveToFortyFive}
        />
      </div>
      <div>
        <label htmlFor="">45-54.99</label>
        <input
          type="text"
          className="text-black"
          onChange={(e) => handleChange({ fortyFiveToFiftyFive: e.target.value })}
          value={pricingInputs.fortyFiveToFiftyFive}
        />
      </div>
      <div>
        <label htmlFor="">55-64.99</label>
        <input
          type="text"
          className="text-black"
          onChange={(e) => handleChange({ fiftyFiveToSixtyFive: e.target.value })}
          value={pricingInputs.fiftyFiveToSixtyFive}
        />
      </div>
      <div>
        <label htmlFor="">65-70</label>
        <input
          type="text"
          className="text-black"
          onChange={(e) => handleChange({ sixtyFiveToSeventy: e.target.value })}
          value={pricingInputs.sixtyFiveToSeventy}
        />
      </div>
      <button onClick={addPricing}>Update Pricing</button>
    </div>
  );
}
