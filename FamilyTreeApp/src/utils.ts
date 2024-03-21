import { NodeflowNodeData, SelectableElementCSS, Vec2 } from "nodeflow-lib";
import nodeCss from "./styles/node.module.scss";
import curveCss from "./styles/curve.module.scss";
import NodeBody from "./components/NodeBody";
import {
  createNewMember,
  fetchAllData,
  fetchChildren,
  fetchParents,
  fetchPerson,
  Person,
  setFather,
  setMother,
} from "./requests";
import { nodeflowData } from "./App";

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
    createParentConnections(newNode, father);
  }
  if (motherId) {
    const mother = nodeflowData.nodes.get(motherId);
    createParentConnections(newNode, mother);
  }

  return newNode;
};

export const updateFamilyMemberNode = (person: Person) => {
  const node = nodeflowData.nodes.get(person.id);
  if (!node) return;

  node.customData = {
    name: person.name ?? node.customData.name,
    gender: person.gender ?? node.customData.gender,
  };

  if (person.fatherId) {
    const father = nodeflowData.nodes.get(person.fatherId);
    createParentConnections(node, father);
  }
  if (person.motherId) {
    const mother = nodeflowData.nodes.get(person.motherId);
    createParentConnections(node, mother);
  }
};
export const setupInitialNodes = async () => {
  const data = await fetchAllData();

  for (const person of data) {
    createFamilyMemberNode(
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
      createParentConnections(child, father);
    }
    if (person.motherId) {
      const mother = nodeflowData.nodes.get(person.motherId);
      const child = nodeflowData.nodes.get(person.id);
      createParentConnections(child, mother);
    }
  }
};

export const setupInitialNode = async (nodeId: string) => {
  const person = await fetchPerson(nodeId);
  createFamilyMemberNode(person.id, person.name, person.gender);
};

export const setupParents = async (nodeId: string) => {
  const node = nodeflowData.nodes.get(nodeId);
  if (!node) return;
  const [father, mother] = await fetchParents(nodeId);

  const halfSize = node.size.divideBy(2);

  if (father && !nodeflowData.nodes.get(father.id)) {
    createFamilyMemberNode(
      father.id,
      father.name,
      father.gender,
      node.position.add(Vec2.of(halfSize.x * 4, -node.size.y - 350)),
    );
    createParentConnections(
      nodeflowData.nodes.get(nodeId),
      nodeflowData.nodes.get(father.id),
    );
  }
  if (mother && !nodeflowData.nodes.get(mother.id)) {
    createFamilyMemberNode(
      mother.id,
      mother.name,
      mother.gender,
      node.position.add(Vec2.of(halfSize.x * -2, -node.size.y - 350)),
    );
    createParentConnections(
      nodeflowData.nodes.get(nodeId),
      nodeflowData.nodes.get(mother.id),
    );
  }
};

export const setupChildren = async (nodeId: string) => {
  const node = nodeflowData.nodes.get(nodeId);
  if (!node) return;
  const children = await fetchChildren(nodeId);

  const halfSize = node.size.divideBy(2);

  let i = -(children.length - 1) / 2;
  for (const child of children) {
    if (nodeflowData.nodes.get(child.id)) {
      updateFamilyMemberNode(child);
      continue;
    }
    createFamilyMemberNode(
      child.id,
      child.name,
      child.gender,
      node.position.add(Vec2.of(halfSize.x * (3 * i + 1), node.size.y + 350)),
    );
    createParentConnections(
      nodeflowData.nodes.get(child.id),
      nodeflowData.nodes.get(nodeId),
    );
    i++;
  }
};

export const collapseChildrenNodeStructure = (nodeId: string) => {
  const node = nodeflowData.nodes.get(nodeId);
  if (!node) return;

  const keys = nodeflowData.nodes;
  keys.forEach((node) => {
    if (node.id !== nodeId) {
      nodeflowData.removeNode(node.id);
    }
  });
  // node
  //   .getAllDestinationConnectors()
  //   .map((connector) => connector.parentNode.id)
  //   .forEach((childId) => {
  //     collapseChildrenNodeStructure(childId);
  //     nodeflowData.removeNode(childId);
  //   });
};

export const collapseParentNodeStructure = (nodeId: string) => {
  const node = nodeflowData.nodes.get(nodeId);
  if (!node) return;

  const keys = nodeflowData.nodes;
  keys.forEach((node) => {
    if (node.id !== nodeId) {
      nodeflowData.removeNode(node.id);
    }
  });
  // node
  //   .getAllSourceConnectors()
  //   .map((connector) => connector.parentNode.id)
  //   .forEach((parentId) => {
  //     collapseParentNodeStructure(parentId);
  //     nodeflowData.removeNode(parentId);
  //   });
};

export const setupEvents = () => {
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

      createNewMember(undefined, heldNode, position);
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
          updateFamilyMemberNode(person),
        );
      } else {
        setMother(inputNode.id, outputNode.id).then((person) =>
          updateFamilyMemberNode(person),
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
          updateFamilyMemberNode(person),
        );
      } else {
        setMother(destinationNode.id, sourceNode.id).then((person) =>
          updateFamilyMemberNode(person),
        );
      }
    },
    2,
  );
};

export const cleanInput = (input?: string): string =>
  !input ? "" : input.trim().replace(/\s+/g, " ");
