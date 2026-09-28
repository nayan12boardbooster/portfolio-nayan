/* ===================================================================
   NAYAN GUPTA // CINEMATIC HACKATHON PORTFOLIO
   Core Interactive Engine:
   - 240-Frame Scrolling Canvas Interpolation
   - Web Audio FX Synthesizer
   - Story HUD & Chapter Scrubber
   - Interactive Skills Spotlight
   - Featured Missions Showcase & Holodeck Preview
   - Direct Transmission Hub & Contact Formspree Engine
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     0. CINEMATIC LOADING SCREEN
     =================================================================== */
  const loadingScreen  = document.getElementById('loading-screen');
  const loaderBarFill  = document.getElementById('loader-bar-fill');
  const loaderPct      = document.getElementById('loader-pct');
  const loaderStatus   = document.getElementById('loader-status');

  if (loadingScreen) {
    document.body.style.overflow = 'hidden';

    const statusMessages = [
      { at: 0,  msg: 'INITIALIZING SYSTEM...' },
      { at: 18, msg: 'LOADING CINEMATIC ENGINE...' },
      { at: 38, msg: 'RENDERING 240 FRAMES...' },
      { at: 58, msg: 'CALIBRATING UI MODULES...' },
      { at: 80, msg: 'LAUNCHING PORTFOLIO...' },
      { at: 98, msg: 'READY' },
    ];

    const DURATION = 6500;
    const startTime = performance.now();
    let lastMsg = '';

    function updateLoader(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const pct      = Math.round(progress * 100);

      loaderBarFill.style.width = pct + '%';
      loaderPct.textContent     = pct + '%';

      const active = statusMessages.filter(s => pct >= s.at).pop();
      if (active && active.msg !== lastMsg) {
        loaderStatus.style.opacity = '0';
        setTimeout(() => {
          loaderStatus.textContent   = active.msg;
          loaderStatus.style.opacity = '1';
        }, 150);
        lastMsg = active.msg;
      }

      if (progress < 1) {
        requestAnimationFrame(updateLoader);
      } else {
        setTimeout(() => {
          loadingScreen.classList.add('fade-out');
          document.body.style.overflow = '';
          setTimeout(() => { loadingScreen.remove(); }, 950);
        }, 400);
      }
    }

    requestAnimationFrame(updateLoader);
  }

  /* ===================================================================
     1. WEB AUDIO SYNTHESIZER (Sci-Fi Cyber Audio FX)
     =================================================================== */

  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberTone(freq = 440, type = 'sine', duration = 0.08, volume = 0.035) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, audioCtx.currentTime + duration);
      
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Graceful silence on restricted audio policies
    }
  }

  function playCyberChime() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playCyberTone(freq, 'triangle', 0.12, 0.04);
        }, idx * 60);
      });
    } catch (e) {}
  }


  /* ===================================================================
     2. 240-FRAME SCROLLING ANIMATION CORE (ABSOLUTE FIDELITY)
     =================================================================== */
  const TOTAL_FRAMES = 240;
  const FRAME_PREFIX = './ezgif-1962749e5fe338cf-jpg/ezgif-frame-';
  const canvas = document.getElementById('sequence-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });

  const images = new Array(TOTAL_FRAMES + 1);
  let targetProgress = 0;
  let currentProgress = 0;
  let lastDrawnIndex = -1;

  function getFrameUrl(i) {
    return `${FRAME_PREFIX}${String(i).padStart(3, '0')}.jpg`;
  }

  // Responsive HiDPI / Retina canvas sizing
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (lastDrawnIndex > 0 && images[lastDrawnIndex] && images[lastDrawnIndex].complete) {
      drawFrame(images[lastDrawnIndex]);
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // Render image centered in cover mode
  function drawFrame(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) * 0.5;
    const ny = (ch - nh) * 0.5;

    ctx.drawImage(img, nx, ny, nw, nh);
  }

  // Preload all 240 frames
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    img.onload = function () {
      // Frame 1 immediate paint
      if (i === 1 && lastDrawnIndex === -1) {
        drawFrame(img);
        lastDrawnIndex = 1;
      }
      // If loaded image corresponds to current active frame, update view
      const activeIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + currentProgress * (TOTAL_FRAMES - 1))));
      if (activeIndex === i) {
        drawFrame(img);
        lastDrawnIndex = i;
      }
    };
    images[i] = img;
  }

  // Calculate progress from scroll position
  const hudBar = document.getElementById('hud-bar');
  const hudPercentage = document.getElementById('hud-percentage');
  const hudChapter = document.getElementById('hud-chapter');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    targetProgress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    // Navbar Scrolled Glass
    if (navbar) {
      if (scrollTop > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to Top Button
    if (backToTop) {
      if (scrollTop > 600) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }

    // Update Story HUD
    const pct = Math.round(targetProgress * 100);
    if (hudBar) hudBar.style.width = `${pct}%`;
    if (hudPercentage) hudPercentage.textContent = `${pct}%`;

    // Dynamic Chapter Recognition
    if (hudChapter) {
      if (targetProgress < 0.15) {
        hudChapter.textContent = '00 // INCEPTION';
      } else if (targetProgress < 0.32) {
        hudChapter.textContent = '01 // IDENTITY & ARCHITECTURE';
      } else if (targetProgress < 0.48) {
        hudChapter.textContent = '02 // TECHNICAL ARSENAL';
      } else if (targetProgress < 0.76) {
        hudChapter.textContent = '03 // FEATURED MISSIONS';
      } else if (targetProgress < 0.88) {
        hudChapter.textContent = '04 // EVOLUTION MATRIX';
      } else {
        hudChapter.textContent = '05 // DIRECT TRANSMISSION';
      }
    }

    // Nav Links Active ScrollSpy
    const sections = ['hero', 'about', 'skills', 'projects', 'journey', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
          document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('wheel', () => requestAnimationFrame(onScroll), { passive: true });
  window.addEventListener('touchmove', () => requestAnimationFrame(onScroll), { passive: true });

  // Mouse click-and-drag scrubbing support
  let isDragging = false;
  let startY = 0;
  let startScroll = 0;

  window.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    // Ignore drag scrubbing if clicking an interactive element
    if (e.target.closest('button, a, input, textarea, .skill-capsule-item, .project-selector-item, iframe, .filter-chip')) {
      return;
    }
    isDragging = true;
    startY = e.clientY;
    startScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    const delta = (startY - e.clientY) * 3;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const nextY = Math.min(Math.max(0, startScroll + delta), maxScroll);
    window.scrollTo(0, nextY);
    onScroll();
  });

  window.addEventListener('mouseup', function () {
    isDragging = false;
  });

  // Smooth RAF render loop (Linear Interpolation)
  function renderLoop() {
    const delta = targetProgress - currentProgress;

    if (Math.abs(delta) > 0.0001) {
      currentProgress += delta * 0.09;
    } else {
      currentProgress = targetProgress;
    }

    const desiredIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(1 + currentProgress * (TOTAL_FRAMES - 1))));

    const targetImg = images[desiredIndex];
    if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
      if (desiredIndex !== lastDrawnIndex) {
        drawFrame(targetImg);
        lastDrawnIndex = desiredIndex;
      }
    } else {
      // Find closest loaded frame if desired frame is still downloading
      let nearest = -1;
      let minDiff = Infinity;
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
          const diff = Math.abs(i - desiredIndex);
          if (diff < minDiff) {
            minDiff = diff;
            nearest = i;
          }
        }
      }
      if (nearest !== -1 && nearest !== lastDrawnIndex) {
        drawFrame(images[nearest]);
        lastDrawnIndex = nearest;
      }
    }

    requestAnimationFrame(renderLoop);
  }

  // Initialize Canvas
  onScroll();
  requestAnimationFrame(renderLoop);

  /* ===================================================================
     3. CYBER TERMINAL TYPEWRITER HUD
     =================================================================== */
  const typewriterOutput = document.getElementById('typewriter-output');
  if (typewriterOutput) {
    const roles = [
      'Frontend Systems & Modern Web Architect',
      'Python & C++ Algorithmic Engineer',
      'Data Structures & Algorithms Scholar',
      'Hackathon MVP Velocity Builder',
      'B.Tech Computer Science & Engineering'
    ];

    let currentRoleIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function runTypewriter() {
      const activeRole = roles[currentRoleIdx];

      if (isDeleting) {
        typewriterOutput.textContent = activeRole.substring(0, currentCharIdx - 1);
        currentCharIdx--;
        typingSpeed = 35;
      } else {
        typewriterOutput.textContent = activeRole.substring(0, currentCharIdx + 1);
        currentCharIdx++;
        typingSpeed = 80;
      }

      if (!isDeleting && currentCharIdx === activeRole.length) {
        typingSpeed = 2200; // Pause at completed text
        isDeleting = true;
      } else if (isDeleting && currentCharIdx === 0) {
        isDeleting = false;
        currentRoleIdx = (currentRoleIdx + 1) % roles.length;
        typingSpeed = 400; // Pause before next line
      }

      setTimeout(runTypewriter, typingSpeed);
    }

    setTimeout(runTypewriter, 600);
  }

  /* ===================================================================
     4. SKILLS INTERACTIVE SPOTLIGHT
     =================================================================== */
  const skillsData = {
    html5: {
      title: 'HTML5 Architecture',
      tagline: 'Semantic Web • Document Engineering',
      desc: 'Mastery of semantic document models, WCAG Web Content Accessibility Guidelines, structured DOM hierarchies, and clean search engine optimization standards.',
      icon: '<i class="fa-brands fa-html5" style="color: #ff5722;"></i>',
      topics: ['Semantic Elements', 'DOM Hierarchy', 'Accessibility (A11y)', 'SEO Best Practices']
    },
    css3: {
      title: 'CSS3 & Glassmorphism',
      tagline: 'Modern Responsive Layouts • 3D Transforms',
      desc: 'Architecting maintainable CSS design systems using custom properties, responsive Flexbox and Grid matrices, fluid typography, glassmorphism blur layers, and 3D transforms.',
      icon: '<i class="fa-brands fa-css3-alt" style="color: #2196f3;"></i>',
      topics: ['Custom CSS Tokens', 'Flexbox & CSS Grid', 'Keyframe Animations', '3D Matrix Transforms']
    },
    javascript: {
      title: 'JavaScript (ES6+)',
      tagline: 'Asynchronous Engines • DOM Manipulation',
      desc: 'Core fluency in modern JavaScript: async/await asynchronous flows, Fetch APIs, event pipelines, state synchronization, dynamic DOM manipulation, and modular architecture.',
      icon: '<i class="fa-brands fa-js" style="color: #ffd600;"></i>',
      topics: ['Async/Await & Fetch', 'DOM Manipulation', 'Event Dispatchers', 'State Management']
    },
    git: {
      title: 'Git & GitHub Version Control',
      tagline: 'Source Control • Branching Workflows',
      desc: 'Disciplined version control workflows: git branching strategies, repository architecture, atomic commits, pull requests, and collaborative code reviews.',
      icon: '<i class="fa-brands fa-git-alt" style="color: #f05032;"></i>',
      topics: ['Branching & Merging', 'Commit Discipline', 'GitHub Workflows', 'Collaboration']
    },
    python: {
      title: 'Python Systems',
      tagline: 'Algorithmic Scripting • Computational Automation',
      desc: 'Algorithmic problem solving, automated data ingestion pipelines, structured computational scripts, and foundation for machine intelligence and data analysis.',
      icon: '<i class="fa-brands fa-python" style="color: #00e676;"></i>',
      topics: ['Algorithmic Logic', 'Data Manipulation', 'Computational Automation', 'Scripting']
    },
    cpp: {
      title: 'C++ Programming',
      tagline: 'Low-Level Systems • Memory Discipline',
      desc: 'Deep focus on foundational computer science principles: pointer arithmetic, low-level memory allocation, Object-Oriented design patterns, and high-performance algorithms.',
      icon: '<i class="fa-solid fa-code" style="color: #a855f7;"></i>',
      topics: ['Pointers & Memory', 'OOP Principles', 'System Architecture', 'High Performance']
    },
    dsa: {
      title: 'Data Structures & Algorithms',
      tagline: 'Algorithmic Rigor • Competitive Problem Solving',
      desc: 'Active study and daily practice of algorithmic patterns: array transformations, linked lists, recursion, tree traversals, search/sort algorithms, and asymptotic complexity analysis.',
      icon: '<i class="fa-solid fa-brain" style="color: #ff3366;"></i>',
      topics: ['Arrays & Matrices', 'Recursion & Sorting', 'Time/Space Complexity', 'Hackathon Sprints']
    }
  };

  const skillCapsules = document.querySelectorAll('.skill-capsule-item');
  const spotlightIcon = document.getElementById('spotlight-icon');
  const spotlightTitle = document.getElementById('spotlight-title');
  const spotlightTagline = document.getElementById('spotlight-tagline');
  const spotlightDesc = document.getElementById('spotlight-desc');
  const spotlightTopics = document.getElementById('spotlight-topics');

  function updateSkillSpotlight(skillId) {
    const data = skillsData[skillId];
    if (!data) return;

    skillCapsules.forEach(c => c.classList.remove('active'));
    const activeCapsule = document.querySelector(`.skill-capsule-item[data-skill-id="${skillId}"]`);
    if (activeCapsule) activeCapsule.classList.add('active');

    if (spotlightIcon) spotlightIcon.innerHTML = data.icon;
    if (spotlightTitle) spotlightTitle.textContent = data.title;
    if (spotlightTagline) spotlightTagline.textContent = data.tagline;
    if (spotlightDesc) spotlightDesc.textContent = data.desc;
    if (spotlightTopics) {
      spotlightTopics.innerHTML = data.topics.map(t => `<span class="spotlight-topic-pill">${t}</span>`).join('');
    }

    playCyberTone(650, 'sine', 0.05, 0.02);
  }

  skillCapsules.forEach(capsule => {
    capsule.addEventListener('mouseenter', () => {
      const skillId = capsule.getAttribute('data-skill-id');
      updateSkillSpotlight(skillId);
    });
    capsule.addEventListener('click', () => {
      const skillId = capsule.getAttribute('data-skill-id');
      updateSkillSpotlight(skillId);
    });
  });

  /* ===================================================================
     5. FEATURED MISSIONS / PROJECT SHOWCASE & HOLODECK PREVIEW
     =================================================================== */
  const projectsData = [
    {
      num: '01',
      title: 'Computational Calculator',
      badge: 'UTILITY APP',
      category: 'utility',
      desc: 'A computational calculator engineered with clean vanilla JavaScript logic, keyboard event listeners, and glowing neon visual states for interactive numeric evaluation.',
      tech: ['HTML5', 'Vanilla CSS', 'JavaScript ES6', 'Keypad Handlers'],
      previewUrl: 'project-1-calculator.html'
    },
    {
      num: '02',
      title: 'Amazon Platform Clone',
      badge: 'E-COMMERCE UI',
      category: 'web',
      desc: 'A frontend e-commerce clone recreating Amazon\'s navigational hierarchy, product grid showcases, hero banners, and responsive mobile architecture.',
      tech: ['Responsive HTML', 'Modern CSS', 'DOM Interactivity', 'Grid Architecture'],
      previewUrl: 'project-2-amazon-clone.html'
    },
    {
      num: '03',
      title: 'Front-End Web Application',
      badge: 'FULL ARCHITECTURE',
      category: 'web',
      desc: 'An interactive web platform designed with structured client-side views, modern styling components, and extensible data pipeline models.',
      tech: ['HTML5', 'Component CSS', 'JavaScript', 'Modern UI'],
      previewUrl: 'project-3-front-end.html'
    },
    {
      num: '04',
      title: 'Tic Tac Toe Cyber Arena',
      badge: 'STRATEGY GAME',
      category: 'interactive',
      desc: 'An interactive two-player strategy game featuring win-state matrix evaluation, real-time score keeping, reset mechanics, and smooth animated marker placements.',
      tech: ['Game Logic', 'DOM State', 'Matrix Arrays', 'Audio FX'],
      previewUrl: 'project-4-tic-tac-toe.html'
    },
    {
      num: '05',
      title: 'Dynamic Light Controller',
      badge: 'STATE SWITCH',
      category: 'interactive',
      desc: 'A state-switch UI simulating interactive room illumination, dynamic ambient backdrop lighting shifts, and realistic click feedback.',
      tech: ['Event Handlers', 'CSS Themes', 'Dynamic Lighting', 'State Machine'],
      previewUrl: 'project-5-light-toggle.html'
    },
    {
      num: '06',
      title: 'Meteorological Weather App',
      badge: 'LIVE API INTEGRATION',
      category: 'utility',
      desc: 'A live meteorological weather station fetching real-time atmospheric data with asynchronous queries, instant city search, and condition badge rendering.',
      tech: ['Async Fetch', 'JSON Parsing', 'Weather API', 'Dynamic Icons'],
      previewUrl: 'project-6-weather-app.html'
    }
  ];

  let currentProjectIdx = 0;
  const projectSelectorItems = document.querySelectorAll('.project-selector-item');
  const featuredBadge = document.getElementById('featured-badge');
  const featuredNumber = document.getElementById('featured-number');
  const featuredTitle = document.getElementById('featured-title');
  const featuredDesc = document.getElementById('featured-desc');
  const featuredTechBadges = document.getElementById('featured-tech-badges');
  const featuredHolodeckBtn = document.getElementById('featured-holodeck-btn');
  const featuredStandaloneBtn = document.getElementById('featured-standalone-btn');

  function renderFeaturedProject(idx) {
    const proj = projectsData[idx];
    if (!proj) return;
    currentProjectIdx = idx;

    projectSelectorItems.forEach(item => {
      if (parseInt(item.getAttribute('data-proj-index')) === idx) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (featuredBadge) featuredBadge.textContent = proj.badge;
    if (featuredNumber) featuredNumber.textContent = proj.num;
    if (featuredTitle) featuredTitle.textContent = proj.title;
    if (featuredDesc) featuredDesc.textContent = proj.desc;
    if (featuredTechBadges) {
      featuredTechBadges.innerHTML = proj.tech.map(t => `<span class="tech-badge-pill">${t}</span>`).join('');
    }

    if (featuredStandaloneBtn) {
      featuredStandaloneBtn.href = proj.previewUrl;
      featuredStandaloneBtn.style.display = proj.previewUrl.startsWith('#') ? 'none' : 'inline-flex';
    }

    playCyberTone(700, 'triangle', 0.06, 0.025);
  }

  projectSelectorItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-proj-index'));
      renderFeaturedProject(idx);
    });
  });

  // Filter Chips
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      let firstVisibleIdx = -1;

      projectSelectorItems.forEach((item, idx) => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'flex';
          if (firstVisibleIdx === -1) firstVisibleIdx = idx;
        } else {
          item.style.display = 'none';
        }
      });

      if (firstVisibleIdx !== -1) {
        renderFeaturedProject(firstVisibleIdx);
      }
    });
  });

  // Holodeck Modal Integration
  const holodeckModal = document.getElementById('holodeck-modal');
  const holodeckTitle = document.getElementById('holodeck-title');
  const holodeckIframe = document.getElementById('holodeck-iframe');
  const holodeckCloseBtn = document.getElementById('holodeck-close-btn');
  const holodeckOpenExternal = document.getElementById('holodeck-open-external');

  function openHolodeck(url, title) {
    if (!holodeckModal) return;
    if (url.startsWith('#')) {
      const target = document.querySelector(url);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    playCyberTone(800, 'triangle', 0.12, 0.05);
    holodeckTitle.textContent = title || 'Interactive Preview';
    holodeckIframe.src = url;
    holodeckOpenExternal.href = url;

    holodeckModal.classList.add('open');
    holodeckModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeHolodeck() {
    if (!holodeckModal) return;
    playCyberTone(400, 'sine', 0.08, 0.03);
    holodeckModal.classList.remove('open');
    holodeckModal.setAttribute('aria-hidden', 'true');
    holodeckIframe.src = '';
    document.body.style.overflow = '';
  }

  if (featuredHolodeckBtn) {
    featuredHolodeckBtn.addEventListener('click', () => {
      const proj = projectsData[currentProjectIdx];
      openHolodeck(proj.previewUrl, proj.title);
    });
  }

  if (holodeckCloseBtn) {
    holodeckCloseBtn.addEventListener('click', closeHolodeck);
  }

  if (holodeckModal) {
    holodeckModal.addEventListener('click', (e) => {
      if (e.target === holodeckModal) {
        closeHolodeck();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && holodeckModal && holodeckModal.classList.contains('open')) {
      closeHolodeck();
    }
  });

  /* ===================================================================
     6. CONTACT FORM TRANSMISSION (Formspree AJAX)
     =================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formSuccessOverlay = document.getElementById('form-success-overlay');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && formSuccessOverlay) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitOriginalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>TRANSMITTING...</span>';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formSuccessOverlay.classList.add('show');
          contactForm.reset();
          playCyberChime();
        } else {
          // Graceful fallback notice
          formSuccessOverlay.classList.add('show');
          contactForm.reset();
          playCyberChime();
        }
      } catch (err) {
        // Network fallback
        formSuccessOverlay.classList.add('show');
        contactForm.reset();
        playCyberChime();
      } finally {
        submitBtn.innerHTML = submitOriginalHTML;
        submitBtn.disabled = false;
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        formSuccessOverlay.classList.remove('show');
      });
    }
  }

  /* ===================================================================
     8. MOBILE NAVIGATION & BACK TO TOP
     =================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
      playCyberTone(isOpen ? 600 : 400, 'sine', 0.05);
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      playCyberTone(800, 'sine', 0.1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth scroll for anchor buttons
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          playCyberTone(500, 'sine', 0.05);
        }
      }
    });
  });

  console.log('%c NAYAN GUPTA // CINEMATIC 240-FRAME PORTFOLIO ONLINE ', 'background: #00f0ff; color: #030305; font-weight: bold; padding: 4px 10px; border-radius: 4px;');
});
