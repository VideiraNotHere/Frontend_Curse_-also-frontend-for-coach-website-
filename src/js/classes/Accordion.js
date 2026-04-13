/**
 * Accordion — аккордеон для FAQ-секции.
 * Поддерживает aria-expanded и анимацию через max-height.
 */
export default class Accordion {
  /**
   * @param {string} containerId — ID контейнера аккордеона
   */
  constructor(containerId = 'faqAccordion') {
    this.container = document.getElementById(containerId);
    this.items = [];

    if (this.container) {
      this._init();
    }
  }

  /**
   * Находит все элементы аккордеона и привязывает обработчики.
   */
  _init() {
    this.items = this.container.querySelectorAll('.accordion__item');

    this.items.forEach((item) => {
      const trigger = item.querySelector('.accordion__trigger');
      if (trigger) {
        trigger.addEventListener('click', () => this._toggle(item));
      }
    });
  }

  /**
   * Переключить конкретный элемент, закрыв остальные.
   * @param {HTMLElement} targetItem
   */
  _toggle(targetItem) {
    const isOpen = targetItem.classList.contains('is-open');

    this._closeAll();

    if (!isOpen) {
      this._open(targetItem);
    }
  }

  /**
   * Открыть элемент.
   * @param {HTMLElement} item
   */
  _open(item) {
    item.classList.add('is-open');
    const trigger = item.querySelector('.accordion__trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Закрыть все элементы.
   */
  _closeAll() {
    this.items.forEach((item) => {
      item.classList.remove('is-open');
      const trigger = item.querySelector('.accordion__trigger');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
}
