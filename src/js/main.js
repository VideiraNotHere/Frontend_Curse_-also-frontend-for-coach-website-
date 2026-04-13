/**
 * ======================================================================
 * Main Entry Point — Coaching Landing Page
 * ======================================================================
 * Точка входа приложения. Импортирует CSS и все JS-модули (классы),
 * инициализирует их при загрузке DOM.
 *
 * Архитектура: строгий Class-based OOP (ES6+).
 * Сборка: Vite.
 * ======================================================================
 */

/* ── CSS ────────────────────────────────────────────────────────────────── */
import '../css/style.css';

/* ── JS Classes ─────────────────────────────────────────────────────────── */
import ScrollAnimator from './classes/ScrollAnimator.js';
import Header from './classes/Header.js';
import MobileNav from './classes/MobileNav.js';
import SmoothScroll from './classes/SmoothScroll.js';
import Accordion from './classes/Accordion.js';
import Lightbox from './classes/Lightbox.js';
import Modal from './classes/Modal.js';
import PaymentGateway from './classes/PaymentGateway.js';
import QuoteAPI from './classes/QuoteAPI.js';
import PhonePopup from './classes/PhonePopup.js';
import ScrollToTop from './classes/ScrollToTop.js';
import CertificateSlider from './classes/CertificateSlider.js';

/* ── Application Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /** 1. Scroll fade-in animations */
  new ScrollAnimator('.fade-in', {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  /** 2. Header scroll state */
  new Header('header', 20);

  /** 3. Mobile navigation mechanism */
  new MobileNav('burgerBtn', 'mainNav');

  /** 4. Smooth anchor scrolling (Header compensation: 16px) */
  new SmoothScroll('header', 16);

  /** 5. FAQ Accordion handler */
  new Accordion('faqAccordion');

  /** 6. Certificate lightbox initialization */
  new Lightbox('certLightbox', '.cert-card');

  /** 7. Booking modal orchestration */
  new Modal('bookingModal', {
    formId: 'bookingForm',
    successId: 'bookingSuccess',
    triggerId: 'btnIntroMeeting',
  });

  /** 8. Payment gateway (Sberbank / Backend fallback) */
  new PaymentGateway({
    paymentModalId: 'paymentModal',
    bookingModalId: 'bookingModal',
    apiUrl: '/api/payment/create',
  });

  /** 9. External REST API Quote integration */
  const quoteApi = new QuoteAPI('quoteApiBlock');
  const refreshBtn = document.getElementById('quoteRefreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => quoteApi.refresh());
  }

  /** 10. Phone Popup initialization */
  new PhonePopup('phonePopupTrigger');

  /* 11. Scroll-to-top button */
  const scrollToTop = new ScrollToTop('scrollTopBtn', 400);

  /* 12. Certificates slider */
  const certSlider = new CertificateSlider({
    sliderId: 'certsSliderBlock',
    trackId: 'certsTrack',
    prevBtnId: 'certsPrev',
    nextBtnId: 'certsNext',
  });

  console.log('Coaching App initialized:', {
    scrollAnimator,
    header,
    mobileNav,
    smoothScroll,
    accordion,
    lightbox,
    bookingModal,
    paymentGateway,
    quoteApi,
    phonePopup,
    scrollToTop,
    certSlider,
  });
});
