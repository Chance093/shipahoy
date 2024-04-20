"use client";
import { useEffect } from "react";
import useAdmin from "~/hooks/useAdmin";

export default function PricingTable() {
  const { fetchUser, pricingData, setPricingData, updatePricingData } = useAdmin();

  // console.log(`pricingData: ${pricingData.zeroToFour}`);
  const handleChange = (fields: Partial<typeof pricingData>) => {
    setPricingData((prev) => {
      return { ...prev, ...fields };
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="">0-3.99</label>
        <input type="text" onChange={(e) => handleChange({ zeroToFour: e.target.value })} value={pricingData.zeroToFour} />
      </div>
      <div>
        <label htmlFor="">4-7.99</label>
        <input type="text" onChange={(e) => handleChange({ fourToEight: e.target.value })} value={pricingData.fourToEight} />
      </div>
      <div>
        <label htmlFor="">8-14.99</label>
        <input type="text" onChange={(e) => handleChange({ eightToFifteen: e.target.value })} value={pricingData.eightToFifteen} />
      </div>
      <div>
        <label htmlFor="">15-24.99</label>
        <input type="text" onChange={(e) => handleChange({ fifteenToTwentyFive: e.target.value })} value={pricingData.fifteenToTwentyFive} />
      </div>
      <div>
        <label htmlFor="">25-34.99</label>
        <input type="text" onChange={(e) => handleChange({ twentyFiveToThirtyFive: e.target.value })} value={pricingData.twentyFiveToThirtyFive} />
      </div>
      <div>
        <label htmlFor="">35-44.99</label>
        <input type="text" onChange={(e) => handleChange({ thirtyFiveToFortyFive: e.target.value })} value={pricingData.thirtyFiveToFortyFive} />
      </div>
      <div>
        <label htmlFor="">45-54.99</label>
        <input type="text" onChange={(e) => handleChange({ fortyFiveToFiftyFive: e.target.value })} value={pricingData.fortyFiveToFiftyFive} />
      </div>
      <div>
        <label htmlFor="">55-64.99</label>
        <input type="text" onChange={(e) => handleChange({ fiftyFiveToSixtyFive: e.target.value })} value={pricingData.fiftyFiveToSixtyFive} />
      </div>
      <div>
        <label htmlFor="">65-70</label>
        <input type="text" onChange={(e) => handleChange({ sixtyFiveToSeventy: e.target.value })} value={pricingData.sixtyFiveToSeventy} />
      </div>
      <button onClick={updatePricingData}>Update Pricing</button>
    </div>
  );
}
