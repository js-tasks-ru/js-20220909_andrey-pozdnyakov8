import escapeHtml from "./utils/escape-html.js";
// import fetchJson from "./utils/fetch-json.js";

const IMGUR_CLIENT_ID = "28aaa2e823b03b1";
const BACKEND_URL = "https://course-js.javascript.ru";
const PRODUCTS_URL = "api/rest/products";
const CATEGORIES_URL = "api/rest/categories";

export default class ProductForm {
  element;
  subElements = {};
  product = {
    id: "",
    title: "",
    description: "",
    brand: "",
    quantity: 1,
    subcategory: "",
    status: 1,
    characteristics: [],
    images: [],
    price: 0,
    discount: 0,
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
      // console.log(this.categories);

      return this.categories;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchProductData() {
    const pathNameURL = `${BACKEND_URL}/${PRODUCTS_URL}`;
    const fetchURL = new URL(pathNameURL);
    // console.log(this.productId);
    fetchURL.searchParams.set("id", this.productId);

    try {
      const response = await fetch(fetchURL.toString());
      const data = await response.json();
      this.product = data[0];
      // console.log(this.product);
      // console.log(this.product.title);

      return this.product;
    } catch (error) {
      console.log(error);
    }
  }

  onSaveProductClick = (event) => {
    const saveButton = event.target.closest('[name="save"]');
    // console.log(this.product);
    if (saveButton) {
      this.save();
    }
  };

  initListeners() {
    document.addEventListener("pointerdown", this.onSaveProductClick);
  }

  removeListeners() {
    document.removeEventListener("pointerdown", this.onSaveProductClick);
  }

  async save() {
    this.product.title = this.subElements.title.value;
    this.product.id = this.subElements.title.value;
    this.product.description = this.subElements.description.innerHTML;
    this.product.price = parseInt(this.subElements.price.value);
    this.product.discount = parseInt(this.subElements.discount.value);
    this.product.quantity = parseInt(this.subElements.quantity.value);
    this.product.rating = null;
    this.product.images = this.getImages();

    const productsURL = `${BACKEND_URL}/${PRODUCTS_URL}`;
    // console.log(this.productId);

    try {
      await fetch(productsURL.toString(), {
        method: this.productId ? "PATCH" : "PUT",
        body: JSON.stringify(this.product),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const savedEvent = new CustomEvent("product-saved");
      const updatedEvent = new CustomEvent("product-updated", { detail: this.product.id});
      this.element.dispatchEvent(this.productId ? updatedEvent : savedEvent);
    } catch (error) {
      console.log(error);
    }
  }

  get categoriesTemplate() {
    return this.categories
      .map((category) => {
        return category.subcategories
          .map((subcategory) => {
            return `<option value="${category.id}-i-${subcategory.id}">${category.title} &gt; ${subcategory.title}</option>`;
          })
          .join("");
      })
      .join("");
  }

  getImages() {
    const { imageListContainer } = this.subElements;
    const imagesUl = imageListContainer.children;
    if (!imagesUl.length) {return [];}
    const images = [];

    for (const image of imagesUl) {
      const url = image.children[0].value;
      const source = image.children[1].value;
      images.push({ url, source });
    }
    return images;
  }

  get imageTemplate() {
    return this.product.images.map((image) => {
      return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${image.url}">
          <input type="hidden" name="source" value="${image.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
            <span>${image.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `;
    }).join('');
  }

  get productFormTemplate() {
    return `
    <div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
        <fieldset>
          <label class="form-label">Название товара</label>
          <input required="" type="text" id='title' name="title" class="form-control" placeholder="Название товара" data-element='title'>
        </fieldset>
      </div>
      <div class="form-group form-group__wide">
        <label class="form-label">Описание</label>
        <textarea required="" class="form-control" id='description' name="description" data-element="description" placeholder="Описание товара"></textarea>
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
        <div data-element="imageListContainer">
          <ul class="sortable-list" data-element='imageList'></ul>
        </div>
        <button id='uploadImage' type="button" name="uploadImage" class="button-primary-outline" data-element="uploadImage"><span>Загрузить</span></button>
        <input type='file' hidden/>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select id='subcategory' class="form-control" name="subcategory" data-element='categories'>
          ${this.categoriesTemplate}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
        <fieldset>
          <label class="form-label">Цена ($)</label>
          <input id='price' required="" type="number" name="price" class="form-control" placeholder="100" data-element='price'>
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" id='discount' name="discount" class="form-control" placeholder="0" data-element='discount'>
        </fieldset>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" id='quantity' name="quantity" placeholder="1" data-element='quantity'>
      </div>
      <div class="form-group form-group__part-half">
        <label class="form-label">Статус</label>
        <select class="form-control" id='status' name="status" data-element='status'>
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline" data-element='saveProduct' onclick='return false'>Добавить товар</button>
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
    // console.log(result);
    return result;
  }

  renderProductItem() {
    this.subElements.title.value = this.product.title;
    this.subElements.description.innerHTML = this.product.description;
    this.subElements.imageListContainer.innerHTML = this.imageTemplate;
    this.subElements.price.value = this.product.price;
    this.subElements.discount.value = this.product.discount;
    this.subElements.quantity.value = this.product.quantity;
    this.subElements.saveProduct.innerHTML = "Сохранить товар";
  }

  async render() {
    await this.fetchCategoriesData();
    if (this.productId) {await this.fetchProductData();}

    const element = document.createElement("div");

    element.innerHTML = this.productFormTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();

    if (this.productId) {this.renderProductItem();}
    this.initListeners();
    return this.element;
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
