import nodeflowCss from "../styles/sidebar.module.scss";
import { Component, createSignal, JSX } from "solid-js";
import Chevron from "../../assets/right-arrow.svg";

const Sidebar: Component<{ children: JSX.Element }> = (props) => {
  const [showSidebar, setShowSidebar] = createSignal<boolean>(false);

  return (
    <div
      class={
        nodeflowCss[
          showSidebar() ? "sidebar-container" : "sidebar-container-closed"
        ]
      }
    >
      <div class={nodeflowCss["sidebar"]}>{props.children}</div>
      <img
        src={Chevron}
        class={
          nodeflowCss[
            showSidebar() ? "sidebar-toggle" : "sidebar-toggle-closed"
          ]
        }
        onClick={() => setShowSidebar(!showSidebar())}
        draggable={false}
        alt="Toggle sidebar"
      />
    </div>
  );
};

export default Sidebar;
