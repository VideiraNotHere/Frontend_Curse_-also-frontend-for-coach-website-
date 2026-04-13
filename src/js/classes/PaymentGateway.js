/**
 * PaymentGateway — интеграция с платёжным бекендом (Sberbank API).
 *
 * Логика:
 *   1. Собирает data-атрибуты кнопки тарифа (packageId, price, name)
 *   2. Делает POST /api/payment/create на Java-бекенд
 *   3. При успехе — redirect на formUrl Сбербанка
 *   4. При недоступности бекенда — fallback: открывает Modal записи
 */
export default class PaymentGateway {
  /**
   * @param {Object} options
   * @param {string} options.paymentModalId — ID модалки «обработка платежа»
   * @param {string} options.bookingModalId — ID модалки «запись» (fallback)
   * @param {string} options.apiUrl — URL бекенда
   */
  constructor(options = {}) {
    this.paymentModalId = options.paymentModalId || 'paymentModal';
    this.bookingModalId = options.bookingModalId || 'bookingModal';
    this.apiUrl = options.apiUrl || '/api/payment/create';

    this.paymentModal = document.getElementById(this.paymentModalId);
    this.bookingModal = document.getElementById(this.bookingModalId);
    this.errorEl = document.getElementById('paymentError');
    this.errorMsgEl = document.getElementById('paymentErrorMsg');
    this.processingEl = this.paymentModal
      ? this.paymentModal.querySelector('.payment-processing')
      : null;

    this.buttons = document.querySelectorAll('[data-package-id]');

    this._init();
  }

  /**
   * Привязка обработчиков к кнопкам оплаты и сброс состояния при закрытии.
   */
  _init() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const packageId = btn.dataset.packageId;
        const price = btn.dataset.price;
        const packageName = btn.dataset.name;
        this.initiatePayment(packageId, price, packageName);
      });
    });

    this._observeModalClose();
  }

  /**
   * Инициировать платёж. При ошибке — fallback на форму записи.
   * @param {string} packageId
   * @param {string} amount — сумма в копейках
   * @param {string} packageName
   */
  async initiatePayment(packageId, amount, packageName) {
    if (this.errorEl) {
      this.errorEl.hidden = true;
    }
    if (this.processingEl) {
      this.processingEl.hidden = false;
    }
    this._openModal(this.paymentModal);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: packageId,
          amount: parseInt(amount, 10),
          description: packageName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      if (data.formUrl) {
        window.location.href = data.formUrl;
      } else {
        throw new Error('Не получен URL платёжной формы от банка');
      }
    } catch (err) {
      console.error('Payment error:', err);
      this._showFallback(err.message);
    }
  }

  /**
   * Fallback: закрыть платёжную модалку и открыть форму записи.
   * @param {string} errorMsg
   */
  _showFallback(errorMsg) {
    this._closeModal(this.paymentModal);

    if (this.bookingModal) {
      const form = this.bookingModal.querySelector('form');
      const success = document.getElementById('bookingSuccess');
      if (form) {
        form.hidden = false;
      }
      if (success) {
        success.hidden = true;
      }
      this._openModal(this.bookingModal);
    }

    console.warn('Payment fallback activated:', errorMsg);
  }

  /**
   * Открыть модальное окно.
   * @param {HTMLElement} modal
   */
  _openModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  /**
   * Закрыть модальное окно.
   * @param {HTMLElement} modal
   */
  _closeModal(modal) {
    if (!modal) {
      return;
    }
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  /**
   * Сброс состояния payment modal при закрытии (MutationObserver).
   */
  _observeModalClose() {
    if (!this.paymentModal) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (!this.paymentModal.classList.contains('is-open')) {
        if (this.processingEl) {
          this.processingEl.hidden = false;
        }
        if (this.errorEl) {
          this.errorEl.hidden = true;
        }
      }
    });

    observer.observe(this.paymentModal, { attributes: true, attributeFilter: ['class'] });
  }
}
