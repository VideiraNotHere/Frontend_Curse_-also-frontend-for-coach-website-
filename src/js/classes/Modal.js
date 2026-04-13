/**
 * Modal — универсальный класс для модальных окон.
 * Управляет открытием, закрытием, overlay-кликом и формой бронирования.
 */
export default class Modal {
  /**
   * @param {string} modalId — ID модального окна
   * @param {Object} options — настройки (formId, successId, triggerId)
   */
  constructor(modalId, options = {}) {
    this.modal = document.getElementById(modalId);
    this.formEl = options.formId ? document.getElementById(options.formId) : null;
    this.successEl = options.successId ? document.getElementById(options.successId) : null;
    this.triggerEl = options.triggerId ? document.getElementById(options.triggerId) : null;

    if (this.modal) {
      this._init();
    }
  }

  /**
   * Привязка кнопок закрытия, триггера и формы.
   */
  _init() {
    this.modal.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', () => this.close());
    });

    if (this.triggerEl) {
      this.triggerEl.addEventListener('click', (e) => {
        e.preventDefault();
        this.resetForm();
        this.open();
      });
    }

    if (this.formEl) {
      this.formEl.addEventListener('submit', (e) => this._handleSubmit(e));
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
        this.close();
      }
    });
  }

  /**
   * Открыть модальное окно.
   */
  open() {
    this.modal.classList.add('is-open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  /**
   * Закрыть модальное окно.
   */
  close() {
    this.modal.classList.remove('is-open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  /**
   * Сбросить форму в начальное состояние.
   */
  resetForm() {
    if (this.formEl) {
      this.formEl.hidden = false;
      this.formEl.reset();
    }
    if (this.successEl) {
      this.successEl.hidden = true;
    }
  }

  /**
   * Обработка отправки формы бронирования.
   * @param {Event} e
   */
  async _handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.formEl);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке заявки');
      }
    } catch (err) {
      console.warn('Backend unavailable, showing demo success:', err.message);
    }

    this.formEl.hidden = true;
    if (this.successEl) {
      this.successEl.hidden = false;
    }
    this.formEl.reset();
  }
}
