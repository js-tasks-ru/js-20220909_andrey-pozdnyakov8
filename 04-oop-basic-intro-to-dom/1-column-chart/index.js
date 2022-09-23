export default class ColumnChart {
  chartHeight = 50;
  constructor({ data = [], label = '', value = 0, link = '', formatHeading = (item) => item } = {}) {

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading(value);

    this.render();
  }

  noData() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          <a class="column-chart__link" href="${this.link}">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.formatHeading}
          </div>
          <div data-element="body" class="column-chart__chart">

          </div>
        </div>
      </div>`;
  }

  getLink() {
    if (this.link) {
      return `
        <a class="column-chart__link" href="${this.link}">View all</a>
      `;
    } else {
      return '';
    }   
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;
  
    return this.data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0);
      const value = Math.floor(item * scale);
      return `
        <div style="--value: ${value}" data-tooltip="${percent}%"></div>
      `;
    }).join('');
  }

  getChartTemplate() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnProps()}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.getChartTemplate();
    this.element = wrapper;

    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
      return this.noData();
    }
  }

  update() {
    this.render(this.data);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
  }

}