const BACKEND_URL = "https://course-js.javascript.ru";

export default class SortableTable {
  element;
  subElements = {};
  data = [];
  loading = false;
  step = 20;
  start = 1;
  end = this.start + this.step;

  constructor(
    headerConfig = [],
    {
      data = [],
      sorted = {},
      url = "",
      isSortLocally = false,
      step = 20,
      start = 1,
      end = start + step,
    } = {}
  ) {
    this.headerConfig = headerConfig;
    this.url = url;

    this.data = [...data];
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.render();
  }

  initListeners() {
    document.addEventListener("pointerdown", this.onSortClick);
    document.addEventListener("scroll", this.onWindowScroll);
  }

  removeListeners = () => {
    document.removeEventListener("pointerdown", this.onSortClick);
    document.removeEventListener("scroll", this.onWindowScroll);
  };

  onWindowScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    if (
      bottom < document.documentElement.clientHeight &&
      !this.loading &&
      !this.isSortLocally
    ) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      const data = await this.sortOnServer(id, order, this.start, this.end);

      this.update(data);

      this.loading = false;
    }
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

      if (this.isSortLocally) {
        this.sortOnClient(id, newOrder);
      } else {
        this.sortOnServer(id, newOrder);
      }
    }
  };

  sortOnClient(id, order) {
    const sortOrder = order === "asc" ? 1 : -1;

    const sortingField = this.element.querySelector(`[data-id='${id}']`);

    sortingField.dataset.order = order;

    this.data.sort((a, b) => {
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

    this.subElements.body.innerHTML = this.getTableProducts(this.data);
  }

  async sortOnServer(
    id = "title",
    order = "asc",
    start = 0,
    end = this.data.length
  ) {
    const pathNameURL = `${BACKEND_URL}/${this.url}`;
    const fetchURL = new URL(pathNameURL);

    fetchURL.searchParams.set("_embed", "subcategory.category");
    fetchURL.searchParams.set("_sort", id);
    fetchURL.searchParams.set("_order", order);
    fetchURL.searchParams.set("_start", start);
    fetchURL.searchParams.set("_end", end);

    this.element.classList.add("sortable-table_loading");

    try {
      const response = await fetch(fetchURL.toString());
      const data = await response.json();

      this.element.classList.remove("sortable-table_loading");
      this.data = data;

      this.subElements.body.innerHTML = this.getTableProducts(this.data);

      return this.data;
    } catch (error) {
      console.log(error);
    }
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
          ? data.template(item[data.id])
          : `<div class="sortable-table__cell">${item[data.id]}</div>`;
      })
      .join("");
  }

  getTableProducts(data) {
    return this.data
      .map((item) => {
        return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.tableProductCells(item, data)}
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
        ${this.getTableProducts(this.data)}
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

  async render() {
    const { id, order } = this.sorted;
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.sortableTableTemplate;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements();
    this.initListeners();

    this.data = await this.sortOnServer(id, order, 0, 30);

    this.subElements.body.innerHTML = this.getTableProducts(this.data);
    this.subElements.header.innerHTML = this.tableHeader;
  }

  update(data) {
    const rows = document.createElement("div");

    this.data = [...this.data, ...data];
    rows.innerHTML = this.getTableProducts(data);

    this.subElements.body.append(...rows.childNodes);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.element.remove();
    document.removeEventListener("scroll", this.onWindowScroll);
  }
}
