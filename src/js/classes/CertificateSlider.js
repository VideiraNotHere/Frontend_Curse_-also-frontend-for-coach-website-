/**
 * CertificateSlider — горизонтальный скролл-слайдер для сертификатов.
 */
export default class CertificateSlider {
  /**
   * @param {string} sliderId — ID контейнера слайдера
   * @param {string} trackId — ID трека (контейнера с карточками)
   * @param {string} prevBtnId — ID кнопки "назад"
   * @param {string} nextBtnId — ID кнопки "вперед"
   */
  constructor({ sliderId, trackId, prevBtnId, nextBtnId }) {
    this.slider = document.getElementById(sliderId);
    this.track = document.getElementById(trackId);
    this.prevBtn = document.getElementById(prevBtnId);
    this.nextBtn = document.getElementById(nextBtnId);

    if (!this.slider || !this.track || !this.prevBtn || !this.nextBtn) {
      return;
    }

    this._bindEvents();
    this._updateButtons();
  }

  _bindEvents() {
    this.prevBtn.addEventListener('click', () => this.scroll(-1));
    this.nextBtn.addEventListener('click', () => this.scroll(1));
    this.track.addEventListener(
      'scroll',
      () => {
        // Debounce or requestAnimationFrame if needed, but simple update works for basic use cases
        this._updateButtons();
      },
      { passive: true },
    );

    // Update on resize
    window.addEventListener('resize', () => this._updateButtons(), { passive: true });
  }

  scroll(direction) {
    // Получаем ширину одного элемента плюс gap (если есть)
    // Самый простой и точный способ - смещаться на ширину отображаемой области
    const scrollAmount = this.track.clientWidth;

    this.track.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  }

  _updateButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = this.track;

    // Если скролл в самом начале (или почти)
    this.prevBtn.disabled = scrollLeft <= 1;

    // Если скролл в самом конце (или почти, с небольшой погрешностью округления)
    this.nextBtn.disabled = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1;
  }
}
