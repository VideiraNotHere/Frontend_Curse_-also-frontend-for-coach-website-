/**
 * Header — управление состоянием хедера при скролле.
 * Добавляет класс .is-scrolled для визуального изменения (тень, бордер).
 */
export default class Header {
  /**
   * @param {string} elementId — ID элемента хедера
   * @param {number} scrollThreshold — порог скролла в пикселях
   */
  constructor(elementId = 'header', scrollThreshold = 20) {
    this.element = document.getElementById(elementId);
    this.scrollThreshold = scrollThreshold;
    this._boundUpdate = this._updateState.bind(this);

    if (this.element) {
      this._init();
    }
  }

  /**
   * Привязка события scroll и начальная проверка.
   */
  _init() {
    window.addEventListener('scroll', this._boundUpdate, { passive: true });
    this._updateState();
  }

  /**
   * Обновление CSS-класса в зависимости от позиции скролла.
   */
  _updateState() {
    if (window.scrollY > this.scrollThreshold) {
      this.element.classList.add('is-scrolled');
    } else {
      this.element.classList.remove('is-scrolled');
    }
  }

  /**
   * Получить высоту хедера.
   * @returns {number}
   */
  getHeight() {
    return this.element ? this.element.offsetHeight : 0;
  }

  /**
   * Уничтожить обработчик.
   */
  destroy() {
    window.removeEventListener('scroll', this._boundUpdate);
  }
}
