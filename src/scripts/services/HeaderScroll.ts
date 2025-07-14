class HeaderScroll {
  selectors = {
    header: "[data-js-header]",
  };

  stateClasses = {
    isScrolled: "is-scrolled",
  };
  private headerElement: HTMLElement | null;
  constructor() {
    this.headerElement = document.querySelector(this.selectors.header) || null;

    this.bindEvents();
  }
  onScroll = () => {
    if (window.scrollY >= 100) {
      this.headerElement?.classList.add(this.stateClasses.isScrolled);
    }else{
      this.headerElement?.classList.remove(this.stateClasses.isScrolled);
    }
  };
  bindEvents() {
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }
}

export default HeaderScroll;
