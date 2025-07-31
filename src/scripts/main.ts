import { Header } from "./components";
import { HeaderScroll } from "./services";
import { TabsCollection } from "./components";
import "../styles/main.scss";

const initUIComponents = (): void => {
  // initialize UI components here
  new Header();
  new TabsCollection();
};

document.addEventListener("DOMContentLoaded", (): void => {
  initUIComponents();
  new HeaderScroll();
});
