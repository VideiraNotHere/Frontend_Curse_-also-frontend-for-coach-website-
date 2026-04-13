/**
 * ScrollToTop — плавный скролл к началу страницы по клику на кнопку.
 * При прокрутке ниже порога кнопка появляется, иначе — скрыта.
 */
export default class ScrollToTop {
  /**
   * @param {string} buttonId — id кнопки «Наверх»
   * @param {number} [threshold=400] — порог скролла (px) для показа кнопки
   */
  constructor(buttonId, threshold = 400) {
    this._button = document.getElementById(buttonId);
    this._threshold = threshold;

    if (!this._button) return;

    this._button.addEventListener('click', () => this._scrollToTop());
    window.addEventListener('scroll', () => this._toggleVisibility(), { passive: true });
    this._toggleVisibility();
  }

  _scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _toggleVisibility() {
    if (window.scrollY > this._threshold) {
      this._button.classList.add('is-visible');
    } else {
      this._button.classList.remove('is-visible');
    }
  }
}
