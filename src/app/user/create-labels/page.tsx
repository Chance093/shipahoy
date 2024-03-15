import BulkLabelCreation from "./components/BulkLabelCreation";
import SingleLabelCreation from "./components/SingleLabelCreation";
import Divider from "~/app/components/Divider";

export default function CreateLabels() {
  return (
    <>
      <BulkLabelCreation />
      <Divider />
      <SingleLabelCreation />
    </>
  );
}
