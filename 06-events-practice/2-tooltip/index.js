class Tooltip {
  constructor() {
    this.render();
  }

  initialize (item = document.body) {
    item.append(this.element);
    this.initListeners();
  }

  showTooltip(event) {
    const target = event.target.closest('[data-element]');
    this.render(event.target.dataset.tooltip);
  }
  
  initListeners() {
    document.addEventListener('pointerover', this.showTooltip());
    document.addEventListener('pointerout', this.showTooltip());
  }
  
  removeListeners() {
    document.removeEventListener('pointerout', this.showTooltip());
    document.removeEventListener('pointerover', this.showTooltip());
  }
  
  get tooltipTemplate() {
    return `
      <div class="tooltip">This is tooltip</div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = null;
    this.element = wrapper.firstElementChild;
    

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