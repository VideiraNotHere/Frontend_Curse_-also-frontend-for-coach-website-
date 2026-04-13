/**
 * QuoteAPI — получение цитаты из внешнего REST API (JSON) в реальном времени.
 *
 * Интеграция с открытым API: https://dummyjson.com/quotes/random
 * Отображает «Мысль для рефлексии» перед блоком отзывов.
 * При ошибке API — показывает fallback-цитату.
 */
export default class QuoteAPI {
  /**
   * @param {string} containerId — ID контейнера для цитаты
   * @param {string} apiUrl — URL внешнего API
   */
  constructor(containerId = 'quoteApiBlock') {
    this.container = document.getElementById(containerId);

    this.fallbackQuote = {
      quote: 'Единственный способ сделать великую работу — полюбить то, чем занимаешься.',
      author: 'Стив Джобс',
    };

    this.isFetching = false; // Блокировка от множественных кликов

    if (this.container) {
      this._bindEvents();
      this._init();
    }
  }

  _bindEvents() {
    const refreshBtn = this.container.querySelector('.quote-api__refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refresh());
    }
  }

  /**
   * Запуск загрузки цитаты.
   */
  async _init() {
    this._showLoading();

    try {
      const data = await this._fetchQuote();
      this._render(data.quoteText, data.quoteAuthor);
    } catch (err) {
      console.warn('QuoteAPI: fallback цитата используется.', err.message);
      this._render(this.fallbackQuote.quote, this.fallbackQuote.author);
    }
  }

  /**
   * Асинхронный запрос к внешнему API.
   * @returns {Promise<{quoteText: string, quoteAuthor: string}>}
   */
  async _fetchQuote() {
    // 1. Forismatic API поддерживает параметр key
    const randomKey = Math.floor(Math.random() * 999999);
    const forismaticUrl = `http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru&key=${randomKey}`;

    // 2. Используем более быстрый и стабильный CORS-прокси Codetabs (вместо AllOrigins)
    const apiUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(forismaticUrl)}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    // Codetabs возвращает сразу готовый JSON, распаковка .contents не нужна!
    const data = await response.json();

    return {
      quoteText: data.quoteText || this.fallbackQuote.quote,
      quoteAuthor: data.quoteAuthor ? data.quoteAuthor.trim() : 'Неизвестный автор',
    };
  }

  _showLoading() {
    this.container.classList.remove('is-loaded');

    setTimeout(() => {
      const quoteText = this.container.querySelector('.quote-api__text');
      if (quoteText) {
        quoteText.textContent = 'Загружаем мысль дня…';
      }
      const quoteAuthor = this.container.querySelector('.quote-api__author');
      if (quoteAuthor) {
        quoteAuthor.textContent = '';
      }
    }, 300);
  }

  /**
   * Рендеринг цитаты в контейнер.
   * @param {string} text — текст цитаты
   * @param {string} author — автор
   */
  _render(text, author) {
    // Ждем конца анимации скрытия (если была)
    setTimeout(() => {
      const quoteText = this.container.querySelector('.quote-api__text');
      const quoteAuthor = this.container.querySelector('.quote-api__author');

      if (quoteText) {
        quoteText.textContent = `«${text}»`;
      }
      if (quoteAuthor) {
        quoteAuthor.textContent = `— ${author}`;
      }

      // Плавное появление
      this.container.classList.add('is-loaded');
    }, 350);
  }

  /**
   * Загрузить новую цитату (для кнопки «Обновить»).
   */
  async refresh() {
    if (this.isFetching) return; // Предотвращаем резкую смену цитат при быстрых кликах

    this.isFetching = true;
    this._showLoading();

    try {
      const data = await this._fetchQuote();
      this._render(data.quoteText, data.quoteAuthor);
    } catch (err) {
      console.warn('QuoteAPI: не удалось обновить цитату.', err.message);
      this._render(this.fallbackQuote.quote, this.fallbackQuote.author);
    } finally {
      // Даем время на анимацию перед тем как разрешить новый клик
      setTimeout(() => {
        this.isFetching = false;
      }, 500);
    }
  }
}
