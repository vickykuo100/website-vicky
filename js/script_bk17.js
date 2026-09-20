document.addEventListener("DOMContentLoaded", function () {
  // 初始化漢堡選單互動
  initMobileNav();

  // 初始化 Hero 輪播圖
  initHeroSlider();

  // 讀取 JSON 資料
  fetch("data/website-content.json")
    .then((response) => response.json())
    .then((data) => {
      renderHero(data.hero);
      renderFeatures(data.featuresTitle, data.features);
      renderFAQ(data.faqTitle, data.faq);
      renderContact(data.contact);
      renderFooter(data.footer);
    })
    .catch((error) => {
      console.error("讀取 JSON 資料時發生錯誤：", error);
    });

  // 通用捲動淡入升起動態
  initScrollReveal();
});

// 手機版漢堡選單邏輯
function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!navToggle || !navLinks) return;

  // 關閉選單輔助函式
  function closeMenu() {
    navToggle.classList.remove("is-active");
    navLinks.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "開啟選單");
  }

  // 點擊漢堡按鈕切換展開 / 收合
  navToggle.addEventListener("click", function () {
    const isExpanded = navToggle.classList.contains("is-active");

    if (isExpanded) {
      closeMenu();
    } else {
      navToggle.classList.add("is-active");
      navLinks.classList.add("is-active");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "關閉選單");
    }
  });

  // 點擊選單內的任何連結時自動收合選單
  const links = navLinks.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });
}

// Hero 輪播邏輯
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slider .slide");
  if (slides.length === 0) return;

  let currentSlide = 0;
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 4000); // 每 4 秒更換一張圖片
}

// 渲染 Hero 區塊
function renderHero(heroData) {
  if (!heroData) return;
  const kicker = document.getElementById("hero-kicker");
  const title = document.getElementById("hero-title");
  const subtitle = document.getElementById("hero-subtitle");
  const ctaBtn = document.getElementById("hero-cta");

  if (kicker) kicker.textContent = heroData.kicker;
  if (title) title.textContent = heroData.title;
  if (subtitle) subtitle.textContent = heroData.subtitle;
  if (ctaBtn) {
    ctaBtn.innerHTML = `<span>${heroData.cta}</span> <span class="btn-arrow">→</span>`;
  }
}

// 渲染特色卡片區塊
function renderFeatures(title, features) {
  if (!features) return;
  const mainTitle = document.getElementById("features-main-title");
  const grid = document.getElementById("features-grid");
  if (mainTitle) mainTitle.textContent = title;
  if (!grid) return;

  grid.innerHTML = "";
  features.forEach((item) => {
    const card = document.createElement("div");
    card.className = "feature-card";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.imageAlt}">
      <div class="feature-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// 渲染 FAQ 區塊
function renderFAQ(title, faqList) {
  if (!faqList) return;
  const mainTitle = document.getElementById("faq-main-title");
  const container = document.getElementById("faq-list");
  if (mainTitle) mainTitle.textContent = title;
  if (!container) return;

  container.innerHTML = "";
  faqList.forEach((item) => {
    const faqItem = document.createElement("div");
    faqItem.className = "faq-item";

    const questionBtn = document.createElement("button");
    questionBtn.className = "faq-question";
    questionBtn.innerHTML = `
      <span>${item.question}</span>
      <span class="faq-toggle-icon">+</span>
    `;

    const answerDiv = document.createElement("div");
    answerDiv.className = "faq-answer";
    answerDiv.textContent = item.answer;

    questionBtn.addEventListener("click", () => {
      const isActive = faqItem.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("active");
        const icon = el.querySelector(".faq-toggle-icon");
        if (icon) icon.textContent = "+";
      });

      if (!isActive) {
        faqItem.classList.add("active");
        questionBtn.querySelector(".faq-toggle-icon").textContent = "−";
      }
    });

    faqItem.appendChild(questionBtn);
    faqItem.appendChild(answerDiv);
    container.appendChild(faqItem);
  });
}

// 渲染聯絡區塊
function renderContact(contactData) {
  if (!contactData) return;
  const title = document.getElementById("contact-title");
  const desc = document.getElementById("contact-description");

  if (title) title.textContent = contactData.title;
  if (desc) desc.textContent = contactData.description;
}

// 渲染 Footer
function renderFooter(footerText) {
  if (!footerText) return;
  const footerEl = document.getElementById("footer-text");
  if (footerEl) footerEl.textContent = footerText;
}

// 捲動淡入 Observer
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}