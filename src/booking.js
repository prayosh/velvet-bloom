// Velvet Bloom - Interactive Booking Engine (Vanilla JS)

// Curated list of luxury salon rituals
const SERVICES = [
  { id: 'hair-balayage', name: 'Signature French Balayage', duration: '150 min', price: '₹3,500', category: 'Hair' },
  { id: 'hair-spa', name: 'Kérastase Deep Nourishing Spa', duration: '90 min', price: '₹2,200', category: 'Hair' },
  { id: 'nail-gel', name: 'Premium Gel Extension & Art', duration: '75 min', price: '₹1,500', category: 'Nail' },
  { id: 'nail-chrome', name: 'Luxury Chrome Nail Overlay', duration: '60 min', price: '₹1,200', category: 'Nail' },
  { id: 'facial-gold', name: '24K Bio-Active Botanical Facial', duration: '90 min', price: '₹2,800', category: 'Facial' },
  { id: 'facial-hydra', name: 'Advanced Oxygen Hydro-Facial', duration: '75 min', price: '₹3,200', category: 'Facial' },
  { id: 'bridal-royal', name: 'Royal Indian Shringar Packages', duration: '300 min', price: '₹15,000', category: 'Bridal' },
  { id: 'bridal-party', name: 'Luxury Bridesmaid Glow Kit', duration: '180 min', price: '₹6,500', category: 'Bridal' }
];

document.addEventListener('DOMContentLoaded', () => {
  // Booking application state
  let currentStep = 1;
  let selectedService = null;
  let selectedDate = '';
  let selectedTimeSlot = '';

  // Get queries from URL (e.g., booking.html?service=nail-gel)
  const urlParams = new URLSearchParams(window.location.search);
  const paramServiceId = urlParams.get('service');
  if (paramServiceId) {
    const matchedService = SERVICES.find(s => s.id === paramServiceId);
    if (matchedService) {
      selectedService = matchedService;
    }
  }

  // Setup default tomorrow date on calendar picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateString = tomorrow.toISOString().split('T')[0];
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    dateInput.value = defaultDateString;
    dateInput.min = defaultDateString;
    selectedDate = defaultDateString;
  }

  // DOM elements references
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepDividers = document.querySelectorAll('.step-divider');
  const stepSections = document.querySelectorAll('.step-section');
  
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');
  const lockBtn = document.getElementById('lock-btn');
  const errorBanner = document.getElementById('error-banner');
  const errorText = document.getElementById('error-text');
  const successSection = document.getElementById('success-section');
  const formSection = document.getElementById('booking-form-wrapper');

  // Summary widgets
  const summaryService = document.getElementById('summary-service');
  const summaryCategory = document.getElementById('summary-category');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const summaryPatron = document.getElementById('summary-patron');
  const summaryPhone = document.getElementById('summary-phone');
  const summaryPrice = document.getElementById('summary-price');
  const summaryDuration = document.getElementById('summary-duration');

  // Render Service Grid Items dynamically
  const serviceGrid = document.getElementById('services-grid-wrapper');
  if (serviceGrid) {
    serviceGrid.innerHTML = ''; // clear initial skeleton placeholders
    SERVICES.forEach(s => {
      const isChosen = selectedService && selectedService.id === s.id;
      const card = document.createElement('div');
      card.className = `p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center ${
        isChosen 
          ? 'bg-rose-pink/10 border-rose-pink shadow-pink-glow' 
          : 'bg-[#150a1a]/85 border-rose-pink/10 hover:border-rose-pink/35'
      }`;
      card.setAttribute('data-id', s.id);
      
      card.innerHTML = `
        <div class="space-y-1">
          <span class="text-[8px] tracking-widest uppercase text-gold font-light">${s.category} Ritual</span>
          <h4 class="font-serif text-sm font-semibold">${s.name}</h4>
          <p class="text-[10px] text-lavender-white/50">${s.duration}</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-serif font-bold text-gold block">${s.price}</span>
          <div class="choice-indicator w-4 h-4 rounded-full border flex items-center justify-center mt-1.5 ml-auto ${
            isChosen ? 'border-rose-pink bg-rose-pink text-plum-black' : 'border-rose-pink/30'
          }">
            ${isChosen ? '<svg class="w-2.5 h-2.5 stroke-[3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : ''}
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        // Toggle selection classes
        document.querySelectorAll('[data-id]').forEach(elem => {
          elem.className = 'p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center bg-[#150a1a]/85 border-rose-pink/10 hover:border-rose-pink/35';
          const innerIndicator = elem.querySelector('.choice-indicator');
          innerIndicator.className = 'choice-indicator w-4 h-4 rounded-full border border-rose-pink/30 flex items-center justify-center mt-1.5 ml-auto';
          innerIndicator.innerHTML = '';
        });

        card.className = 'p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-center bg-rose-pink/10 border-rose-pink shadow-pink-glow';
        const indicator = card.querySelector('.choice-indicator');
        indicator.className = 'choice-indicator w-4 h-4 rounded-full border border-rose-pink bg-rose-pink text-plum-black flex items-center justify-center mt-1.5 ml-auto';
        indicator.innerHTML = '<svg class="w-2.5 h-2.5 stroke-[3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';

        selectedService = s;
        hideError();
        updateSummary();
      });

      serviceGrid.appendChild(card);
    });
  }

  // Handle Hour Selection Buttons
  const slotButtons = document.querySelectorAll('.slot-btn');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => {
        if (!b.hasAttribute('disabled')) {
          b.className = 'slot-btn py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all duration-150 bg-[#211729] hover:bg-rose-pink/5 border border-rose-pink/15 text-lavender-white/80';
        }
      });
      btn.className = 'slot-btn py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all duration-150 bg-rose-pink text-plum-black font-semibold ring-2 ring-rose-pink/40 shadow-inner';
      selectedTimeSlot = btn.getAttribute('data-time') || '';
      hideError();
      updateSummary();
    });
  });

  // Track calendar input changes
  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      selectedDate = e.target.value;
      updateSummary();
    });
  }

  // Handle details validation on key input
  const patronInput = document.getElementById('patron-name');
  const phoneInput = document.getElementById('patron-phone');
  
  if (patronInput) {
    patronInput.addEventListener('input', () => {
      if (summaryPatron) summaryPatron.textContent = patronInput.value || 'Waiting for patron name';
      const patronRow = document.getElementById('summary-patron-row');
      if (patronRow) {
        if (patronInput.value) patronRow.classList.remove('hidden');
        else patronRow.classList.add('hidden');
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (summaryPhone) summaryPhone.textContent = phoneInput.value || '';
    });
  }

  // Interactive step Navigation logic
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 1) {
        if (!selectedService) {
          showError('Please select a luxury service to proceed.');
          return;
        }
        currentStep = 2;
        updateUI();
      } else if (currentStep === 2) {
        if (!selectedDate) {
          showError('Please select an appointment date.');
          return;
        }
        if (!selectedTimeSlot) {
          showError('Please select an available time slot.');
          return;
        }
        currentStep = 3;
        updateUI();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentStep = Math.max(currentStep - 1, 1);
      updateUI();
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      const nameVal = patronInput ? patronInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const emailVal = document.getElementById('patron-email') ? document.getElementById('patron-email').value.trim() : '';
      const notesVal = document.getElementById('patron-notes') ? document.getElementById('patron-notes').value.trim() : '';

      if (!nameVal) {
        showError('Please enter your name.');
        return;
      }
      if (!phoneVal) {
        showError('Please enter your contact phone number.');
        return;
      }
      if (phoneVal.replace(/\D/g, '').length < 10) {
        showError('Please enter a valid 10-digit phone number.');
        return;
      }

      // If valid, launch success confirmed stage!
      const randomRef = 'VB-' + Math.floor(100000 + Math.random() * 900000);
      
      // Inject success screen details
      document.getElementById('success-patron').textContent = nameVal;
      document.getElementById('success-date').textContent = selectedDate;
      document.getElementById('success-time').textContent = selectedTimeSlot;
      document.getElementById('success-ref-code').textContent = randomRef;
      document.getElementById('success-service').textContent = selectedService.name;
      document.getElementById('success-price').textContent = selectedService.price;

      if (formSection) formSection.classList.add('hidden');
      if (successSection) {
        successSection.classList.remove('hidden');
        successSection.classList.add('animate-bloom');
      }
    });
  }

  // Reset Booking helper
  const doneResetBtn = document.getElementById('done-reset-btn');
  if (doneResetBtn) {
    doneResetBtn.addEventListener('click', () => {
      location.reload(); // Quick reset by page refresh
    });
  }

  // Helper functions
  function showError(msg) {
    if (errorBanner && errorText) {
      errorText.textContent = msg;
      errorBanner.classList.remove('hidden');
    }
  }

  function hideError() {
    if (errorBanner) {
      errorBanner.classList.add('hidden');
    }
  }

  function updateSummary() {
    if (selectedService) {
      if (summaryService) summaryService.textContent = selectedService.name;
      if (summaryCategory) summaryCategory.textContent = 'Category: ' + selectedService.category;
      if (summaryPrice) summaryPrice.textContent = selectedService.price;
      if (summaryDuration) summaryDuration.textContent = selectedService.duration;
      
      const pPlaceholder = document.getElementById('summary-service-placeholder');
      if (pPlaceholder) pPlaceholder.classList.add('hidden');
      const pDetail = document.getElementById('summary-service-detail');
      if (pDetail) pDetail.classList.remove('hidden');
    }

    if (selectedDate && selectedTimeSlot) {
      if (summaryDate) summaryDate.textContent = selectedDate;
      if (summaryTime) summaryTime.textContent = 'Selected Time: ' + selectedTimeSlot;
      
      const sPlaceholder = document.getElementById('summary-schedule-placeholder');
      if (sPlaceholder) sPlaceholder.classList.add('hidden');
      const sDetail = document.getElementById('summary-schedule-detail');
      if (sDetail) sDetail.classList.remove('hidden');
    }
  }

  function updateUI() {
    hideError();
    
    // Toggle active sections
    stepSections.forEach(sec => {
      const stepIdx = parseInt(sec.getAttribute('data-step') || '1', 10);
      if (stepIdx === currentStep) {
        sec.classList.remove('hidden');
        sec.classList.add('animate-fade-in');
      } else {
        sec.classList.add('hidden');
      }
    });

    // Toggle indicators
    stepIndicators.forEach(ind => {
      const indIdx = parseInt(ind.getAttribute('data-indicator') || '1', 10);
      if (currentStep >= indIdx) {
        ind.className = 'step-indicator w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-semibold bg-rose-pink text-plum-black shadow-pink-glow';
        ind.innerHTML = currentStep > indIdx 
          ? '<svg class="w-4 h-4 stroke-[3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' 
          : indIdx;
        const textTarget = document.getElementById(`step-text-${indIdx}`);
        if (textTarget) textTarget.className = 'text-[10px] sm:text-xs font-medium uppercase tracking-wider hidden sm:inline text-rose-pink';
      } else {
        ind.className = 'step-indicator w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-semibold bg-[#291e30] text-lavender-white/50 border border-rose-pink/10';
        ind.textContent = indIdx;
        const textTarget = document.getElementById(`step-text-${indIdx}`);
        if (textTarget) textTarget.className = 'text-[10px] sm:text-xs font-medium uppercase tracking-wider hidden sm:inline text-lavender-white/40';
      }
    });

    // Toggle step dividers
    stepDividers.forEach(div => {
      const divIdx = parseInt(div.getAttribute('data-divider') || '1', 10);
      if (currentStep > divIdx) {
        div.className = 'step-divider height-[2px] h-[2px] grow rounded-full transition-colors duration-300 bg-rose-pink';
      } else {
        div.className = 'step-divider height-[2px] h-[2px] grow rounded-full transition-colors duration-300 bg-[#291e30]';
      }
    });

    // Toggle navigation control buttons
    if (currentStep === 1) {
      if (prevBtn) prevBtn.classList.add('opacity-0', 'pointer-events-none');
      if (nextBtn) nextBtn.classList.remove('hidden');
      if (lockBtn) lockBtn.classList.add('hidden');
    } else if (currentStep === 2) {
      if (prevBtn) prevBtn.classList.remove('opacity-0', 'pointer-events-none');
      if (nextBtn) nextBtn.classList.remove('hidden');
      if (lockBtn) lockBtn.classList.add('hidden');
    } else if (currentStep === 3) {
      if (prevBtn) prevBtn.classList.remove('opacity-0', 'pointer-events-none');
      if (nextBtn) nextBtn.classList.add('hidden');
      if (lockBtn) lockBtn.classList.remove('hidden');
    }
  }

  // Pre-initialize update if parameter loaded matched selected service
  updateSummary();
});
