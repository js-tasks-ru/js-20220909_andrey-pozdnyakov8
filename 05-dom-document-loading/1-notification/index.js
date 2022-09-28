export default class NotificationMessage {
  static activeNotification;

  wrapper;
  timer;

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

  show(item = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    item.append(this.element);
    this.timer = setTimeout(() => this.remove(), this.duration);

    NotificationMessage.activeNotification = this;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.notificationTemplate;
    this.element = wrapper.firstElementChild;   
  }

  remove() {
    if (this.element) {this.element.remove();}
    clearTimeout(this.timer);
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeNotification = null;
  }
}

// const btn1 = document.querySelector("#btn1");




