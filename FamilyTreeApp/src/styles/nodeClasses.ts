/*
 * Class strings passed to nodeflow-lib at runtime (nodes, connectors,
 * connector sections). Tailwind scans this file statically, so every class name
 * must remain a complete literal.
 *
 * The selected* strings hold ONLY the delta. nodeflow-lib always applies the
 * normal class and toggles the selected one, and toggling it off removes every
 * token it contains — repeating the base tokens would strip the node's
 * positioning, background and outline as soon as it is deselected.
 */

const nodeBase =
  "absolute flex flex-col items-center justify-center w-max min-w-[300px] " +
  "min-h-[100px] p-[10px] select-none rounded-lg bg-node-background " +
  "outline-[6px] outline-node-border outline-offset-[-3px] " +
  "[transition:background-color_0.2s_ease-in-out,opacity_0.8s_ease-in-out,border-color_0.2s_ease-in-out]";

export const femaleNode = `${nodeBase} z-1 cursor-grab hover:z-3 hover:bg-node-female-hover`;
export const maleNode = `${nodeBase} z-1 cursor-grab hover:z-3 hover:bg-node-male-hover`;
export const selectedFemaleNode =
  "z-3 cursor-grabbing bg-node-female-selected hover:bg-node-female-selected";
export const selectedMaleNode =
  "z-3 cursor-grabbing bg-node-male-selected hover:bg-node-male-selected";

const connectorBase =
  "relative h-4 rounded-t-xl border-none cursor-crosshair " +
  "outline-[6px] outline-node-border outline-offset-[-3px]";

export const inputConnector = `${connectorBase} w-full bg-input-connector hover:bg-connector-input-hover`;
export const maleOutputConnector = `${connectorBase} w-1/4 bottom-[5px] bg-male hover:bg-connector-male-hover`;
export const femaleOutputConnector = `${connectorBase} w-1/4 bottom-[5px] bg-female hover:bg-connector-female-hover`;

const connectorSection = "absolute flex justify-evenly w-full h-0";

export const inputsSection = `${connectorSection} -top-[11px]`;
export const outputsSection = `${connectorSection} bottom-[11px]`;

export const nodeFont = "m-8 text-[4rem] font-bold select-none";
