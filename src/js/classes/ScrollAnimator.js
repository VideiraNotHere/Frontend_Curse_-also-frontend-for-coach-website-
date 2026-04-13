/**
 * ScrollAnimator — Intersection Observer для fade-in анимаций при скролле.
 * Использует класс .fade-in для целевых элементов и добавляет .is-visible при входе в viewport.
 */
export default class ScrollAnimator {
  /**
   * @param {string} selector — CSS-селектор целевых элементов
   * @param {Object} options — настройки IntersectionObserver
   */
  constructor(selector = '.fade-in', options = {}) {
    this.selector = selector;
    this.options = {
      threshold: options.threshold || 0.15,
      rootMargin: options.rootMargin || '0px 0px -40px 0px',
    };
    this.elements = document.querySelectorAll(this.selector);
    this.observer = null;

    this._init();
  }

  /**
   * Инициализация Observer или fallback для старых браузеров.
   */
  _init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this._handleIntersection(entries),
        this.options,
      );

      this.elements.forEach((el) => this.observer.observe(el));
    } else {
      this._showAll();
    }
  }

  /**
   * Обработчик пересечения — показывает элемент и прекращает наблюдение.
   * @param {IntersectionObserverEntry[]} entries
   */
  _handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        this.observer.unobserve(entry.target);
      }
    });
  }

  /**
   * Fallback: показать все элементы сразу.
   */
  _showAll() {
    this.elements.forEach((el) => el.classList.add('is-visible'));
  }

  /**
   * Уничтожить наблюдатель.
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
