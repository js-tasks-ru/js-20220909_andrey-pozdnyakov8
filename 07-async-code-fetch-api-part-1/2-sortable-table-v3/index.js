const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], { data = [], sorted = {}, url = {} } = {}) {
    this.headerConfig = headerConfig;
    this.data = [...data];
    this.sorted = sorted;

    this.render();
    this.sortOnClient(sorted.id, sorted.order);
  }

  initListeners() {
    document.addEventListener("pointerdown", this.onSortClick);
    // добавить скролл
  }

  removeListeners = () => {
    document.removeEventListener("pointerdown", this.onSortClick);
    // убрать скролл
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

      this.sortOnClient(id, newOrder);
    }
  };

  sortOnClient(id, order) {
    const sortOrder = order === "asc" ? 1 : -1;

    const sortingField = this.element.querySelector(
      `[data-id='${id}']`
    );

    sortingField.dataset.order = order;

    const sortedData = this.data.sort((a, b) => {
      if (typeof a[id] === "number") {
        return sortOrder * (a[id] - b[id]);
      }

      if (typeof a[id] === "string") {
        return (
          sortOrder *
          a[id].localeCompare(b[id], ["ru", "en"], {
            caseFirst: "upper",
          })
        );
      }
    });

    this.subElements.body.innerHTML = this.tableProducts;
  }

  async sortOnServer(id, order) {
    const pathNameURL = `${BACKEND_URL}/${url}`;

    this.subElements.classList.add("sortable-table_loading");

    await fetch(pathNameURL)
      .then((response) => {
        return response.json();
      })
      .catch(function(error) {
        console.log(error);
      });

    this.subElements.classList.remove("sortable-table_loading");
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

  tableProductCells(item) {
    return this.headerConfig
      .map((data) => {
        return data.template
          ? data.template()
          : `<div class="sortable-table__cell">${item[data.id]}</div>`;
      })
      .join("");
  }

  get tableProducts() {
    return this.data
      .map((item) => {
        return `
        <a href="" class="sortable-table__row">
          ${this.tableProductCells(item)}
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
