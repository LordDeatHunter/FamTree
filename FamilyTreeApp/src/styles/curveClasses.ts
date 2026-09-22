/*
 * Class strings passed to nodeflow-lib for connection curves. Tailwind scans
 * this file statically, so every class name must remain a complete literal.
 *
 * As with nodeClasses, the selected* strings are delta-only: the normal class is
 * always present, and toggling the selected class off removes every token it
 * contains.
 */

const curveBase =
  "relative w-full h-full overflow-hidden [stroke-width:12px] " +
  "[transition:stroke_100ms_ease-in-out,filter_100ms_ease-in-out]";

export const fatherCurve = `${curveBase} stroke-curve-male hover:stroke-curve-male-selected hover:drop-shadow-[0_0_2px_var(--color-curve-male)]`;
export const motherCurve = `${curveBase} stroke-curve-female hover:stroke-curve-female-selected hover:drop-shadow-[0_0_2px_var(--color-curve-female)]`;
export const selectedFatherCurve =
  "stroke-curve-male-selected drop-shadow-[0_0_2px_var(--color-curve-male-selected)] hover:drop-shadow-[0_0_2px_var(--color-curve-male-selected)]";
export const selectedMotherCurve =
  "stroke-curve-female-selected drop-shadow-[0_0_2px_var(--color-curve-female-selected)] hover:drop-shadow-[0_0_2px_var(--color-curve-female-selected)]";
export const newFatherCurve = `${curveBase} stroke-curve-male-new drop-shadow-[0_0_2px_var(--color-curve-male-selected)]`;
export const newMotherCurve = `${curveBase} stroke-curve-female-new drop-shadow-[0_0_2px_var(--color-curve-female-selected)]`;
