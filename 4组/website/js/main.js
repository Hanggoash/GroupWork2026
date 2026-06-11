/* ===== Liangma River Website - Main JavaScript ===== */
(function() {
  'use strict';

  // ===== DOM Elements =====
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const backToTop = document.getElementById('backToTop');
  const heroCarousel = document.getElementById('heroCarousel');
  const carouselDots = document.getElementById('carouselDots');
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const ecologyTabs = document.getElementById('ecologyTabs');
  const galleryFilter = document.getElementById('galleryFilter');
  const galleryGrid = document.getElementById('galleryGrid');

  // ===== Navbar Scroll Effect =====
  let lastScroll = 0;
  function handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar shadow
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNavLink();

    lastScroll = scrollY;
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], .hero[id]');
    const links = navLinks.querySelectorAll('a');
    let current = '';

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Also check stats-bar for overview
    const overview = document.getElementById('overview');
    if (overview && window.scrollY >= overview.offsetTop - 100 && window.scrollY < overview.offsetTop + overview.offsetHeight) {
      current = 'overview';
    }

    links.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    // Home is special since hero doesn't have section tag
    if (!current && window.scrollY < 300) {
      links.forEach(function(link) {
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
    }
  }

  // ===== Mobile Nav Toggle =====
  navToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ===== Hero Carousel =====
  let currentSlide = 0;
  const slides = heroCarousel.querySelectorAll('.slide');
  const dots = carouselDots.querySelectorAll('button');
  let carouselInterval;

  function showSlide(index) {
    slides.forEach(function(slide, i) {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000);
  }

  function stopCarousel() {
    clearInterval(carouselInterval);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      stopCarousel();
      showSlide(parseInt(this.getAttribute('data-index')));
      startCarousel();
    });
  });

  // Pause on hover
  heroCarousel.addEventListener('mouseenter', stopCarousel);
  heroCarousel.addEventListener('mouseleave', startCarousel);

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  heroCarousel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    stopCarousel();
  }, {passive: true});

  heroCarousel.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showSlide((currentSlide + 1) % slides.length);
      } else {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
      }
    }
    startCarousel();
  });

  if (slides.length > 1) {
    startCarousel();
  }

  // ===== Stats Counter Animation =====
  function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(function(stat) {
      const target = parseFloat(stat.getAttribute('data-count'));
      const isDecimal = stat.getAttribute('data-count').includes('.');
      let current = 0;
      const duration = 1500;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let step = 0;

      const timer = setInterval(function() {
        step++;
        current += increment;
        if (step >= steps) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
      }, stepTime);
    });
  }

  // Use IntersectionObserver for stats
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
  }

  // ===== Ecology Tabs =====
  if (ecologyTabs) {
    ecologyTabs.addEventListener('click', function(e) {
      const tab = e.target.closest('.ecology-tab');
      if (!tab) return;

      // Update active tab
      ecologyTabs.querySelectorAll('.ecology-tab').forEach(function(t) {
        t.classList.remove('active');
      });
      tab.classList.add('active');

      // Show content
      const tabName = tab.getAttribute('data-tab');
      document.querySelectorAll('.ecology-content').forEach(function(content) {
        content.classList.remove('active');
      });
      const targetContent = document.getElementById('tab-' + tabName);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  }

  // ===== Gallery Filter =====
  if (galleryFilter) {
    galleryFilter.addEventListener('click', function(e) {
      const btn = e.target.closest('.gallery-filter-btn');
      if (!btn) return;

      // Update active button
      galleryFilter.querySelectorAll('.gallery-filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Filter items
      const filter = btn.getAttribute('data-filter');
      const items = galleryGrid.querySelectorAll('.gallery-item');
      
      items.forEach(function(item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
          item.style.animation = 'fadeInUp 0.3s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // ===== Gallery Click to Lightbox =====
  if (galleryGrid) {
    galleryGrid.addEventListener('click', function(e) {
      const item = e.target.closest('.gallery-item');
      if (!item) return;
      const img = item.querySelector('img[data-full]');
      if (img) {
        openLightbox(img.getAttribute('data-full'), item.querySelector('.gallery-caption').textContent);
      }
    });
  }

  // ===== Lightbox =====
  let lightboxImages = [];
  let lightboxIndex = 0;

  window.openLightbox = function(src, caption) {
    lightboxImages = Array.from(document.querySelectorAll('.ba-card img, .ecology-gallery img[onclick], .gallery-item img[data-full]'))
      .map(function(img) {
        return {
          src: img.getAttribute('data-full') || img.src,
          caption: img.closest('.ba-card') 
            ? img.closest('.ba-card').querySelector('.ba-title').textContent 
            : (img.closest('.gallery-item') 
              ? img.closest('.gallery-item').querySelector('.gallery-caption').textContent 
              : img.alt || '')
        };
      });

    // Remove duplicates
    lightboxImages = lightboxImages.filter(function(item, index, self) {
      return index === self.findIndex(function(t) { return t.src === item.src; });
    });

    lightboxIndex = lightboxImages.findIndex(function(item) { return item.src === src; });
    if (lightboxIndex === -1) lightboxIndex = 0;

    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function updateLightbox() {
    const img = lightboxImages[lightboxIndex];
    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.caption;
      lightboxCaption.textContent = img.caption;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function prevLightbox() {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  }

  function nextLightbox() {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightbox();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevLightbox);
  lightboxNext.addEventListener('click', nextLightbox);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
  });

  // ===== Search Functionality =====
  const searchData = [
    { title: '关于项目', desc: '亮马河国际风情水岸项目背景、目标与建设理念', href: '#about' },
    { title: '水质改善', desc: '亮马河河道水质清澈，水面洁净无漂浮垃圾，达到亲水标准', href: '#ecology' },
    { title: '绿化建设', desc: '两岸多层次绿化体系，超过35种植物，绿化覆盖率80%', href: '#ecology' },
    { title: '生态修复', desc: '生态驳岸建设，河道从排水功能向复合生态空间转变', href: '#ecology' },
    { title: '生物多样性', desc: '植被丰富为城市小动物提供栖息空间，人与自然和谐共生', href: '#ecology' },
    { title: '同机位今昔对比', desc: '治理前后对比，直观展示亮马河的华丽蜕变', href: '#achievements' },
    { title: '滨水步道', desc: '连续宽敞的慢行空间，满足散步、跑步、骑行等需求', href: '#achievements' },
    { title: '公共服务设施', desc: 'AED急救站、公共座椅、导览标识、无障碍设施等', href: '#achievements' },
    { title: '问题与建议', desc: '现场观察发现的问题记录与改进建议汇总', href: '#issues' },
    { title: '安全隐患', desc: '垂钓者与游泳者同域活动风险、救生值守不足等问题', href: '#issues' },
    { title: '无障碍设施', desc: '亲水步道无障碍坡道坡度大、路线不连续等问题', href: '#issues' },
    { title: '环卫工作', desc: '环卫设施维护、垃圾分类与日常保洁', href: '#issues' },
    { title: '便民服务', desc: '售卖机矿泉水价格偏高、平价饮水服务不足', href: '#issues' },
    { title: '公共厕所问题', desc: '厕所数量不足、指示牌不明显，每天至少10人询问', href: '#issues' },
    { title: '生态宣传', desc: '生态文明主题展板不明显，治理历程展示不足', href: '#issues' },
    { title: '未来规划', desc: '客流管理、生态科普、商业平衡、智慧水岸建设等', href: '#future' },
    { title: '安全保障', desc: '安全提示、救生设施、AED急救站等安全管理措施', href: '#achievements' },
    { title: '无障碍设施', desc: '无障碍坡道、盲道等无障碍通行设施建设', href: '#future' },
    { title: '环卫工作', desc: '垃圾分类、清洁维护等环卫设施保障滨水空间整洁', href: '#achievements' },
    { title: '燕莎码头', desc: '码头服务建筑与标识清晰，具备旅游接待与水上交通功能', href: '#culture' },
    { title: '生态文明', desc: '亮马河践行"人与自然和谐共生"的生态文明理念', href: '#about' },
    { title: '文商旅融合', desc: '以水为媒，文旅融合 — 生态优势转化为消费场景', href: '#culture' },
    { title: '采访记录', desc: '周边居民与工作人员的实地采访，不同群体对亮马河的真实感受', href: '#interviews' },
    { title: '青年居民', desc: '刚毕业青年来亮马河散步散心，缓解工作压力', href: '#interviews' },
    { title: '长期居民反馈', desc: '居住40年老大爷和60年老大妈见证亮马河从小河沟变大河的全过程', href: '#interviews' },
    { title: '公共服务设施', desc: '多位受访者反映公共厕所不足、导览标识不清晰等问题', href: '#interviews' },
    { title: '一线工作人员', desc: '每天至少10人询问厕所位置，公共服务配套需要优化', href: '#interviews' },
    { title: '水上项目体验', desc: '划船教练认为亮马河从能看到能体验的转变是最大亮点', href: '#interviews' },
    { title: '城市客厅', desc: '亮马河成为全龄友好的市民共享公共空间', href: '#about' }
  ];

  searchBtn.addEventListener('click', function() {
    searchModal.classList.add('active');
    setTimeout(function() { searchInput.focus(); }, 100);
  });

  searchModal.addEventListener('click', function(e) {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && !lightbox.classList.contains('active') && document.activeElement === document.body) {
      e.preventDefault();
      searchModal.classList.add('active');
      setTimeout(function() { searchInput.focus(); }, 100);
    }
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  searchInput.addEventListener('input', function() {
    const query = this.value.trim().toLowerCase();
    if (query.length === 0) {
      searchResults.innerHTML = '';
      return;
    }

    const results = searchData.filter(function(item) {
      return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<p style="text-align:center;color:var(--color-text-light);padding:20px;">未找到相关内容，请尝试其他关键词</p>';
      return;
    }

    searchResults.innerHTML = results.map(function(item) {
      const title = item.title.replace(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<span class="search-highlight">$1</span>');
      const desc = item.desc.replace(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<span class="search-highlight">$1</span>');
      return '<a href="' + item.href + '" class="search-result-item" onclick="document.getElementById(\'searchModal\').classList.remove(\'active\');document.getElementById(\'searchInput\').value=\'\';document.getElementById(\'searchResults\').innerHTML=\'\';">' +
        '<h4>' + title + '</h4>' +
        '<p>' + desc + '</p>' +
        '</a>';
    }).join('');
  });

  // ===== Back to Top =====
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Smooth Scroll for all anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== Reveal on Scroll Animation =====
  const revealElements = document.querySelectorAll('.overview-card, .culture-card, .future-card, .ba-card, .interview-card, .issue-card');
  
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  // ===== Lazy Load Images =====
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
      img.src = img.getAttribute('src') || '';
    });
  } else {
    // Fallback IntersectionObserver lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      if (!img.src && img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }

  // ===== Init =====
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call

  // ===== Keyboard Accessibility =====
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

})();
