import { Component, createSignal, JSX } from "solid-js";
import Chevron from "../../assets/right-arrow.svg";

const sidebarContainer =
  "absolute left-0 h-full transition-all duration-300 ease-in-out max-md:w-full " +
  "md:min-w-[600px] md:max-w-[800px] md:w-1/2 min-[1440px]:max-w-[960px] min-[1440px]:w-1/5";

const sidebarContainerClosed =
  "absolute left-0 h-full transition-all duration-300 ease-in-out min-w-0 w-0";

const sidebarClass =
  "w-full h-full bg-element-background border-r border-border flex flex-col items-center " +
  "top-0 left-0 z-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out";

const sidebarToggleBase =
  "absolute w-12 my-auto inset-y-0 -right-16 cursor-pointer outline-none z-4 " +
  "flex justify-center items-center transition-all duration-300 ease-in-out text-[3rem]";

const sidebarToggle = `${sidebarToggleBase} rotate-180 max-md:right-4 max-md:m-0 max-md:top-4`;
const sidebarToggleClosed = `${sidebarToggleBase} max-md:m-0 max-md:top-4`;

const Sidebar: Component<{ children: JSX.Element }> = (props) => {
  const [showSidebar, setShowSidebar] = createSignal<boolean>(false);

  return (
    <div class={showSidebar() ? sidebarContainer : sidebarContainerClosed}>
      <div class={sidebarClass}>{props.children}</div>
      <img
        src={Chevron}
        class={showSidebar() ? sidebarToggle : sidebarToggleClosed}
        onClick={() => setShowSidebar(!showSidebar())}
        draggable={false}
        alt="Toggle sidebar"
      />
    </div>
  );
};

export default Sidebar;
