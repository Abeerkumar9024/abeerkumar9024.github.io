(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.querySelector('#site-nav');
  const menuToggle = document.querySelector('.menu-toggle');

  // Small-screen navigation: open/close predictably and close after selection.
  if (nav && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', isOpen);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  // Reveal content as it enters view; content remains visible when observers are unavailable.
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Typewriter text is deliberately short, clear, and professional.
  function typewriter(element, phrases, options = {}) {
    if (!element || !phrases.length) return;
    if (reducedMotion) {
      element.textContent = phrases[0];
      return;
    }
    const typeSpeed = options.typeSpeed ?? 55;
    const eraseSpeed = options.eraseSpeed ?? 28;
    const pause = options.pause ?? 1650;
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = false;
    element.textContent = phrases[0];
    const step = () => {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex += 1;
        element.textContent = phrase.slice(0, charIndex);
        if (charIndex >= phrase.length) {
          deleting = true;
          window.setTimeout(step, pause);
          return;
        }
        window.setTimeout(step, typeSpeed);
      } else {
        charIndex -= 1;
        element.textContent = phrase.slice(0, Math.max(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(step, 230);
          return;
        }
        window.setTimeout(step, eraseSpeed);
      }
    };
    window.setTimeout(() => {
      deleting = true;
      step();
    }, options.initialDelay ?? 1800);
  }

  typewriter(document.querySelector('#hero-typewriter'), [
    'hands-on technology learner',
    'AI and IoT explorer',
    'automation-minded problem solver',
    'builder of practical prototypes',
    'technology-to-value thinker'
  ], { initialDelay: 1700, pause: 1400, typeSpeed: 48, eraseSpeed: 25 });

  typewriter(document.querySelector('#about-typewriter'), [
    'problem-first thinker',
    'curious experimenter',
    'careful systems learner',
    'practical technology builder'
  ], { initialDelay: 900, pause: 1800, typeSpeed: 63, eraseSpeed: 30 });

  // Project filters.
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
  const filterEmpty = document.querySelector('#filter-empty');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      let visibleCount = 0;
      projectCards.forEach((card) => {
        const show = selected === 'all' || card.dataset.category === selected;
        card.hidden = !show;
        if (show) visibleCount += 1;
      });
      if (filterEmpty) filterEmpty.hidden = visibleCount > 0;
    });
  });

  const projectDetails = {
    surveillance: {
      number: 'PROJECT 01 / AI & COMPUTER VISION',
      title: 'Smart Surveillance System',
      lede: 'A human-aware surveillance concept designed to save video when an event is worth reviewing, instead of relying on continuous recording alone.',
      context: 'Continuous recording can generate long periods of footage that contain little useful activity. The project explores a recording workflow that recognises relevant activity and makes the resulting clips easier to review.',
      approach: 'The laptop prototype uses Python and OpenCV with a MobileNetSSD detection workflow to identify people in a camera feed. Event logic can start a clip when a person is detected, attach a timestamp to the recording, and wait briefly after detections stop before ending the clip. That short buffer helps avoid splitting a single visit into several tiny clips.',
      learning: 'The work has highlighted that camera input, detection confidence, recording state, event logs and notifications need to be treated as one system. A detector is only useful when the surrounding workflow behaves predictably.',
      next: 'Further exploration includes improving false-positive handling, making recordings easy to retrieve, and investigating local, edge-friendly deployment on compact hardware. These are development goals rather than claims of a finished commercial system.',
      stack: ['Python', 'OpenCV', 'MobileNetSSD workflow', 'Timestamped recording', 'Event logic']
    },
    orbital: {
      number: 'PROJECT 02 / SALESFORCE & DATA',
      title: 'Real-Time Orbital Telemetry Dashboard',
      lede: 'A Salesforce application concept that turns satellite position responses into structured information and an interface people can explore.',
      context: 'Satellite data is more useful when a user can quickly understand the current position, compare it with their own location and review recent readings without repeatedly interpreting raw API responses.',
      approach: 'The project combines Salesforce Aura components with Apex HTTP callouts to retrieve external REST data related to satellites such as the ISS and Hubble. JavaScript polling refreshes the view; HTML5 geolocation and the Haversine formula support user-to-satellite distance calculations. Telemetry can be stored in Salesforce custom objects for structured reporting and future analytics.',
      learning: 'This work helped connect several layers of an application: a component interface, server-side integration, external data, location-aware calculations and a record model. It also made API reliability and data structure part of the design conversation.',
      next: 'Possible next steps include clearer loading and error states, historical comparisons, better validation of incoming records and more informative dashboards. Predictive analytics remains a future direction, not a current performance claim.',
      stack: ['Salesforce Aura', 'Apex', 'REST APIs', 'JavaScript polling', 'HTML5 Geolocation', 'Haversine formula']
    },
    'home-automation': {
      number: 'PROJECT 03 / IOT & EMBEDDED SYSTEMS',
      title: 'Wi-Fi Home Automation',
      lede: 'An IoT exploration using a NodeMCU ESP8266 to understand remote control, device state and the relationship between firmware and a user interface.',
      context: 'Home automation is a useful learning ground for connected systems: the user needs a clear way to request an action, the device needs to receive it, and the interface should communicate the resulting state.',
      approach: 'The project explores ESP8266 network connectivity and control logic for remotely operating devices through a simple interface. It supports learning about microcontroller firmware, Wi-Fi communication and the path from a user action to an embedded-device response.',
      learning: 'The hands-on value is in debugging the entire loop: connection, command handling, output control and visible feedback. A device should also behave sensibly when connectivity is lost or input is unclear.',
      next: 'Further work could focus on clearer connection status, recoverable failures and a more deliberate interface. Any real mains-powered installation requires properly rated components, isolation and qualified supervision; a low-voltage prototype should be treated separately from household wiring.',
      stack: ['NodeMCU ESP8266', 'Arduino IDE', 'Wi-Fi', 'Embedded control logic', 'Web UI concepts']
    },
    'apps-script': {
      number: 'PROJECT 04 / WORKFLOW AUTOMATION',
      title: 'Google Apps Script Automation',
      lede: 'A continuing effort to streamline repetitive tasks and make data-handling workflows more consistent.',
      context: 'Repeated manual steps can be slow and easy to overlook. A small automation can help when the process is predictable, the input is understood and the outcome can be checked.',
      approach: 'The work explores Google Apps Script for moving information, processing data and organising repeatable task execution. The emphasis is on creating a clear sequence, reducing unnecessary handoffs and leaving the process understandable to the person who may need to maintain it.',
      learning: 'Automation design is more than making a script run once. Useful workflows need predictable inputs, understandable outputs, error handling and a way to confirm that the intended action happened.',
      next: 'The next stage is to document specific workflows, add sensible validation and make results easier to audit. I aim to focus on repeatable tasks where reducing manual effort has a practical benefit.',
      stack: ['Google Apps Script', 'Workflow logic', 'Data transfer', 'Task execution', 'Validation concepts']
    },
    printer: {
      number: 'PROJECT 05 / APPLIED MACHINE LEARNING',
      title: '3D Printer Material Prediction',
      lede: 'A dataset-based machine-learning exercise exploring whether project and printing requirements can help guide material selection.',
      context: 'Choosing a 3D-printing material involves trade-offs. The project explores how structured information can be used to organise those choices and produce a recommendation to investigate.',
      approach: 'The work applies a foundational machine-learning workflow to a dataset: understand the available features, prepare data for analysis, explore patterns and evaluate model outputs. The intended use is to recommend suitable material options based on project requirements.',
      learning: 'This project reinforced the importance of the data behind a model. Predictions are only as useful as the definitions, examples and assumptions used to create them, and they should be checked against real-world needs.',
      next: 'A strong next step would be to document the dataset, define an appropriate evaluation method, report measured performance and clearly communicate uncertainty. No accuracy figure is presented here because a verified metric was not provided in the source material.',
      stack: ['Python', 'Dataset analysis', 'Machine-learning workflow', 'Prediction concepts', 'Evaluation thinking']
    }
  };

  const dialog = document.querySelector('#project-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const closeDialogButton = document.querySelector('#dialog-close');
  function openProject(key) {
    const project = projectDetails[key];
    if (!project || !dialog || !dialogContent) return;
    const detailList = [
      ['The problem', project.context],
      ['Approach', project.approach],
      ['What I learned', project.learning],
      ['Next steps', project.next]
    ];
    dialogContent.innerHTML = `
      <p class="dialog-kicker">${project.number}</p>
      <h2 id="dialog-title">${project.title}</h2>
      <p class="dialog-lede">${project.lede}</p>
      <div class="dialog-detail-grid">${detailList.map(([heading, text]) => `<article class="dialog-detail"><h3>${heading}</h3><p>${text}</p></article>`).join('')}</div>
      <h3 class="dialog-kicker">TOOLS & CONCEPTS EXPLORED</h3>
      <div class="dialog-tech">${project.stack.map((item) => `<span>${item}</span>`).join('')}</div>
    `;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('dialog-open');
    if (closeDialogButton) closeDialogButton.focus({ preventScroll: true });
  }
  function closeProjectDialog() {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    document.body.classList.remove('dialog-open');
  }
  document.querySelectorAll('[data-open-project]').forEach((button) => {
    button.addEventListener('click', () => openProject(button.dataset.openProject));
  });
  if (closeDialogButton) closeDialogButton.addEventListener('click', closeProjectDialog);
  if (dialog) {
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeProjectDialog();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog && dialog.open) closeProjectDialog();
  });

  // Resume selector highlights the relevant version and updates its context.
  const resumeModes = [...document.querySelectorAll('[data-resume-mode]')];
  const resumeCards = [...document.querySelectorAll('[data-resume-card]')];
  const resumeGuidance = document.querySelector('#resume-guidance');
  const resumeDescriptions = {
    tech: 'Best suited to AI, IoT, Salesforce, automation, software and other technology-focused opportunities.',
    nontech: 'Best suited to business development, customer-facing roles, sales, coordination and business operations.'
  };
  resumeModes.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.resumeMode;
      resumeModes.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-selected', active);
        item.setAttribute('aria-pressed', String(active));
      });
      resumeCards.forEach((card) => card.classList.toggle('is-highlighted', card.dataset.resumeCard === selected));
      if (resumeGuidance) resumeGuidance.textContent = resumeDescriptions[selected];
      const card = resumeCards.find((item) => item.dataset.resumeCard === selected);
      if (card && window.matchMedia('(max-width: 760px)').matches) card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  });

  // A rotating workbench note adds a tiny interactive moment without adding dependencies.
  const notes = [
    'What could you simplify if you observed the problem for one more day?',
    'Could a clearer signal, a smaller script or a better explanation remove a step?',
    'What would the smallest useful prototype look like?',
    'How will you know that the next version is genuinely better?',
    'What does the person using the solution need to understand first?',
    'A good experiment should teach you something even when the first attempt fails.'
  ];
  let noteIndex = 0;
  const note = document.querySelector('#lab-note');
  const noteButton = document.querySelector('#new-note');
  if (note && noteButton) {
    noteButton.addEventListener('click', () => {
      noteIndex = (noteIndex + 1) % notes.length;
      note.style.opacity = '0';
      window.setTimeout(() => {
        note.textContent = notes[noteIndex];
        note.style.opacity = '1';
      }, reducedMotion ? 0 : 140);
    });
  }

  // Copy-to-clipboard with a fallback for local file previews and older browsers.
  const copyEmail = document.querySelector('#copy-email');
  const copyStatus = document.querySelector('#copy-status');
  const toast = document.querySelector('#toast');
  let toastTimer;
  function announce(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }
  if (copyEmail) {
    copyEmail.addEventListener('click', async () => {
      const email = copyEmail.dataset.copy || 'abeerprofessional60@gmail.com';
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const temp = document.createElement('textarea');
          temp.value = email;
          temp.setAttribute('readonly', '');
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          const copied = document.execCommand('copy');
          temp.remove();
          if (!copied) throw new Error('Clipboard fallback failed');
        }
        if (copyStatus) copyStatus.textContent = 'Email address copied to the clipboard.';
        announce('Email address copied');
      } catch (error) {
        if (copyStatus) copyStatus.textContent = `Email: ${email}`;
        announce('You can copy the email address from the text above.');
      }
    });
  }

  // Chapter navigation: swipe right to move forward; swipe left to go back.
  const chapterIds = ['top', 'work', 'about', 'toolkit', 'journey', 'certifications', 'resumes', 'contact'];
  const chapterLabels = {
    top: 'INTRO / ABEER KUMAR',
    work: '01 / SELECTED WORK',
    about: '02 / THE PERSON BEHIND THE PROJECTS',
    toolkit: '03 / THE TOOLKIT',
    journey: '04 / THE JOURNEY SO FAR',
    certifications: '05 / TRAINING & CERTIFICATIONS',
    resumes: '06 / RESUME VERSIONS',
    contact: '07 / LET’S CONNECT'
  };
  const chapters = chapterIds.map((id) => document.getElementById(id)).filter(Boolean);
  const chapterCurrent = document.querySelector('#chapter-current');
  const progressFill = document.querySelector('#dock-progress-fill');
  const chapterDock = document.querySelector('.chapter-dock');
  const prevButton = document.querySelector('#chapter-prev');
  const nextButton = document.querySelector('#chapter-next');
  let activeChapterIndex = 0;
  let scrollTicking = false;

  function setActiveChapter(id) {
    const foundIndex = chapterIds.indexOf(id);
    if (foundIndex < 0) return;
    activeChapterIndex = foundIndex;
    if (chapterCurrent) chapterCurrent.textContent = chapterLabels[id] || 'PORTFOLIO';
    if (progressFill) progressFill.style.width = `${(foundIndex / Math.max(1, chapterIds.length - 1)) * 100}%`;
    if (prevButton) prevButton.disabled = foundIndex <= 0;
    if (nextButton) nextButton.disabled = foundIndex >= chapterIds.length - 1;
    if (chapterDock) chapterDock.classList.toggle('is-hidden', foundIndex === 0 && window.scrollY < 140);
    document.querySelectorAll('.site-nav a[href^="#"]').forEach((link) => {
      const targetId = link.getAttribute('href').slice(1);
      if (targetId === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scrollToChapter(index) {
    const boundedIndex = Math.max(0, Math.min(chapterIds.length - 1, index));
    const target = document.getElementById(chapterIds[boundedIndex]);
    if (!target) return;
    activeChapterIndex = boundedIndex;
    setActiveChapter(chapterIds[boundedIndex]);
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
  if (prevButton) prevButton.addEventListener('click', () => scrollToChapter(activeChapterIndex - 1));
  if (nextButton) nextButton.addEventListener('click', () => scrollToChapter(activeChapterIndex + 1));

  // Derive the active chapter from a reading line in the viewport. This is more
  // reliable than intersection ratios for long sections on small phone screens.
  function updateActiveFromScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      const anchorY = window.scrollY + Math.min(window.innerHeight * 0.34, 280);
      let active = chapters[0];
      chapters.forEach((chapter) => {
        const top = chapter.getBoundingClientRect().top + window.scrollY;
        if (top <= anchorY + 1) active = chapter;
      });
      if (active) setActiveChapter(active.id);
      scrollTicking = false;
    });
  }
  window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
  window.addEventListener('resize', updateActiveFromScroll, { passive: true });
  window.addEventListener('pageshow', updateActiveFromScroll, { passive: true });
  setActiveChapter('top');
  if (chapterDock && window.scrollY < 140) chapterDock.classList.add('is-hidden');

  let touchStart = null;
  document.addEventListener('touchstart', (event) => {
    if (!event.touches || event.touches.length !== 1) { touchStart = null; return; }
    const target = event.target;
    if (target && target.closest('a, button, input, textarea, select, dialog, [data-no-swipe]')) { touchStart = null; return; }
    const touch = event.touches[0];
    touchStart = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (!touchStart || !event.changedTouches || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    const elapsed = Date.now() - touchStart.time;
    touchStart = null;
    if (dialog && dialog.open) return;
    if (Math.abs(dx) < 76 || Math.abs(dx) < Math.abs(dy) * 1.28 || elapsed > 900) return;
    // Requested interaction: swipe right advances from chapter 01 to chapter 02.
    if (dx > 0) scrollToChapter(activeChapterIndex + 1);
    else scrollToChapter(activeChapterIndex - 1);
  }, { passive: true });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
