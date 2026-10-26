/**
 * CyberGuard Main Frontend Interactions
 * Header scroll, mobile drawer, pricing billing switcher,
 * device guide tabs, FAQ accordion, reading progress.
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --------------------------------------------------
  // 1. Header Sticky Scroll & Scrollspy
  // --------------------------------------------------
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scrollspy
    if (sections.length > 0 && navLinks.length > 0) {
      let currentSectionId = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 140;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href').substring(1);
        if (href === currentSectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    // Reading Progress Bar (if on article page)
    const progressBar = document.querySelector('.reading-progress-bar');
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --------------------------------------------------
  // 2. Mobile Drawer Navigation
  // --------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', function () {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------
  // 3. Pricing Billing Cycle Switcher
  // --------------------------------------------------
  const cycleButtons = document.querySelectorAll('.cycle-btn');
  const planCards = document.querySelectorAll('.plan-card');

  const pricingData = {
    monthly: [
      { price: '15.00', period: '/ 月', note: '标准按月续费 · 100GB 基础高速流量' },
      { price: '28.00', period: '/ 月', note: '标准按月续费 · 200GB 推荐高速流量' },
      { price: '98.00', period: '/ 月', note: '标准按月续费 · 1000GB 团队高配流量' }
    ],
    quarterly: [
      { price: '42.00', period: '/ 季', note: '折合 ¥14.0/月 · 季度立省 ¥3.00' },
      { price: '78.00', period: '/ 季', note: '折合 ¥26.0/月 · 季度立省 ¥6.00' },
      { price: '270.00', period: '/ 季', note: '折合 ¥90.0/月 · 季度立省 ¥24.00' }
    ],
    semiannual: [
      { price: '80.00', period: '/ 半年', note: '折合 ¥13.3/月 · 半年立省 ¥10.00' },
      { price: '150.00', period: '/ 半年', note: '折合 ¥25.0/月 · 半年立省 ¥18.00' },
      { price: '520.00', period: '/ 半年', note: '折合 ¥86.6/月 · 半年立省 ¥68.00' }
    ],
    annual: [
      { price: '150.00', period: '/ 年', note: '折合 ¥12.5/月 · 年付立省 ¥30.00 (推荐)' },
      { price: '280.00', period: '/ 年', note: '折合 ¥23.3/月 · 年付立省 ¥56.00 (推荐)' },
      { price: '980.00', period: '/ 年', note: '折合 ¥81.6/月 · 年付立省 ¥196.00' }
    ]
  };

  if (cycleButtons.length > 0) {
    cycleButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const cycle = this.dataset.cycle;
        cycleButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');

        const data = pricingData[cycle];
        if (data && planCards.length >= 3) {
          planCards.forEach((card, index) => {
            const priceVal = card.querySelector('.price-value');
            const pricePeriod = card.querySelector('.price-period');
            const cycleNote = card.querySelector('.plan-cycle-note');
            if (priceVal && data[index]) {
              priceVal.textContent = data[index].price;
            }
            if (pricePeriod && data[index]) {
              pricePeriod.textContent = data[index].period;
            }
            if (cycleNote && data[index]) {
              cycleNote.textContent = data[index].note;
            }
          });
        }
      });
    });
  }

  // --------------------------------------------------
  // 4. Device Guide Tabs (Windows / macOS / Android / iOS)
  // --------------------------------------------------
  const tabButtons = document.querySelectorAll('.device-tab-btn');
  const tabPanes = document.querySelectorAll('.device-tab-pane');

  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const targetTab = this.dataset.tab;
        tabButtons.forEach((b) => b.classList.remove('active'));
        tabPanes.forEach((p) => p.classList.remove('active'));

        this.classList.add('active');
        const activePane = document.getElementById('tab-' + targetTab);
        if (activePane) {
          activePane.classList.add('active');
        }
      });
    });
  }

  // --------------------------------------------------
  // 5. FAQ Accordion System
  // --------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', function () {
        const isOpen = item.classList.contains('open');

        // Close other FAQ items for clean accordion UX
        faqItems.forEach((other) => {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
            const btn = other.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --------------------------------------------------
  // 6. Article Table of Contents Active Spy
  // --------------------------------------------------
  const tocLinks = document.querySelectorAll('.toc-item a');
  if (tocLinks.length > 0) {
    const headingElements = [];
    tocLinks.forEach((link) => {
      const targetId = link.getAttribute('href').substring(1);
      const el = document.getElementById(targetId);
      if (el) headingElements.push({ id: targetId, el: el, link: link.parentElement });
    });

    window.addEventListener('scroll', function () {
      const scrollPos = window.pageYOffset + 140;
      let activeId = '';
      for (let i = 0; i < headingElements.length; i++) {
        if (headingElements[i].el.offsetTop <= scrollPos) {
          activeId = headingElements[i].id;
        }
      }
      headingElements.forEach((h) => {
        if (h.id === activeId) {
          h.link.classList.add('active');
        } else {
          h.link.classList.remove('active');
        }
      });
    }, { passive: true });
  }

});
