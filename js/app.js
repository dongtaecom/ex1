// Andong Foreign Tourist Companion Application Logic with EN/KO i18n

document.addEventListener('DOMContentLoaded', () => {
  // State
  let activeTab = 'attractions';
  let activeFilter = 'all';
  let searchQuery = '';
  let currentLang = localStorage.getItem('andong_lang') || 'en';
  let customItinerary = JSON.parse(localStorage.getItem('andong_itinerary') || '[]');

  // Initializations
  initLanguageToggle();
  initNavigation();
  initSearchAndFilter();
  renderAll();
  initQuiz();

  // Language Switching Handler
  function initLanguageToggle() {
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ko' : 'en';
        localStorage.setItem('andong_lang', currentLang);
        applyLanguage();
        renderAll();
      });
    }
    applyLanguage();
  }

  function applyLanguage() {
    const dict = ANDONG_DATA.i18n[currentLang] || ANDONG_DATA.i18n.en;
    
    // Header & Logo
    const logoText = document.getElementById('site-logo-text');
    if (logoText) logoText.innerHTML = currentLang === 'ko' ? '안동 <span style="font-weight: 300;">가이드</span>' : 'ANDONG <span style="font-weight: 300;">GUIDE</span>';

    // Toggle button text
    const langBtnText = document.getElementById('lang-toggle-text');
    if (langBtnText) langBtnText.textContent = currentLang === 'en' ? '한국어' : 'English';

    // Tabs
    const tabAttractionSpan = document.querySelector('#tab-btn-attractions span');
    if (tabAttractionSpan) tabAttractionSpan.textContent = dict.tabAttractions;

    const tabFoodSpan = document.querySelector('#tab-btn-food span');
    if (tabFoodSpan) tabFoodSpan.textContent = dict.tabFood;

    const tabItinerarySpan = document.querySelector('#tab-btn-itinerary span');
    if (tabItinerarySpan) tabItinerarySpan.textContent = dict.tabItinerary;

    const tabPhrasesSpan = document.querySelector('#tab-btn-phrases span');
    if (tabPhrasesSpan) tabPhrasesSpan.textContent = dict.tabPhrases;

    const tabTransportSpan = document.querySelector('#tab-btn-transport span');
    if (tabTransportSpan) tabTransportSpan.textContent = dict.tabTransport;

    const tabQuizSpan = document.querySelector('#tab-btn-quiz span');
    if (tabQuizSpan) tabQuizSpan.textContent = dict.tabQuiz;

    // Hero Section
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.textContent = dict.heroTitle;

    const heroDesc = document.getElementById('hero-desc');
    if (heroDesc) heroDesc.textContent = dict.heroDesc;

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = dict.searchPlaceholder;

    const searchBtnText = document.getElementById('search-btn-text');
    if (searchBtnText) searchBtnText.textContent = dict.searchBtn;

    // Filter Pills
    document.getElementById('pill-all').textContent = dict.filterAll;
    document.getElementById('pill-heritage').textContent = dict.filterHeritage;
    document.getElementById('pill-night').textContent = dict.filterNight;
    document.getElementById('pill-kdrama').textContent = dict.filterKdrama;
    document.getElementById('pill-nature').textContent = dict.filterNature;

    // Titles
    document.getElementById('attractions-title').textContent = dict.attractionsTitle;
    document.getElementById('attractions-sub').textContent = dict.attractionsSub;

    document.getElementById('cuisine-title').textContent = dict.cuisineTitle;
    document.getElementById('cuisine-sub').textContent = dict.cuisineSub;

    document.getElementById('itinerary-preset-title').innerHTML = `<i class="fas fa-map-marked-alt" style="color:var(--primary-gold);"></i> ${dict.itineraryPresetTitle}`;
    document.getElementById('itinerary-custom-title').innerHTML = `<i class="fas fa-bookmark" style="color:var(--accent-cyan);"></i> ${dict.itineraryCustomTitle}`;
    document.getElementById('itinerary-empty-title').textContent = dict.itineraryEmptyTitle;
    document.getElementById('itinerary-empty-sub').textContent = dict.itineraryEmptySub;

    document.getElementById('taxi-banner-title').innerHTML = `<i class="fas fa-taxi"></i> ${dict.taxiBannerTitle}`;
    document.getElementById('taxi-banner-sub').textContent = dict.taxiBannerSub;
    document.getElementById('phrases-title').textContent = dict.phrasesTitle;

    document.getElementById('transport-title').innerHTML = `<i class="fas fa-bus-alt" style="color:var(--accent-cyan);"></i> ${dict.transportTitle}`;
    document.getElementById('transport-sub').textContent = dict.transportSub;

    document.getElementById('quiz-title').textContent = dict.quizTitle;
    document.getElementById('quiz-sub').textContent = dict.quizSub;

    document.getElementById('footer-text').textContent = dict.footerText;
  }

  function renderAll() {
    renderAttractions();
    renderFoods();
    renderItineraries();
    renderPhrases();
    renderTransportGuide();
    renderCustomItinerary();
  }

  // Navigation Logic
  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (!tab) return;

        navButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`tab-${tab}`).classList.add('active');
        activeTab = tab;
      });
    });
  }

  // Filter & Search Logic
  function initSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterPills = document.querySelectorAll('.pill-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderAttractions();
        renderFoods();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        renderAttractions();
        renderFoods();
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter') || 'all';
        renderAttractions();
      });
    });
  }

  // Render Attractions Cards
  function renderAttractions() {
    const container = document.getElementById('attractions-grid');
    if (!container) return;
    const dict = ANDONG_DATA.i18n[currentLang];

    let items = ANDONG_DATA.attractions;

    if (activeFilter !== 'all') {
      items = items.filter(item => item.category === activeFilter || item.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase()));
    }

    if (searchQuery) {
      items = items.filter(item => {
        const name = currentLang === 'ko' ? item.nameKo : item.name;
        const desc = currentLang === 'ko' ? item.shortDescKo : item.shortDesc;
        return name.toLowerCase().includes(searchQuery) ||
               desc.toLowerCase().includes(searchQuery) ||
               item.koreanName.includes(searchQuery);
      });
    }

    if (items.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--text-muted);">
        <i class="fas fa-search" style="font-size: 2.5rem; margin-bottom: 1rem; opacity:0.5;"></i>
        <p>No attractions found matching "${searchQuery}".</p>
      </div>`;
      return;
    }

    container.innerHTML = items.map(item => {
      const displayName = currentLang === 'ko' ? item.nameKo : item.name;
      const displayDesc = currentLang === 'ko' ? item.shortDescKo : item.shortDesc;

      return `
        <div class="card" data-id="${item.id}">
          <div class="card-img-wrap">
            <img src="${item.image}" alt="${displayName}" loading="lazy" />
            <span class="card-tag">${item.tags[0]}</span>
          </div>
          <div class="card-body">
            <div class="card-title-row">
              <h3 class="card-title">${displayName}</h3>
            </div>
            <div class="card-korean">${item.koreanName}</div>
            <p class="card-desc">${displayDesc}</p>
            <div class="card-footer">
              <div class="rating"><i class="fas fa-star"></i> ${item.rating} (${item.reviewsCount})</div>
              <div style="display:flex; gap:0.5rem;">
                <button class="btn-add-itinerary" onclick="window.addToItinerary('${item.id}')" title="Add to Itinerary">
                  <i class="fas fa-plus"></i> ${dict.btnPlan}
                </button>
                <button class="btn-detail" onclick="window.openDetailModal('${item.id}')">${dict.btnDetails}</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Foods Cards
  function renderFoods() {
    const container = document.getElementById('foods-grid');
    if (!container) return;
    const dict = ANDONG_DATA.i18n[currentLang];

    let items = ANDONG_DATA.foods;

    if (searchQuery) {
      items = items.filter(item => {
        const name = currentLang === 'ko' ? item.nameKo : item.name;
        const desc = currentLang === 'ko' ? item.descKo : item.desc;
        return name.toLowerCase().includes(searchQuery) || desc.toLowerCase().includes(searchQuery);
      });
    }

    container.innerHTML = items.map(food => {
      const displayName = currentLang === 'ko' ? food.nameKo : food.name;
      const displayDesc = currentLang === 'ko' ? food.descKo : food.desc;
      const displaySpicy = currentLang === 'ko' ? food.spicinessKo : food.spiciness;
      const displayWhere = currentLang === 'ko' ? food.whereToEatKo : food.whereToEat;
      const displayPrice = currentLang === 'ko' ? food.avgPriceKo : food.avgPrice;
      const displayTips = currentLang === 'ko' ? food.tipsKo : food.tips;

      return `
        <div class="card">
          <div class="card-img-wrap">
            <img src="${food.image}" alt="${displayName}" loading="lazy" />
            <span class="card-tag" style="color:var(--accent-cyan); border-color:rgba(56,189,248,0.3);">${displaySpicy}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${displayName}</h3>
            <div class="card-korean">${food.koreanName}</div>
            <p class="card-desc">${displayDesc}</p>
            <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom: 0.8rem;">
              <div><i class="fas fa-utensils" style="color:var(--primary-gold); margin-right:5px;"></i> <strong>${dict.whereToEatLabel}</strong> ${displayWhere}</div>
              <div><i class="fas fa-tag" style="color:var(--accent-emerald); margin-right:5px;"></i> <strong>${dict.priceLabel}</strong> ${displayPrice}</div>
            </div>
            <div class="card-footer" style="padding-top:0.8rem;">
              <span style="font-size:0.8rem; color:var(--text-muted);"><i class="fas fa-lightbulb" style="color:var(--primary-gold);"></i> ${displayTips}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Pre-set Itineraries
  function renderItineraries() {
    const container = document.getElementById('preset-itineraries');
    if (!container) return;

    container.innerHTML = ANDONG_DATA.itineraries.map(plan => {
      const displayTitle = currentLang === 'ko' ? plan.titleKo : plan.title;
      const displayTag = currentLang === 'ko' ? plan.tagKo : plan.tag;
      const displayDuration = currentLang === 'ko' ? plan.durationKo : plan.duration;
      const displayHighlights = currentLang === 'ko' ? plan.highlightsKo : plan.highlights;

      return `
        <div style="background: var(--bg-card); border:1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
            <div>
              <h3 style="font-size:1.3rem; color:var(--text-main);">${displayTitle}</h3>
              <span style="color:var(--primary-gold); font-size:0.85rem; font-weight:600;"><i class="far fa-clock"></i> ${displayDuration} • ${displayTag}</span>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom: 1.2rem;">
            ${displayHighlights.map(h => `<span style="background:rgba(255,255,255,0.06); padding:0.3rem 0.7rem; border-radius:50px; font-size:0.8rem; color:var(--accent-cyan);">${h}</span>`).join('')}
          </div>
          <div style="display:flex; flex-direction:column; gap:0.8rem; border-left: 2px dashed var(--primary-gold); padding-left: 1.2rem; margin-left: 0.5rem;">
            ${plan.schedule.map(step => `
              <div>
                <span style="font-size:0.85rem; font-weight:700; color:var(--primary-gold);">${step.time}</span>
                <h4 style="font-size:1rem; color:var(--text-main); margin:2px 0;">${currentLang === 'ko' ? step.titleKo : step.title}</h4>
                <p style="font-size:0.85rem; color:var(--text-muted);">${currentLang === 'ko' ? step.detailKo : step.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Phrases
  function renderPhrases() {
    const container = document.getElementById('phrases-grid');
    if (!container) return;

    container.innerHTML = ANDONG_DATA.phrases.map((phrase) => `
      <div class="phrase-card">
        <div class="phrase-text">
          <div class="phrase-eng">${phrase.english}</div>
          <div class="phrase-kr">${phrase.hangeul}</div>
          <div class="phrase-rom">${phrase.romanized}</div>
        </div>
        <button class="btn-audio" onclick="window.speakKorean('${phrase.audioText.replace(/'/g, "\\'")}')" title="Listen Audio">
          <i class="fas fa-volume-up"></i>
        </button>
      </div>
    `).join('');
  }

  // Render Transport Guide
  function renderTransportGuide() {
    const container = document.getElementById('transport-guide-container');
    if (!container) return;

    container.innerHTML = ANDONG_DATA.transportGuide.map(guide => `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.2rem; margin-bottom:1rem;">
        <h4 style="font-size:1.1rem; color:var(--accent-cyan); margin-bottom:0.4rem;">
          <i class="fas fa-directions" style="margin-right:8px;"></i>${currentLang === 'ko' ? guide.titleKo : guide.title}
        </h4>
        <p style="color:var(--text-muted); font-size:0.95rem;">${currentLang === 'ko' ? guide.detailsKo : guide.details}</p>
      </div>
    `).join('');
  }

  // Custom Itinerary Handler
  window.addToItinerary = function(attractionId) {
    const attr = ANDONG_DATA.attractions.find(a => a.id === attractionId);
    if (!attr) return;

    if (customItinerary.some(item => item.id === attractionId)) {
      alert(currentLang === 'ko' ? `${attr.nameKo}는 이미 일정에 추가되어 있습니다!` : `${attr.name} is already in your itinerary plan!`);
      return;
    }

    customItinerary.push(attr);
    localStorage.setItem('andong_itinerary', JSON.stringify(customItinerary));
    renderCustomItinerary();

    alert(currentLang === 'ko' ? `"${attr.nameKo}"를 내 일정에 추가했습니다!` : `Added "${attr.name}" to your Custom Trip Plan!`);
  };

  window.removeFromItinerary = function(attractionId) {
    customItinerary = customItinerary.filter(item => item.id !== attractionId);
    localStorage.setItem('andong_itinerary', JSON.stringify(customItinerary));
    renderCustomItinerary();
  };

  function renderCustomItinerary() {
    const container = document.getElementById('custom-itinerary-list');
    const emptyState = document.getElementById('itinerary-empty-state');
    if (!container) return;

    if (customItinerary.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      container.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = customItinerary.map((item, index) => {
      const displayName = currentLang === 'ko' ? item.nameKo : item.name;
      const displayLoc = currentLang === 'ko' ? item.locationKo : item.location;

      return `
        <div class="itinerary-item">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="background:var(--primary-gold); color:#000; font-weight:800; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.85rem;">
              ${index + 1}
            </div>
            <div class="itinerary-item-info">
              <h4>${displayName} (${item.koreanName})</h4>
              <p><i class="fas fa-map-marker-alt" style="color:var(--accent-rose);"></i> ${displayLoc}</p>
            </div>
          </div>
          <button class="btn-remove-item" onclick="window.removeFromItinerary('${item.id}')" title="Remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  // Speech Synthesis
  window.speakKorean = function(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech audio is not supported in this browser.");
    }
  };

  // Detail Modal
  window.openDetailModal = function(id) {
    const item = ANDONG_DATA.attractions.find(a => a.id === id);
    if (!item) return;

    const dict = ANDONG_DATA.i18n[currentLang];
    const modalOverlay = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body-content');

    const displayName = currentLang === 'ko' ? item.nameKo : item.name;
    const displayDesc = currentLang === 'ko' ? item.fullDescKo : item.fullDesc;
    const displayLoc = currentLang === 'ko' ? item.locationKo : item.location;
    const displayHours = currentLang === 'ko' ? item.hoursKo : item.hours;
    const displayFee = currentLang === 'ko' ? item.feeKo : item.fee;
    const displayTransport = currentLang === 'ko' ? item.transportKo : item.transport;

    modalBody.innerHTML = `
      <button class="modal-close" onclick="window.closeModal()">&times;</button>
      <img src="${item.image}" alt="${displayName}" class="modal-hero-img" />
      <div class="modal-content">
        <h2 class="modal-title">${displayName}</h2>
        <div class="modal-korean">${item.koreanName}</div>

        <div class="modal-info-row"><i class="fas fa-map-marker-alt"></i> <span><strong>${dict.addressLabel}</strong> ${displayLoc}</span></div>
        <div class="modal-info-row"><i class="far fa-clock"></i> <span><strong>${dict.hoursLabel}</strong> ${displayHours}</span></div>
        <div class="modal-info-row"><i class="fas fa-ticket-alt"></i> <span><strong>${dict.feeLabel}</strong> ${displayFee}</span></div>
        <div class="modal-info-row"><i class="fas fa-bus"></i> <span><strong>${dict.transportLabel}</strong> ${displayTransport}</span></div>

        <p style="margin: 1.2rem 0; color: var(--text-main); font-size:0.95rem; line-height:1.7;">${displayDesc}</p>

        <!-- Driver Taxi Card -->
        <div class="taxi-card-display">
          <h4><i class="fas fa-taxi"></i> ${dict.showTaxiTitle}</h4>
          <p>${item.taxiCardNote}</p>
          <div style="font-size:0.8rem; color:#854d0e; margin-top:4px;">${dict.addressLabel} ${item.koreanAddress}</div>
        </div>

        <div style="margin-top:1.5rem; display:flex; gap:1rem;">
          <button class="btn-add-itinerary" style="flex:1; padding:0.8rem;" onclick="window.addToItinerary('${item.id}'); window.closeModal();">
            <i class="fas fa-plus"></i> ${dict.btnAddPlan}
          </button>
          <button class="btn-detail" style="flex:1;" onclick="window.speakKorean('${item.koreanName.replace(/'/g, "\\'")}')">
            <i class="fas fa-volume-up"></i> ${dict.btnPronounce}
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
  };

  window.closeModal = function() {
    const modalOverlay = document.getElementById('detail-modal');
    modalOverlay.classList.remove('active');
  };

  // Travel Quiz Logic
  function initQuiz() {
    const quizContainer = document.getElementById('quiz-box');
    if (!quizContainer) return;

    let currentStep = 0;
    const answers = [];

    const getQuestions = () => [
      {
        question: currentLang === 'ko' ? "여행할 때 가장 중요하게 생각하는 것은?" : "What is your main priority when traveling?",
        options: [
          { text: currentLang === 'ko' ? "유네스코 세계유산 & 고즈넉한 전통 한옥" : "Exploring UNESCO historic heritage & traditional architecture", type: "heritage" },
          { text: currentLang === 'ko' ? "안동 대표 맛집 & 전통 음식 맛보기" : "Tasting local authentic food & delicacies", type: "food" },
          { text: currentLang === 'ko' ? "인생샷 남길 수 있는 아름다운 포토존" : "Capturing scenic instagrammable photo spots", type: "photo" },
          { text: currentLang === 'ko' ? "조용한 자연 속 힐링과 강변 공원 산책" : "Relaxing in quiet nature & river parks", type: "nature" }
        ]
      },
      {
        question: currentLang === 'ko' ? "안동에서 체류 일정은 얼마인가요?" : "How long is your stay in Andong?",
        options: [
          { text: currentLang === 'ko' ? "당일치기 (~8시간)" : "Quick day trip (~6-8 hours)", type: "short" },
          { text: currentLang === 'ko' ? "1박 2일 일정" : "Overnight stay (2 Days 1 Night)", type: "medium" },
          { text: currentLang === 'ko' ? "여유로운 2박 3일 이상" : "Relaxed 3+ days stay", type: "long" }
        ]
      }
    ];

    window.renderQuizStep = function() {
      const questions = getQuestions();
      if (currentStep >= questions.length) {
        const topType = answers[0] || 'heritage';
        let recName = currentLang === 'ko' ? "하회마을 & 병산서원" : "Hahoe Folk Village & Byeongsan Seowon";
        if (topType === 'food') recName = currentLang === 'ko' ? "안동 찜닭골목 & 일직식당 간고등어" : "Andong Jjimdak Street & Iljik Salted Mackerel";
        if (topType === 'photo') recName = currentLang === 'ko' ? "월영교 야경 & 만휴정 외나무다리" : "Wollyeonggyo Moonlight Bridge & Manhyujeong Pavilion";
        if (topType === 'nature') recName = currentLang === 'ko' ? "낙강물길공원 & 도산서원" : "Nakgang Water Garden & Dosan Seowon";

        quizContainer.innerHTML = `
          <h3 style="color:var(--primary-gold); font-size:1.5rem; margin-bottom:0.5rem;"><i class="fas fa-award"></i> ${currentLang === 'ko' ? "당신의 안동 여행 취향 결과!" : "Your Andong Travel Style Match!"}</h3>
          <p style="color:var(--text-main); font-size:1.1rem; margin: 1rem 0;">${currentLang === 'ko' ? "추천 여행지:" : "We recommend focusing on:"} <strong>${recName}</strong></p>
          <button class="search-box button" style="margin-top:1rem;" onclick="location.reload()">${currentLang === 'ko' ? "퀴즈 다시 하기" : "Take Quiz Again"}</button>
        `;
        return;
      }

      const q = questions[currentStep];
      quizContainer.innerHTML = `
        <h3 style="font-size:1.2rem; color:var(--text-main); margin-bottom:1rem;">${q.question}</h3>
        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt-btn" onclick="window.selectQuizOption('${opt.type}')">
              ${i+1}. ${opt.text}
            </button>
          `).join('')}
        </div>
      `;
    };

    window.selectQuizOption = function(type) {
      answers.push(type);
      currentStep++;
      window.renderQuizStep();
    };

    window.renderQuizStep();
  }
});
