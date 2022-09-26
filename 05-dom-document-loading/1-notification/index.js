export default class NotificationMessage {
  constructor(message = "", { duration = 0, type = "" } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get notificationTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  show() {
    if (this.element) {this.remove();}

    document.body.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.notificationTemplate;
    this.element = wrapper.firstElementChild;   
  }

  remove() {
    if (this.element) {this.element.remove();}
    clearTimeout(this.element.timeout);
  }

  destroy() {
    this.element.remove();
  }
}

const btn1 = document.querySelector("#btn1");




