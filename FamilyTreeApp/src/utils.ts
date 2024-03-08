import {
  NodeflowData,
  NodeflowNodeData,
  SelectableElementCSS,
  Vec2,
} from "nodeflow-lib";
import nodeCss from "./styles/node.module.scss";
import curveCss from "./styles/curve.module.scss";
import NodeBody from "./components/NodeBody";
import {
  createNewMember,
  fetchAllData,
  Person,
  setFather,
  setMother,
} from "./requests";

const getConnectionCSS = (
  parentGender: CustomNodeflowDataType["gender"],
): SelectableElementCSS => ({
  normal: parentGender == "M" ? curveCss.fatherCurve : curveCss.motherCurve,
  selected:
    parentGender == "M"
      ? curveCss.selectedFatherCurve
      : curveCss.selectedMotherCurve,
});

export const createParentConnections = (
  nodeflowData: NodeflowData,
  child?: NodeflowNodeData,
  parent?: NodeflowNodeData,
) => {
  if (!parent || !child) return;

  child
    .getAllSourceConnections()
    .filter(
      (conn) =>
        nodeflowData.nodes.get(conn.sourceNodeId)?.customData.gender ===
        parent.customData.gender,
    )
    .forEach((conn) =>
      nodeflowData.removeConnection(
        conn.sourceNodeId,
        conn.sourceConnectorId,
        conn.destinationNodeId,
        conn.destinationConnectorId,
      ),
    );

  nodeflowData.addConnection({
    sourceNodeId: parent.id,
    sourceConnectorId: "O",
    destinationNodeId: child.id,
    destinationConnectorId: "I",
    css: getConnectionCSS(parent.customData.gender),
  });
};

export const createFamilyMemberNode = (
  nodeflowData: NodeflowData,
  id: string,
  name: string,
  gender: CustomNodeflowDataType["gender"],
  position?: Vec2,
  fatherId?: string,
  motherId?: string,
): NodeflowNodeData => {
  const historyGroup = name;

  const newNode = nodeflowData.addNode(
    {
      id,
      css: {
        normal: gender === "M" ? nodeCss.maleNode : nodeCss.femaleNode,
        selected:
          gender === "M"
            ? nodeCss.selectedMaleNode
            : nodeCss.selectedFemaleNode,
      },
      position,
      customData: { gender, name },
      display: NodeBody,
      centered: true,
    },
    historyGroup,
  );
  const inputSection = newNode.addConnectorSection(
    "inputs",
    nodeCss.inputsSection,
    historyGroup,
  );
  const outputSection = newNode.addConnectorSection(
    "outputs",
    nodeCss.outputsSection,
    historyGroup,
  );

  outputSection.addConnector(
    {
      id: "O",
      css:
        gender === "M"
          ? nodeCss.maleOutputConnector
          : nodeCss.femaleOutputConnector,
    },
    historyGroup,
  );
  inputSection.addConnector(
    {
      id: "I",
      css: nodeCss.inputConnector,
    },
    historyGroup,
  );

  if (fatherId) {
    const father = nodeflowData.nodes.get(fatherId);
    createParentConnections(nodeflowData, newNode, father);
  }
  if (motherId) {
    const mother = nodeflowData.nodes.get(motherId);
    createParentConnections(nodeflowData, newNode, mother);
  }

  return newNode;
};

export const updateFamilyMemberNode = (
  nodeflowData: NodeflowData,
  person: Person,
) => {
  const node = nodeflowData.nodes.get(person.id);
  if (!node) return;

  node.customData = {
    name: person.name ?? node.customData.name,
    gender: person.gender ?? node.customData.gender,
  };

  if (person.fatherId) {
    const father = nodeflowData.nodes.get(person.fatherId);
    createParentConnections(nodeflowData, node, father);
  }
  if (person.motherId) {
    const mother = nodeflowData.nodes.get(person.motherId);
    createParentConnections(nodeflowData, node, mother);
  }
};
export const setupInitialNodes = async (nodeflowData: NodeflowData) => {
  const data = await fetchAllData();

  for (const person of data) {
    createFamilyMemberNode(
      nodeflowData,
      person.id,
      person.name,
      person.gender,
      Vec2.of((Math.random() * 2 - 1) * 2000, (Math.random() * 2 - 1) * 2000),
    );
  }
  for (const person of data) {
    if (person.fatherId) {
      const father = nodeflowData.nodes.get(person.fatherId);
      const child = nodeflowData.nodes.get(person.id);
      createParentConnections(nodeflowData, child, father);
    }
    if (person.motherId) {
      const mother = nodeflowData.nodes.get(person.motherId);
      const child = nodeflowData.nodes.get(person.id);
      createParentConnections(nodeflowData, child, mother);
    }
  }
};

export const setupEvents = (nodeflowData: NodeflowData) => {
  nodeflowData.eventStore.onPointerUpInConnector.blacklist(
    "familytree-app:prevent-connections-to-parent-connectors",
    ({ connectorId }, name) =>
      connectorId === "O" && name === "nodeflow:connect-held-nodes",
  );
  nodeflowData.eventStore.onTouchStartInConnector.blacklist(
    "familytree-app:prevent-connections-from-parent-connectors",
    ({ connectorId }) => connectorId === "I",
  );
  nodeflowData.eventStore.onMouseDownInConnector.blacklist(
    "familytree-app:prevent-connections-from-parent-connectors",
    ({ connectorId }) => connectorId === "I",
  );
  nodeflowData.eventStore.onPointerUpInNodeflow.subscribe(
    "familytree-app:spawn-new-node",
    () => {
      const heldConnectors = nodeflowData.mouseData.heldConnectors;

      if (heldConnectors.length !== 1) return;

      const heldNode = heldConnectors[0].connector.parentNode;

      const position = nodeflowData.mouseData.globalMousePosition();

      createNewMember(nodeflowData, undefined, heldNode, position);
    },
    1,
  );

  // Override the default create-connection subscription to only allow one connection per input, and set custom css
  nodeflowData.eventStore.onNodeConnected.subscribe(
    "nodeflow:create-connection",
    ({ outputNodeId, inputNodeId }) => {
      const outputNode = nodeflowData.nodes.get(outputNodeId)!;
      const inputNode = nodeflowData.nodes.get(inputNodeId)!;

      if (outputNodeId === inputNodeId) return;

      if (outputNode.customData.gender == "M") {
        setFather(inputNode.id, outputNode.id).then((person) =>
          updateFamilyMemberNode(nodeflowData, person),
        );
      } else {
        setMother(inputNode.id, outputNode.id).then((person) =>
          updateFamilyMemberNode(nodeflowData, person),
        );
      }
    },
  );

  nodeflowData.eventStore.onPointerUpInNode.subscribe(
    "nodeflow:create-connection",
    ({ nodeId }) => {
      // Child node
      const destinationNode = nodeflowData.nodes.get(nodeId)!;

      if (nodeflowData.mouseData.heldConnectors.length !== 1) return;

      // Parent node
      const sourceNode =
        nodeflowData.mouseData.heldConnectors[0].connector.parentSection
          .parentNode;

      if (nodeId === sourceNode.id) return;

      const connector = destinationNode.getConnector("I")?.sources;

      // Return if one of the parents is the same gender as the source node
      if (
        connector?.some(
          (source) =>
            source.sourceConnector.parentNode.customData.gender ===
            sourceNode.customData.gender,
        )
      )
        return;

      if (sourceNode.customData.gender == "M") {
        setFather(destinationNode.id, sourceNode.id).then((person) =>
          updateFamilyMemberNode(nodeflowData, person),
        );
      } else {
        setMother(destinationNode.id, sourceNode.id).then((person) =>
          updateFamilyMemberNode(nodeflowData, person),
        );
      }
    },
    2,
  );
};

export const cleanInput = (input?: string): string =>
  !input ? "" : input.trim().replace(/\s+/g, " ");
