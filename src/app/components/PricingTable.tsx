"use client";
import useAdmin from "~/hooks/useAdmin";

export default function PricingTable() {
  const { pricingData, setPricingData, updatePricingData } = useAdmin();

  const handleChange = (fields: Partial<typeof pricingData>) => {
    setPricingData((prev) => {
      return { ...prev, ...fields };
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="">0-3.99</label>
        <input type="text" onChange={(e) => handleChange({ zeroToFour: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">4-7.99</label>
        <input type="text" onChange={(e) => handleChange({ fourToEight: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">8-14.99</label>
        <input type="text" onChange={(e) => handleChange({ eightToFifteen: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">15-24.99</label>
        <input type="text" onChange={(e) => handleChange({ fifteenToTwentyFive: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">25-34.99</label>
        <input type="text" onChange={(e) => handleChange({ twentyFiveToThirtyFive: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">35-44.99</label>
        <input type="text" onChange={(e) => handleChange({ thirtyFiveToFortyFive: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">45-54.99</label>
        <input type="text" onChange={(e) => handleChange({ fortyFiveToFiftyFive: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">55-64.99</label>
        <input type="text" onChange={(e) => handleChange({ fiftyFiveToSixtyFive: e.target.value })} />
      </div>
      <div>
        <label htmlFor="">65-70</label>
        <input type="text" onChange={(e) => handleChange({ sixtyFiveToSeventy: e.target.value })} />
      </div>
      <button onClick={updatePricingData}>Update Pricing</button>
    </div>
  );
}
