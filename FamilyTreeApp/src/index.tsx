/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";
import App from "./App";
import "nodeflow-lib";

declare global {
  export interface CustomNodeflowDataType {
    gender: "M" | "F";
    name: string;
  }
}

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => <App />, root!);
