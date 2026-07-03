document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. Custom Pixel Cursor
     ========================================== */
  const cursor = document.getElementById('cursor');
  
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });

    document.addEventListener('mousedown', () => {
      cursor.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
    });

    // Add hover states to all links and interactive elements
    const hoverables = document.querySelectorAll('a, .sticker, .keycap, button, [role="button"], input, textarea');
    hoverables.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      elem.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }

  /* ==========================================
     2. Live Kanyakumari Clock
     ========================================== */
  const timeDisplay = document.getElementById('live-time');
  
  function updateTime() {
    if (!timeDisplay) return;
    
    const now = new Date();
    // Get UTC time
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    // India is IST (UTC+5:30)
    const offset = 5.5; 
    const kanyakumariTime = new Date(utc + (3600000 * offset));
    
    const hours = String(kanyakumariTime.getHours()).padStart(2, '0');
    const minutes = String(kanyakumariTime.getMinutes()).padStart(2, '0');
    const seconds = String(kanyakumariTime.getSeconds()).padStart(2, '0');
    
    timeDisplay.textContent = `KANYAKUMARI, IN / ${hours}:${minutes}:${seconds}`;
  }
  
  setInterval(updateTime, 1000);
  updateTime();

  /* ==========================================
     3. Interactive / Draggable Stickers (Mouse & Touch)
     ========================================== */
  const stickers = document.querySelectorAll('.sticker');
  
  stickers.forEach(sticker => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Mouse Event Handlers
    sticker.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      sticker.style.zIndex = 10;
    });
    
    // Touch Event Handlers for Mobile Responsiveness
    sticker.addEventListener('touchstart', (e) => {
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX - currentX;
      startY = touch.clientY - currentY;
      sticker.style.zIndex = 10;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      sticker.style.transform = `translate(${currentX}px, ${currentY}px) rotate(var(--rot, 0deg))`;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      currentX = touch.clientX - startX;
      currentY = touch.clientY - startY;
      sticker.style.transform = `translate(${currentX}px, ${currentY}px) rotate(var(--rot, 0deg))`;
    });
    
    const endDrag = () => {
      if (isDragging) {
        isDragging = false;
        sticker.style.zIndex = 5;
      }
    };
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  });

  /* ==========================================
     4. Keyboard Navigation (Physical Keypress)
     ========================================== */
  const keyMap = {
    'Escape': { selector: '#key-home', target: '#hero' },
    'KeyG': { selector: '#key-github', target: 'https://github.com/JeshikoJ', external: true },
    'KeyI': { selector: '#key-linkedin', target: 'https://linkedin.com/in/JeshikoJ', external: true },
    'KeyE': { selector: '#key-email', target: 'mailto:chandranjeshiko@gmail.com', external: true },
    'KeyH': { selector: '#key-hire', target: '#contact' },
    'KeyX': { selector: '#key-x', target: 'https://linkedin.com/in/JeshikoJ', external: true },
    'KeyC': { selector: '#key-call', target: 'tel:+917395881571', external: true },
    'KeyD': { selector: '#key-dribbble', target: '#work' },
    'KeyB': { selector: '#key-behance', target: '#about' }
  };

  document.addEventListener('keydown', (e) => {
    // If typing in the contact form, do not trigger global keyboard nav shortcuts!
    const activeElem = document.activeElement;
    if (activeElem && (activeElem.tagName === 'INPUT' || activeElem.tagName === 'TEXTAREA')) {
      return;
    }

    const keyConfig = keyMap[e.code];
    if (keyConfig) {
      const keyElement = document.querySelector(keyConfig.selector);
      if (keyElement) {
        if (!keyConfig.external) {
          e.preventDefault();
        }
        
        keyElement.classList.add('pressed');
        
        if (keyConfig.external) {
          if (keyConfig.target.startsWith('mailto:') || keyConfig.target.startsWith('tel:')) {
            window.location.href = keyConfig.target;
          } else {
            window.open(keyConfig.target, '_blank');
          }
        } else {
          const targetSection = document.querySelector(keyConfig.target);
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    const keyConfig = keyMap[e.code];
    if (keyConfig) {
      const keyElement = document.querySelector(keyConfig.selector);
      if (keyElement) {
        keyElement.classList.remove('pressed');
      }
    }
  });

  // Tactile visual feedback on clicking keycaps
  const keycaps = document.querySelectorAll('.keycap');
  keycaps.forEach(key => {
    const handlePress = () => {
      key.classList.add('pressed');
      setTimeout(() => {
        key.classList.remove('pressed');
      }, 150);
    };
    key.addEventListener('click', handlePress);
    key.addEventListener('touchstart', handlePress);
  });

  /* ==========================================
     5. Scrollspy Navigation Sync (Side Nav & Keyboard Keys)
     ========================================== */
  const sections = document.querySelectorAll('section');
  const navKeys = {
    'hero': '#key-home',
    'work': '#key-dribbble',
    'about': '#key-behance',
    'contact': '#key-hire'
  };

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        
        // Update Console highlight
        document.querySelectorAll('.keycap').forEach(key => {
          key.classList.remove('active-nav');
        });
        const activeKeySelector = navKeys[activeId];
        if (activeKeySelector) {
          const activeKey = document.querySelector(activeKeySelector);
          if (activeKey) {
            activeKey.classList.add('active-nav');
          }
        }

        // Update Side Nav highlight
        document.querySelectorAll('.side-nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  /* ==========================================
     6. Project Detail Modal View
     ========================================== */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalTags = document.getElementById('modal-tags');
  const modalDesc = document.getElementById('modal-desc');
  const modalBullets = document.getElementById('modal-bullets');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const projectCards = document.querySelectorAll('.work-card');

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault(); // Stop hash scrolling
      
      const title = card.getAttribute('data-title');
      const tags = card.getAttribute('data-tags').split(',');
      const imgPath = card.getAttribute('data-img');
      const desc = card.getAttribute('data-desc');
      const bullets = card.getAttribute('data-bullets').split(';');

      // Populate Modal Fields
      modalImg.src = imgPath;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;

      // Populate tags
      modalTags.innerHTML = '';
      tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = tag.trim();
        modalTags.appendChild(tagSpan);
      });

      // Populate bullets
      modalBullets.innerHTML = '';
      bullets.forEach(bullet => {
        if (bullet.trim()) {
          const li = document.createElement('li');
          li.textContent = bullet.trim();
          modalBullets.appendChild(li);
        }
      });

      // Open Modal
      modalOverlay.classList.add('active');
      cursor.classList.remove('hover'); // reset cursor state
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      // Close only if clicked on dark backdrop, not on modal contents
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Close modal on Esc press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================
     7. Retro Terminal Contact Form
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const formLogs = document.getElementById('form-logs');

  if (contactForm && formLogs) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('form-name').value;
      const emailVal = document.getElementById('form-email').value;
      const messageVal = document.getElementById('form-message').value;

      // Disable inputs during simulation
      const inputs = contactForm.querySelectorAll('input, textarea, button');
      inputs.forEach(input => input.disabled = true);

      // Clear logs and print simulated shell outputs
      formLogs.innerHTML = '';

      const logLines = [
        { text: '> visitor@guest:~$ ./submit_message.sh', type: '' },
        { text: '> Initializing SMTP handshake with mail.jeshiko.dev [port 587]...', type: 'log-info', delay: 400 },
        { text: '> DNS: Resolving mailserver MX records... Done.', type: 'log-info', delay: 800 },
        { text: `> Sender validation check for: "${nameVal}" <${emailVal}>... Pass.`, type: '', delay: 1200 },
        { text: '> Encrypting message packet payload (AES-256)... Done.', type: 'log-info', delay: 1600 },
        { text: '> [SUCCESS] Envelope dispatched to jeshikochandran@gmail.com successfully!', type: 'log-success', delay: 2000 },
        { text: '> System: Jeshiko J will compile a response shortly. Terminating link.', type: '', delay: 2400 }
      ];

      logLines.forEach(line => {
        setTimeout(() => {
          const lineDiv = document.createElement('div');
          lineDiv.className = `log-entry ${line.type}`;
          lineDiv.textContent = line.text;
          formLogs.appendChild(lineDiv);
          // scroll logs into view
          formLogs.scrollTop = formLogs.scrollHeight;

          // Re-enable form after final line
          if (line.delay === 2400) {
            inputs.forEach(input => input.disabled = false);
            contactForm.reset();
          }
        }, line.delay || 0);
      });
    });
  }


  /* ==========================================
     7.5. About Tab Navigation
     ========================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Reset active states
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Activate selected tab & content
      btn.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  /* ==========================================
     8. Scroll Reveal Interactions
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // trigger animation only once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(elem => {
    revealObserver.observe(elem);
  });
});
