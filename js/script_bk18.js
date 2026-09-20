document.addEventListener("DOMContentLoaded", function () {
  
  /* ==========================================================================
     1. 手機版漢堡選單切換
     ========================================================================== */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isActive = navToggle.classList.toggle("is-active");
      navLinks.classList.toggle("is-active");
      navToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
  }

  /* ==========================================================================
     2. 捲動淡入升起動態 ( Scroll Reveal )
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal");

  function handleScrollReveal() {
    const triggerBottom = window.innerHeight * 0.88;
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add("active");
      }
    });
  }

  if (revealElements.length > 0) {
    window.addEventListener("scroll", handleScrollReveal);
    handleScrollReveal(); // 初始化執行
  }

  /* ==========================================================================
     3. 讀取 JSON 資料並動態渲染頁面內容
     ========================================================================== */
  fetch("data/website-content.json")
    .then(response => response.json())
    .then(data => {
      
      // A. 通用 Footer
      const footerText = document.getElementById("footer-text");
      if (footerText && data.footer) {
        footerText.textContent = data.footer;
      }

      // B. 首頁渲染 (index.html)
      if (document.getElementById("hero-title")) {
        renderHomePage(data);
      }

      // C. 支持浪浪頁面渲染 (donate.html)
      if (document.getElementById("donate-hero-title")) {
        renderDonatePage(data.donatePage);
      }

    })
    .catch(error => {
      console.error("讀取 JSON 資料失敗:", error);
    });

  /* ==========================================================================
     4. 首頁渲染函式 ( Home Page Render )
     ========================================================================== */
  function renderHomePage(data) {
    // Hero 區塊
    if (data.hero) {
      document.getElementById("hero-kicker").textContent = data.hero.kicker || "";
      document.getElementById("hero-title").textContent = data.hero.title || "";
      document.getElementById("hero-subtitle").textContent = data.hero.subtitle || "";
      
      const heroCta = document.getElementById("hero-cta");
      if (heroCta) {
        heroCta.innerHTML = `${data.hero.cta || "立即支持"} <span class="btn-arrow">→</span>`;
      }
    }

    // Hero 背景輪播動態
    const slides = document.querySelectorAll(".hero-slider .slide");
    if (slides.length > 0) {
      let currentSlide = 0;
      setInterval(() => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
      }, 5000);
    }

    // 特色卡片區塊
    const featuresGrid = document.getElementById("features-grid");
    if (featuresGrid && data.features) {
      document.getElementById("features-main-title").textContent = data.featuresTitle || "我們的特色";
      featuresGrid.innerHTML = data.features.map(item => `
        <div class="feature-card">
          <img src="${item.imageUrl}" alt="${item.imageAlt}">
          <div class="feature-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </div>
      `).join("");
    }

    // 救援成果數據區塊
    const statsGrid = document.getElementById("stats-grid");
    if (statsGrid && data.stats) {
      document.getElementById("stats-main-title").textContent = data.statsTitle || "救援成果";
      statsGrid.innerHTML = data.stats.map(item => `
        <div class="stat-item">
          <div class="stat-number" data-target="${item.targetNumber}">0+</div>
          <div class="stat-label">${item.label}</div>
          <div class="stat-desc">${item.description}</div>
        </div>
      `).join("");

      // 啟用數字滾動累加動畫
      initCounterAnimation();
    }

    // 財務透明 / 勸募聲明區塊
    if (data.transparency) {
      document.getElementById("transparency-title").textContent = data.transparency.title || "";
      document.getElementById("transparency-description").textContent = data.transparency.description || "";
      
      const badgesContainer = document.getElementById("transparency-badges");
      if (badgesContainer) {
        const badges = [
          data.transparency.badge1,
          data.transparency.badge2,
          data.transparency.badge3
        ].filter(Boolean);

        badgesContainer.innerHTML = badges.map(b => `<span class="transparency-badge-item">✓ ${b}</span>`).join("");
      }
    }

    // FAQ 區塊
    const faqList = document.getElementById("faq-list");
    if (faqList && data.faq) {
      document.getElementById("faq-main-title").textContent = data.faqTitle || "常見問題";
      faqList.innerHTML = data.faq.map((item, index) => `
        <div class="faq-item">
          <button type="button" class="faq-question" aria-expanded="false">
            <span>${item.question}</span>
            <span class="faq-toggle-icon">+</span>
          </button>
          <div class="faq-answer">
            <p>${item.answer}</p>
          </div>
        </div>
      `).join("");

      // FAQ 手風琴切換監聽
      const faqQuestions = faqList.querySelectorAll(".faq-question");
      faqQuestions.forEach(btn => {
        btn.addEventListener("click", function () {
          const item = this.parentElement;
          const isActive = item.classList.contains("active");

          // 關閉其他開啟的手風琴
          document.querySelectorAll(".faq-item.active").forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove("active");
              openItem.querySelector(".faq-toggle-icon").textContent = "+";
            }
          });

          // 切換當前狀態
          item.classList.toggle("active", !isActive);
          this.querySelector(".faq-toggle-icon").textContent = isActive ? "+" : "−";
        });
      });
    }

    // 聯絡區塊
    if (data.contact) {
      document.getElementById("contact-title").textContent = data.contact.title || "";
      document.getElementById("contact-description").textContent = data.contact.description || "";
    }
  }

  /* ==========================================================================
     5. 救援成果數據動態跑數字函式 ( Number Counter Animation )
     ========================================================================== */
  function initCounterAnimation() {
    const statNumbers = document.querySelectorAll(".stat-number");
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statNumbers.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const duration = 2000; // 跑數字總耗時 2 秒
            const frameRate = 60;
            const totalFrames = Math.round((duration / 1000) * frameRate);
            let frame = 0;

            const timer = setInterval(() => {
              frame++;
              // 使用 easeOutQuad 減速平滑曲線
              const progress = frame / totalFrames;
              const currentVal = Math.round(target * (1 - Math.pow(1 - progress, 2)));

              counter.textContent = `${currentVal.toLocaleString()}+`;

              if (frame >= totalFrames) {
                counter.textContent = `${target.toLocaleString()}+`;
                clearInterval(timer);
              }
            }, 1000 / frameRate);
          });
        }
      });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector(".stats-section");
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  /* ==========================================================================
     6. 支持浪浪頁面渲染函式 ( Donate Page Render )
     ========================================================================== */
  function renderDonatePage(donateData) {
    if (!donateData) return;

    // Header 區塊
    document.getElementById("donate-hero-title").textContent = donateData.heroTitle || "支持浪浪計畫";
    document.getElementById("donate-hero-subtitle").textContent = donateData.heroSubtitle || "DONATE & SUPPORT";

    // 渲染方案卡片
    let currentType = "single"; // 預設單筆捐款 ("single" | "monthly")
    const plansGrid = document.getElementById("donate-plans-grid");

    function renderPlans() {
      const unitText = currentType === "monthly" ? " / 月" : "";
      
      plansGrid.innerHTML = donateData.plans.map(plan => {
        const isFeatured = plan.badge ? "featured" : "";
        const badgeHtml = plan.badge ? `<div class="donate-page-badge">${plan.badge}</div>` : "";
        
        let amountHtml = "";
        if (plan.amount === "custom") {
          amountHtml = `
            <div class="donate-page-plan-amount">
              <input type="number" class="donate-page-custom-input" placeholder="輸入金額" min="100">
            </div>
          `;
        } else {
          amountHtml = `
            <div class="donate-page-plan-amount">
              <span class="donate-page-currency">NT$</span>
              <span>${plan.amount}</span>
              <span class="donate-page-unit">${unitText}</span>
            </div>
          `;
        }

        return `
          <div class="donate-page-plan-card ${isFeatured}">
            ${badgeHtml}
            <div class="donate-page-plan-header">
              <h3 class="donate-page-plan-title">${plan.title}</h3>
              ${amountHtml}
            </div>
            <p class="donate-page-plan-desc">${plan.description}</p>
            <button type="button" class="btn btn-primary donate-page-plan-btn" onclick="alert('感謝您的支持！將跳轉至授權金流服務頁面。')">
              立即捐款 <span class="btn-arrow">→</span>
            </button>
          </div>
        `;
      }).join("");
    }

    renderPlans();

    // 切換單筆 / 定期定額按鈕監聽
    const typeBtns = document.querySelectorAll(".donate-page-type-btn");
    typeBtns.forEach(btn => {
      btn.addEventListener("click", function () {
        typeBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentType = this.getAttribute("data-type");
        renderPlans();
      });
    });

    // 渲染捐款管道
    document.getElementById("donate-methods-title").textContent = donateData.methodsTitle || "多元捐款管道";
    const methodsList = document.getElementById("donate-methods-list");
    if (methodsList && donateData.methods) {
      methodsList.innerHTML = donateData.methods.map(method => `
        <div class="donate-page-method-item">
          <div class="donate-page-method-icon">${method.icon}</div>
          <div class="donate-page-method-text">
            <h4>${method.name}</h4>
            <p>${method.detail}</p>
          </div>
        </div>
      `).join("");
    }

    // 渲染抵稅說明
    document.getElementById("donate-tax-title").textContent = donateData.taxTitle || "捐款收據與抵稅說明";
    const taxContent = document.getElementById("donate-tax-content");
    if (taxContent && donateData.taxContent) {
      taxContent.innerHTML = donateData.taxContent.map(text => `
        <div class="donate-page-tax-item">${text}</div>
      `).join("");
    }
  }

});