// import escapeHtml from "./utils/escape-html.js";
// import fetchJson from "./utils/fetch-json.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";
const PRODUCTS_URL = 'api/rest/products';
const CATEGORIES_URL = 'api/rest/categories';

export default class ProductForm {
  element;
  subElements = {};
  product = {
    id: '',
    title: '',
    description: '',
    brand: '',
    quantity: 1,
    subcategory: '',
    status: 1,
    characteristics: [],
    images: [],
    price: 0,
    discount: 0
  };

  constructor(productId) {
    this.productId = productId;
  }

  async fetchCategoriesData() {
    const pathNameURL = `${BACKEND_URL}/${CATEGORIES_URL}`;
    const fetchURL = new URL(pathNameURL);

    fetchURL.searchParams.set("_sort", "weight");
    fetchURL.searchParams.set("_refs", "subcategory");

    try {
      const response = await fetch(fetchURL.toString());
      const data = await response.json();
      this.categories = data;
      console.log(this.categories);

      return this.categories;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchProductData() {
    const pathNameURL = `${BACKEND_URL}/${PRODUCTS_URL}`;
    const fetchURL = new URL(pathNameURL);
    console.log(this.productId);
    fetchURL.searchParams.set("id", this.productId);

    try {
      const response = await fetch(fetchURL.toString());
      const data = await response.json();
      this.product = data[0];
      console.log(this.product);
      console.log(this.product.title);

      return this.product;
    } catch (error) {
      console.log(error);
    }
  }

  onSaveProductClick = (event) => {
    const saveButton = event.target.closest('[name = "save"]');
    if (saveButton) {
      this.save();
    }
  }

  initListeners() {
    document.addEventListener("pointerdown", this.onSaveProductClick);
  }

  removeListeners() {
    document.removeEventListener("pointerdown", this.onSaveProductClick);
  }

  async save() {
    const productsURL = `${BACKEND_URL}/${PRODUCTS_URL}`;
    console.log(this.productId);

    try {
      await fetch(productsURL.toString(), {
        method: this.productId ? "PATCH" : "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.product),
      });

      const savedEvent = new CustomEvent("product-saved", { bubbles: true });
      const updatedEvent = new CustomEvent("product-updated", { bubbles: true });
      this.element.dispatchEvent(this.productId ? savedEvent : updatedEvent);

    } catch (error) {
      console.log(error);
    }
  }

  // async updateProduct() {
  //   try {
  //     const response = await fetch(fetchURL.toString());
  //     const data = await response.json();
  //     this.product = data[0];
  //     console.log(this.product);
  //     console.log(this.product.title);

  //     return this.product;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  get categoriesTemplate() {
    return this.categories.map((category) => {
      return category.subcategories.map((subcategory) => {
        return `<option value="${category.id}-i-${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`;
      }).join('');
    }).join('');
  }

  get productFormTemplate() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" name="title" class="form-control" placeholder="${this.product.title}">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="${this.product.description}"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer"><ul class="sortable-list"><li class="products-edit__imagelist-item sortable-list__item" style="">
              <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
              <input type="hidden" name="source" value="75462242_3746019958756848_838491213769211904_n.jpg">
              <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="https://i.imgur.com/MWorX2R.jpg">
            <span>75462242_3746019958756848_838491213769211904_n.jpg</span>
          </span>
              <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
              </button></li></ul></div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" name="subcategory">
              ${this.categoriesTemplate}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" name="price" class="form-control" placeholder="${this.product.price}">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" name="discount" class="form-control" placeholder="${this.product.discount}">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" name="quantity" placeholder="${this.product.quantity}">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
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
    await this.fetchCategoriesData();
    await this.fetchProductData();

    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.productFormTemplate;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();

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
