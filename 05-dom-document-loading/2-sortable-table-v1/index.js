export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = [...data];

    this.render();
  }

  sort(fieldValue, orderValue) {
    const sortOrder = orderValue === "asc" ? 1 : -1;

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

    // let direction;
    // if (orderValue === "asc") {
    //   direction = 1;
    // }
    // if (orderValue === "desc") {
    //   direction = -1;
    // }

    // this.data.sort((a, b) => {
    //   if (typeof a[fieldValue] === "number") {
    //     return direction * (a[fieldValue] - b[fieldValue]);
    //   }
    //   if (typeof a[fieldValue] === "string") {
    //     return (
    //       direction *
    //       a[fieldValue].localeCompare(b[fieldValue], ["ru", "en"], {
    //         caseFirst: "upper",
    //       })
    //     );
    //   }
    // });

    this.subElements.body.innerHTML = this.tableProducts;
    // this.element.innerHTML = this.sortableTableTemplate;
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
