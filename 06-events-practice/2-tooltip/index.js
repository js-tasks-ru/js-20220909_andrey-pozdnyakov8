class Tooltip {
  static instance = null;

  constructor() {
    if (!Tooltip.instance) {
      return Tooltip.instance = this;
    } else {
      return Tooltip.instance;
    }
  }

  initialize() {
    this.initListeners();
  }

  showTooltip = (event) => {
    const tooltipTarget = event.target.dataset.tooltip;

    if (tooltipTarget) {
      this.render(tooltipTarget);
      document.body.addEventListener("pointermove", this.tooltipPosition);
    }
    
  }

  hideTooltip = () => {
    this.remove();
    this.element = null;
    document.body.removeEventListener("pointermove", this.tooltipPosition);
  }

  tooltipPosition = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const shift = 20;

    this.element.style.top = y + shift + 'px';
    this.element.style.left = x + shift + 'px';
  }

  render(tooltipTarget) {
    this.element = document.createElement('div');
    this.element.innerHTML = tooltipTarget;
    this.element.classList.add("tooltip");
    
    document.body.append(this.element);
  }

  initListeners() {
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.hideTooltip);
  }
  
  removeListeners() {
    document.removeEventListener('pointerover', this.showTooltip);
    document.removeEventListener('pointerout', this.hideTooltip);
  }

  remove() {
    if (this.element) {this.element.remove();}
  }

  destroy() {
    this.remove();
    this.removeListeners();
    this.element = null;
  }
}

export default Tooltip;