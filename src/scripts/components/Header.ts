class Header {
  selectors = {
    root: "[data-js-header] ",
    overlay: "[data-js-header-overlay]",
    burgerButton: "[data-js-header-burger-button]",
  };

  stateClasses = {
    isActive: "is-active",
    isLocked: "is-locked",
  };

  private rootElement: HTMLElement | null;
  private overlayElement: HTMLElement | null;
  private burgerButtonElement: HTMLElement | null;

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.overlayElement = this.rootElement?.querySelector(this.selectors.overlay) || null;
    this.burgerButtonElement = this.rootElement?.querySelector(this.selectors.burgerButton) || null;
    this.bindEvents();
  }

  onBurgerButtonClick = () => {
    this.burgerButtonElement?.classList.toggle(this.stateClasses.isActive);
    this.overlayElement?.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLocked);
  };
  bindEvents() {
    this.burgerButtonElement?.addEventListener("click", this.onBurgerButtonClick);
  }
}
export default Header;
