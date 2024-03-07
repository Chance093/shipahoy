import HandleCsv from "./components/HandleCsv";
import SingleLabelCreation from "./components/SingleLabelCreation";
import Divider from "~/app/components/Divider";

export default function CreateLabels() {
  return (
    <>
      <HandleCsv />
      <Divider />
      <SingleLabelCreation />
    </>
  );
}
