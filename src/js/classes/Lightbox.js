/**
 * Lightbox — зум-просмотр сертификатов в модальном окне.
 * Поддерживает клик, клавиатуру (Escape), overlay close.
 */
export default class Lightbox {
  /**
   * @param {string} lightboxId — ID lightbox-контейнера
   * @param {string} cardsSelector — CSS-селектор карточек сертификатов
   */
  constructor(lightboxId = 'certLightbox', cardsSelector = '.cert-card') {
    this.lightbox = document.getElementById(lightboxId);
    this.contentEl = document.getElementById('lightboxContent');
    this.captionEl = document.getElementById('lightboxCaption');
    this.cards = document.querySelectorAll(cardsSelector);

    if (this.lightbox) {
      this._init();
    }
  }

  /**
   * Привязка обработчиков к карточкам и кнопкам закрытия.
   */
  _init() {
    this.cards.forEach((card) => {
      card.addEventListener('click', () => this.open(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(card);
        }
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Открыть сертификат');
    });

    this.lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
      el.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  /**
   * Открыть lightbox с содержимым карточки.
   * @param {HTMLElement} card — карточка сертификата
   */
  open(card) {
    const img = card.querySelector('img');
    const label = card.querySelector('.cert-card__label');

    if (img) {
      this.contentEl.innerHTML = '';
      const enlargedImg = document.createElement('img');
      enlargedImg.src = img.src;
      enlargedImg.alt = img.alt || '';
      this.contentEl.appendChild(enlargedImg);
    } else {
      this.contentEl.innerHTML =
        '<p class="lightbox__placeholder">Добавьте изображение сертификата</p>';
    }

    this.captionEl.textContent = label ? label.textContent : '';
    this.lightbox.classList.add('is-open');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  /**
   * Закрыть lightbox.
   */
  close() {
    this.lightbox.classList.remove('is-open');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
}
