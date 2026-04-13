/**
 * SmoothScroll — плавная прокрутка для якорных ссылок.
 * Учитывает высоту фиксированного хедера при расчёте позиции.
 */
export default class SmoothScroll {
  /**
   * @param {string} headerElementId — ID хедера для расчёта offset
   * @param {number} extraOffset — дополнительный отступ в пикселях
   */
  constructor(headerElementId = 'header', extraOffset = 16) {
    this.headerEl = document.getElementById(headerElementId);
    this.extraOffset = extraOffset;

    this._init();
  }

  /**
   * Привязка обработчиков ко всем ссылкам с href="#...".
   */
  _init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => this._handleClick(e, anchor));
    });
  }

  /**
   * Обработка клика: вычисление позиции и плавный скролл.
   * @param {Event} e
   * @param {HTMLAnchorElement} anchor
   */
  _handleClick(e, anchor) {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') {
      return;
    }

    const targetEl = document.querySelector(targetId);
    if (!targetEl) {
      return;
    }

    e.preventDefault();

    const headerHeight = this.headerEl ? this.headerEl.offsetHeight : 0;
    const targetPosition =
      targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - this.extraOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }
}
