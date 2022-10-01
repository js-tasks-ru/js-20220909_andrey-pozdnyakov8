export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], { data = [], sorted = {} } = {}) {
    this.headerConfig = headerConfig;
    this.data = [...data];
    this.sorted = sorted;

    this.render();
    this.sortData(sorted.id, sorted.order);
  }

  initListeners() {
    document.addEventListener("pointerdown", this.onSortClick);
  }

  removeListeners = () => {
    document.removeEventListener("pointerdown", this.onSortClick);
  };

  onSortClick = (event) => {
    const selectedColumn = event.target.closest('[data-sortable="true"]');

    const orderToggler = (order) => {
      const orders = {
        asc: "desc",
        desc: "asc",
      };

      const result = orders[order];
      return result;
    };

    if (selectedColumn) {
      const { id, order } = selectedColumn.dataset;
      const newOrder = orderToggler(order);

      const arrow = selectedColumn.querySelector(".sortable-table__sort-arrow");

      selectedColumn.dataset.order = newOrder;

      if (!arrow) {
        selectedColumn.append(this.subElements.arrow);
      }

      this.sortData(id, newOrder);
    }
  };

  sortData(fieldValue, orderValue) {
    const sortOrder = orderValue === "asc" ? 1 : -1;

    const sortingField = this.element.querySelector(
      `[data-id='${fieldValue}']`
    );

    sortingField.dataset.order = orderValue;

    const sortedData = this.data.sort((a, b) => {
      if (typeof a[fieldValue] === "number") {
        return sortOrder * (a[fieldValue] - b[fieldValue]);
      }

      if (typeof a[fieldValue] === "string") {
        return (
          sortOrder *
          a[fieldValue].localeCompare(b[fieldValue], ["ru", "en"], {
            caseFirst: "upper",
          })
        );
      }
    });

    this.subElements.body.innerHTML = this.tableProducts;
  }

  get tableHeader() {
    return this.headerConfig
      .map((item) => {
        return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${
          item.sortable
        }" data-order="asc">
          <span>${item.title}</span>
          ${item.sortable ? this.arrowToSort : ""} 
        </div>
      `;
      })
      .join("");
  }

  get arrowToSort() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  get tableProducts() {
    return this.data
      .map((item) => {
        return `
        <a href="" class="sortable-table__row">
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="https://via.placeholder.com/32">
          </div>
          <div class="sortable-table__cell">${item.title}</div>

          <div class="sortable-table__cell">${item.quantity}</div>
          <div class="sortable-table__cell">${item.price}</div>
          <div class="sortable-table__cell">${item.sales}</div>
        </a>
      `;
      })
      .join("");
  }

  get sortableTableTemplate() {
    return `
    <div class="sortable-table">
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.tableHeader}
      </div>
      <div data-element="body" class="sortable-table__body">
        ${this.tableProducts}
      </div>   
    </div>

    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
    `;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.sortableTableTemplate;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements();
    this.initListeners();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.element.remove();
  }
}
