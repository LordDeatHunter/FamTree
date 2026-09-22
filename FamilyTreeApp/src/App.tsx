import { type Component, createMemo, onMount } from "solid-js";
import { NodeflowData, NodeflowLib, windowSize } from "nodeflow-lib";
import { newFatherCurve, newMotherCurve } from "./styles/curveClasses";
import { setupEvents, setupInitialNode } from "./utils";
import Sidebar from "./components/Sidebar";
import SidebarContent from "./components/SidebarContent";
import { FamilyTreeConstants } from "./Constants";
import { FTCurveFunctions } from "./FTCurveFunctions";
import SideButtons from "./components/SideButtons";

const [nodeflowData, Nodeflow] = NodeflowLib.get().createCanvas(
  FamilyTreeConstants.MAIN_NODEFLOW,
  {},
  (nf: NodeflowData) => new FTCurveFunctions(nf),
);

const App: Component = () => {
  onMount(() => {
    setupEvents();
    // get current id from url
    const id = window.location.pathname.split("/").pop();
    if (id) {
      setupInitialNode(id);
    }
  });

  const newCurveCss = createMemo(() => {
    const connector = nodeflowData.mouseData.heldConnectors.at(-1);

    if (!connector) {
      return undefined;
    }

    return connector.connector.parentNode.customData.gender === "M"
      ? newFatherCurve
      : newMotherCurve;
  });

  return (
    <>
      <Nodeflow
        css={{ newCurve: newCurveCss(), nodeflow: "absolute overflow-hidden" }}
        width={`${windowSize().x}px`}
        height={`${windowSize().y}px`}
      />
      <Sidebar>
        <SidebarContent />
      </Sidebar>
      <SideButtons />
    </>
  );
};

export { nodeflowData };
export default App;
