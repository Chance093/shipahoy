import type { Metadata } from "next";
import BulkLabelCreation from "./components/BulkLabelCreation";
import SingleLabelCreation from "./components/SingleLabelCreation";
import Divider from "~/app/components/Divider";

export const metadata: Metadata = {
  title: "Create Labels | Proglo Shipping",
  description:
    "Create labels quickly using our single label creation form or save time by uploading multiple orders with our bulk CSV upload feature.",
};

export default function CreateLabels() {
  return (
    <>
      <BulkLabelCreation />
      <Divider />
      <SingleLabelCreation />
    </>
  );
}
