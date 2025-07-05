import { Header } from "./components";
import { HeaderScroll } from "./services";
import "../styles/main.scss";

const initUIComponents = (): void => {
  // initialize UI components here
  new Header();
};

document.addEventListener("DOMContentLoaded", (): void => {
  initUIComponents();
  new HeaderScroll();
});
