import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element;
  subElements = {};

  initListeners() {

  }

  removeListeners() {

  }
  
  get dashboardPageTemplate() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <!-- RangePicker component -->
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <!-- column-chart components -->
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Best sellers</h3>

        <div data-element="sortableTable">
          <!-- sortable-table component -->
        </div>
      </div>
    `;
  }

  getRangePicker() {

  }

  getSortableTable() {
    
  }

  getColumnChart() {
    
  }

  async render() {
    const element = document.createElement("div");

    element.innerHTML = this.dashboardPageTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();

    this.initListeners();

    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.display = 'none';
    return this.element;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    console.log(result);
    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
    this.removeListeners();
  }

  destroy() {
    this.element.remove();
    this.removeListeners();
  }
}
