/**
 * Класс PhonePopup для отображения модального окна с номером телефона
 * Реализует паттерн инкапсуляции для UI-компонента
 */
export default class PhonePopup {
  constructor(triggerId) {
    this.triggerBtn = document.getElementById(triggerId);

    if (!this.triggerBtn) return;

    this.phoneNumber = '+7 (964) 512-65-65';
    this.isOpen = false;

    this.init();
  }

  init() {
    this.createPopupHTML();
    this.bindEvents();
  }

  createPopupHTML() {
    // Создаем контейнер оверлея
    this.overlay = document.createElement('div');
    this.overlay.className = 'phone-popup-overlay';
    this.overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            opacity: 0; visibility: hidden;
            transition: all 0.3s ease;
            display: flex; align-items: center; justify-content: center;
            z-index: 2000;
        `;

    // Создаем модальное окно
    this.popup = document.createElement('div');
    this.popup.className = 'phone-popup-window';
    this.popup.style.cssText = `
            background: var(--surface);
            padding: var(--space-xl);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            transform: translateY(20px);
            transition: transform 0.3s ease;
            text-align: center;
            border: 1px solid var(--surface-border);
            max-width: 90%;
            width: 320px;
        `;

    // Внутреннее содержимое
    this.popup.innerHTML = `
            <div style="color: var(--accent); margin-bottom: 1rem;">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: var(--fs-xl); margin-bottom: 0.5rem; color: var(--text);">Связь со мной</h3>
            <p style="font-size: var(--fs-sm); color: var(--text-soft); margin-bottom: var(--space-md);">Звоните или пишите в мессенджеры</p>
            <a href="tel:+79645126565" style="display: block; font-family: var(--font-text); font-weight: var(--fw-bold); font-size: 1.25rem; white-space: nowrap; color: var(--highlight); text-decoration: none; margin-bottom: var(--space-lg); letter-spacing: 0.05em;">${this.phoneNumber}</a>
            <button class="btn btn--primary" id="phonePopupCloseBtn" style="width: 100%;">Хорошо</button>
        `;

    this.overlay.appendChild(this.popup);
    document.body.appendChild(this.overlay);

    this.closeBtn = this.popup.querySelector('#phonePopupCloseBtn');
  }

  bindEvents() {
    this.triggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });

    this.closeBtn.addEventListener('click', () => this.close());

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    this.overlay.style.opacity = '1';
    this.overlay.style.visibility = 'visible';
    this.popup.style.transform = 'translateY(0)';
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
    this.overlay.style.opacity = '0';
    this.overlay.style.visibility = 'hidden';
    this.popup.style.transform = 'translateY(20px)';
  }
}
