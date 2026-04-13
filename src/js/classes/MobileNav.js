/**
 * MobileNav — бургер-меню для мобильной навигации.
 * Управляет toggle-состоянием меню и блокировкой скролла body.
 */
export default class MobileNav {
  /**
   * @param {string} burgerId — ID кнопки-бургера
   * @param {string} navId — ID блока навигации
   */
  constructor(burgerId = 'burgerBtn', navId = 'mainNav') {
    this.burger = document.getElementById(burgerId);
    this.nav = document.getElementById(navId);
    this.isOpen = false;

    if (this.burger && this.nav) {
      this._init();
    }
  }

  /**
   * Привязка обработчиков: клик по бургеру и навигационным ссылкам.
   */
  _init() {
    this.burger.addEventListener('click', () => this.toggle());

    this.nav.querySelectorAll('.header__nav-link').forEach((link) => {
      link.addEventListener('click', () => this.close());
    });
  }

  /**
   * Переключить состояние меню.
   */
  toggle() {
    this.isOpen = !this.isOpen;
    this.nav.classList.toggle('is-open', this.isOpen);
    this.burger.classList.toggle('is-active', this.isOpen);
    document.body.classList.toggle('no-scroll', this.isOpen);
  }

  /**
   * Закрыть меню.
   */
  close() {
    this.isOpen = false;
    this.nav.classList.remove('is-open');
    this.burger.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }
}
