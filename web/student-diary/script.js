/* ==========================================================================
   ZenDiary - Calm & Aesthetic Student Journal Logic
   ========================================================================== */

// --- STATE MANAGEMENT ---
let entries = [];
let activeEntryId = null;
let saveTimeout = null;

// --- POMODORO TIMER STATE ---
let timerInterval = null;
let timerSecondsRemaining = 25 * 60;
let timerTotalSeconds = 25 * 60;
let timerIsRunning = false;
let timerMode = 'Study'; // 'Study', 'Short Break', 'Long Break'

// --- AUDIO SYNTH STATE ---
let audioContext = null;
let ambientSynth = {
  currentSound: null, // 'rain', 'wind', 'noise' or null
  noiseSource: null,
  lfoSource: null,
  gainNode: null,
  filterNode: null
};

// --- MINDFUL QUOTES DATA ---
const quotes = [
  { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Quiet the mind and the soul will speak.", author: "Ma Jaya Sati Bhagavati" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It is not the mountain we conquer, but ourselves.", author: "Sir Edmund Hillary" },
  { text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
  { text: "One step at a time is all it takes to get there.", author: "Unknown" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initQuotes();
  loadData();
  setupEventListeners();
  updateTimerDisplay();
});

// Rotate quotes based on the current date, or pick a random one
function initQuotes() {
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAuthorEl = document.getElementById('quote-author');
  const dayIndex = new Date().getDate() % quotes.length;
  const todayQuote = quotes[dayIndex];
  
  quoteTextEl.textContent = `"${todayQuote.text}"`;
  quoteAuthorEl.textContent = `— ${todayQuote.author}`;
}

// Load data from LocalStorage
function loadData() {
  const savedEntries = localStorage.getItem('zendiary_entries');
  const savedActiveId = localStorage.getItem('zendiary_active_id');
  
  if (savedEntries) {
    entries = JSON.parse(savedEntries);
  } else {
    // Populate starter entries if empty
    entries = getStarterEntries();
    saveToLocalStorage();
  }

  // Set the active entry
  if (savedActiveId && entries.some(e => e.id === savedActiveId)) {
    activeEntryId = savedActiveId;
  } else if (entries.length > 0) {
    activeEntryId = entries[0].id;
  } else {
    activeEntryId = null;
  }

  renderEntriesList();
  loadActiveEntry();
}

function saveToLocalStorage() {
  localStorage.setItem('zendiary_entries', JSON.stringify(entries));
  localStorage.setItem('zendiary_active_id', activeEntryId);
}

// Starter Entries definition to welcome the student
function getStarterEntries() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const today = new Date();
  
  return [
    {
      id: 'starter-1',
      title: 'Welcoming the Calm 🍃',
      content: 'Welcome to ZenDiary, your digital journal and study space. Today, I\'m setting an intention to focus on my well-being alongside my studies.\n\nHere are three things I am grateful for today:\n1. A comfortable chair to study in.\n2. The soothing low-frequency sounds of rain playing in the background.\n3. The opportunity to learn something new today.\n\nTake a deep breath. You are doing great.',
      datetime: yesterday.toISOString().slice(0, 16),
      category: 'Gratitude',
      mood: 'Calm',
      lastModified: yesterday.getTime()
    },
    {
      id: 'starter-2',
      title: 'Semester Goals & Focus 🎯',
      content: 'Working on my semester goals today. To make studying more manageable, I\'m using the 25-minute Pomodoro timer built into the sidebar.\n\nKey areas to study this week:\n- Review algorithms lecture notes.\n- Draft outline for history essay.\n- Solve math practice problems.\n\nTip: When the focus timer rings, stand up, stretch for 5 minutes, and take a sip of water.',
      datetime: today.toISOString().slice(0, 16),
      category: 'Study',
      mood: 'Focused',
      lastModified: today.getTime()
    }
  ];
}

// --- DOM RENDERING & INTERACTIONS ---

// Render Sidebar Entries List
function renderEntriesList() {
  const entriesList = document.getElementById('entries-list');
  const entryCountEl = document.getElementById('entry-count');
  
  // Apply Search and Filters
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  const categoryFilter = document.getElementById('category-filter').value;
  const moodFilter = document.getElementById('mood-filter').value;
  
  const filtered = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchVal) || 
                          entry.content.toLowerCase().includes(searchVal);
    const matchesCategory = categoryFilter === "" || entry.category === categoryFilter;
    const matchesMood = moodFilter === "" || entry.mood === moodFilter;
    return matchesSearch && matchesCategory && matchesMood;
  });

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
  
  entryCountEl.textContent = filtered.length;
  entriesList.innerHTML = '';

  if (filtered.length === 0) {
    entriesList.innerHTML = `<div class="no-entries">No matching entries found.</div>`;
    return;
  }

  filtered.forEach(entry => {
    const card = document.createElement('div');
    card.className = `entry-card ${entry.id === activeEntryId ? 'active' : ''}`;
    card.dataset.id = entry.id;
    
    const formattedDate = formatDateString(entry.datetime);
    const excerpt = entry.content ? entry.content.substring(0, 80) + (entry.content.length > 80 ? '...' : '') : 'Empty entry...';
    
    // Mood emoji lookup
    const moodEmojis = { Calm: '🍃', Focused: '🎯', Happy: '☀️', Tired: '☁️', Anxious: '🌊' };
    const moodEmoji = moodEmojis[entry.mood] || '🗒️';

    card.innerHTML = `
      <div class="entry-card-header">
        <h4 class="entry-card-title">${escapeHTML(entry.title || 'Untitled Page')}</h4>
        <span class="entry-card-mood" title="Mood: ${entry.mood || 'Unspecified'}">${moodEmoji}</span>
      </div>
      <p class="entry-card-excerpt">${escapeHTML(excerpt)}</p>
      <div class="entry-card-footer">
        <span>${formattedDate}</span>
        <span class="entry-card-category cat-${escapeHTML(entry.category).replace(/\s+/g, '-')}">${escapeHTML(entry.category)}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      selectEntry(entry.id);
    });

    entriesList.appendChild(card);
  });
}

// Select a different entry
function selectEntry(id) {
  // Commit any unsaved timer edits immediately if necessary
  if (saveTimeout) {
    clearTimeout(saveTimeout);
    saveActiveEntryToServer();
  }
  
  activeEntryId = id;
  saveToLocalStorage();
  
  // Update selection UI classes
  document.querySelectorAll('.entry-card').forEach(card => {
    card.classList.toggle('active', card.dataset.id === id);
  });
  
  loadActiveEntry();
}

// Load current active entry into editor
function loadActiveEntry() {
  const titleInput = document.getElementById('entry-title');
  const datetimeInput = document.getElementById('entry-datetime');
  const categorySelect = document.getElementById('entry-category');
  const contentTextarea = document.getElementById('entry-content');
  const autosaveBadge = document.getElementById('autosave-badge');
  
  const entry = entries.find(e => e.id === activeEntryId);
  
  if (!entry) {
    // If no active entry exists, clear fields and disable editor
    titleInput.value = '';
    titleInput.disabled = true;
    datetimeInput.value = '';
    datetimeInput.disabled = true;
    categorySelect.value = 'Personal';
    categorySelect.disabled = true;
    contentTextarea.value = '';
    contentTextarea.disabled = true;
    setMoodActiveUI(null);
    updateStats(0, 0);
    autosaveBadge.classList.remove('show');
    return;
  }
  
  // Enable editor elements
  titleInput.disabled = false;
  datetimeInput.disabled = false;
  categorySelect.disabled = false;
  contentTextarea.disabled = false;
  
  // Load values
  titleInput.value = entry.title || '';
  datetimeInput.value = entry.datetime || '';
  categorySelect.value = entry.category || 'Personal';
  contentTextarea.value = entry.content || '';
  
  setMoodActiveUI(entry.mood);
  updateStats(contentTextarea.value.length, countWords(contentTextarea.value));
  
  autosaveBadge.classList.remove('show');
}

// Update character and word counter
function updateStats(charCount, wordCount) {
  document.getElementById('char-count').textContent = charCount;
  document.getElementById('word-count').textContent = wordCount;
}

// Trigger auto-save with a bounce delay
function triggerAutosave() {
  const autosaveBadge = document.getElementById('autosave-badge');
  autosaveBadge.classList.remove('show');
  
  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(() => {
    saveActiveEntryToServer();
    
    // Show calm notification toast & badge pulse
    autosaveBadge.classList.add('show');
    showToast('Draft autosaved 🍃');
    
    // Re-render sidebar list to update snippets/titles
    renderEntriesList();
  }, 1000); // 1 second debounce
}

// Save active form fields directly into state
function saveActiveEntryToServer() {
  const entry = entries.find(e => e.id === activeEntryId);
  if (!entry) return;
  
  entry.title = document.getElementById('entry-title').value;
  entry.datetime = document.getElementById('entry-datetime').value;
  entry.category = document.getElementById('entry-category').value;
  entry.content = document.getElementById('entry-content').value;
  entry.lastModified = Date.now();
  
  saveToLocalStorage();
}

// Create new empty entry
function createNewEntry() {
  const now = new Date();
  // Adjust time offset to local date format fordatetime-local input
  const localDateTimeStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                            .toISOString().slice(0, 16);
                            
  const newEntry = {
    id: 'entry-' + Date.now(),
    title: '',
    content: '',
    datetime: localDateTimeStr,
    category: 'Personal',
    mood: 'Calm',
    lastModified: Date.now()
  };
  
  entries.unshift(newEntry);
  activeEntryId = newEntry.id;
  
  saveToLocalStorage();
  renderEntriesList();
  loadActiveEntry();
  
  // Set focus to the title input automatically
  document.getElementById('entry-title').focus();
  showToast('New page opened 📝');
}

// Delete current entry
function deleteActiveEntry() {
  if (!activeEntryId) return;
  
  if (confirm("Are you sure you want to delete this diary page? This action is permanent.")) {
    entries = entries.filter(e => e.id !== activeEntryId);
    
    // Assign new active note
    if (entries.length > 0) {
      activeEntryId = entries[0].id;
    } else {
      activeEntryId = null;
    }
    
    saveToLocalStorage();
    renderEntriesList();
    loadActiveEntry();
    showToast('Entry deleted');
  }
}

// --- SETUP EVENT LISTENERS ---
function setupEventListeners() {
  // New Note Action
  document.getElementById('new-entry-btn').addEventListener('click', createNewEntry);
  
  // Auto-saving input event listeners
  document.getElementById('entry-title').addEventListener('input', () => {
    triggerAutosave();
  });
  
  document.getElementById('entry-datetime').addEventListener('change', () => {
    saveActiveEntryToServer();
    renderEntriesList();
    showToast('Date updated');
  });
  
  document.getElementById('entry-category').addEventListener('change', () => {
    saveActiveEntryToServer();
    renderEntriesList();
    showToast('Category updated');
  });
  
  document.getElementById('entry-content').addEventListener('input', (e) => {
    const text = e.target.value;
    updateStats(text.length, countWords(text));
    triggerAutosave();
  });
  
  // Delete Button
  document.getElementById('delete-entry-btn').addEventListener('click', deleteActiveEntry);
  
  // Mood Selector Buttons
  const moodButtons = document.querySelectorAll('.mood-btn-option');
  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedMood = btn.dataset.mood;
      const entry = entries.find(e => e.id === activeEntryId);
      if (entry) {
        entry.mood = selectedMood;
        saveActiveEntryToServer();
        setMoodActiveUI(selectedMood);
        renderEntriesList();
        showToast(`Feeling ${selectedMood} 🍃`);
      }
    });
  });

  // Search & Filter change inputs
  document.getElementById('search-input').addEventListener('input', renderEntriesList);
  document.getElementById('category-filter').addEventListener('change', renderEntriesList);
  document.getElementById('mood-filter').addEventListener('change', renderEntriesList);

  // Sidebar collapsing triggers
  const sidebar = document.getElementById('sidebar');
  document.getElementById('collapse-sidebar-btn').addEventListener('click', () => {
    sidebar.classList.add('collapsed');
  });
  document.getElementById('expand-sidebar-btn').addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
  });

  // Export/Import LocalStorage JSON Backups
  document.getElementById('export-json-btn').addEventListener('click', exportBackupJSON);
  
  const importTrigger = document.getElementById('import-json-trigger');
  const importFile = document.getElementById('import-json-file');
  importTrigger.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', importBackupJSON);
  
  // Export Single Note to TXT file
  document.getElementById('export-txt-btn').addEventListener('click', exportActiveNoteTXT);

  // POMODORO TIMER CONTROLS
  const playPauseBtn = document.getElementById('timer-play-pause');
  const resetBtn = document.getElementById('timer-reset');
  const presetBtns = document.querySelectorAll('.timer-presets .btn-chip');

  playPauseBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const minutes = parseInt(btn.dataset.time, 10);
      const mode = btn.dataset.mode;
      
      setTimerPreset(minutes, mode);
    });
  });

  // AMBIENT SOUND CONTROLS
  const soundBtns = document.querySelectorAll('.sound-btn');
  soundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const soundType = btn.dataset.sound;
      toggleAmbientSound(soundType, btn);
    });
  });

  const volumeSlider = document.getElementById('ambient-volume');
  volumeSlider.addEventListener('input', (e) => {
    const volume = parseFloat(e.target.value);
    setAmbientVolume(volume);
  });
}

// Update Active Mood Styling
function setMoodActiveUI(activeMood) {
  const moodButtons = document.querySelectorAll('.mood-btn-option');
  moodButtons.forEach(btn => {
    const isActive = btn.dataset.mood === activeMood;
    btn.classList.toggle('active', isActive);
  });
}

// --- PRODUCTIVITY COMPONENT: POMODORO TIMER ---
function toggleTimer() {
  // Ensure AudioContext is ready for timer bell sound
  initAudioContext();
  
  const playPausePath = document.getElementById('play-pause-path');
  
  if (timerIsRunning) {
    // Pause Timer
    clearInterval(timerInterval);
    timerIsRunning = false;
    // Set icon back to Play (triangle)
    playPausePath.setAttribute('d', 'M8 5v14l11-7z');
    showToast('Focus timer paused');
  } else {
    // Start Timer
    timerIsRunning = true;
    // Set icon to Pause (two bars)
    playPausePath.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
    showToast(`Timer started: ${timerMode} mode ⏱️`);
    
    timerInterval = setInterval(() => {
      timerSecondsRemaining--;
      updateTimerDisplay();
      
      if (timerSecondsRemaining <= 0) {
        clearInterval(timerInterval);
        timerIsRunning = false;
        playPausePath.setAttribute('d', 'M8 5v14l11-7z');
        
        // Ring synthesized chime sound
        playZenChime();
        
        alert(`${timerMode} finished! Take a breath.`);
        
        // Auto-switch mode
        if (timerMode === 'Study') {
          setTimerPreset(5, 'Short Break');
          // Update presets active button indicator
          updatePresetBadgeActive('Short Break');
        } else {
          setTimerPreset(25, 'Study');
          updatePresetBadgeActive('Study');
        }
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerIsRunning = false;
  timerSecondsRemaining = timerTotalSeconds;
  
  // Set play icon
  document.getElementById('play-pause-path').setAttribute('d', 'M8 5v14l11-7z');
  updateTimerDisplay();
  showToast('Timer reset');
}

function setTimerPreset(minutes, mode) {
  clearInterval(timerInterval);
  timerIsRunning = false;
  timerMode = mode;
  timerTotalSeconds = minutes * 60;
  timerSecondsRemaining = timerTotalSeconds;
  
  // Set play icon
  document.getElementById('play-pause-path').setAttribute('d', 'M8 5v14l11-7z');
  
  document.getElementById('timer-mode').textContent = mode;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const countdownEl = document.getElementById('timer-countdown');
  const progressCircle = document.getElementById('timer-progress');
  
  const mins = Math.floor(timerSecondsRemaining / 60);
  const secs = timerSecondsRemaining % 60;
  countdownEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  // Circular progress math: circumference of radius 34 is 213.628
  const circumference = 213.628;
  const percentComplete = timerSecondsRemaining / timerTotalSeconds;
  
  // Check boundary to prevent NaN or negative offsets
  const offset = Math.max(0, Math.min(circumference, percentComplete * circumference));
  progressCircle.style.strokeDashoffset = circumference - offset;
}

function updatePresetBadgeActive(modeName) {
  const presetBtns = document.querySelectorAll('.timer-presets .btn-chip');
  presetBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === modeName);
  });
  document.getElementById('timer-mode').textContent = modeName;
}

// --- PRODUCTIVITY COMPONENT: AMBIENT SOUND GENERATOR (Web Audio API) ---

// Lazy initialize AudioContext on user interaction
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// Generate procedurally synthesized Brown Noise buffer
function createBrownNoiseBuffer() {
  const bufferSize = audioContext.sampleRate * 2; // 2 seconds loop
  const noiseBuffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
  
  for (let channel = 0; channel < noiseBuffer.numberOfChannels; channel++) {
    const output = noiseBuffer.getChannelData(channel);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brownian motion integration algorithm
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Scale up volume
    }
  }
  return noiseBuffer;
}

// Toggle an ambient sound on or off
function toggleAmbientSound(soundType, buttonEl) {
  initAudioContext();
  
  const allSoundBtns = document.querySelectorAll('.sound-btn');
  const currentVolume = parseFloat(document.getElementById('ambient-volume').value);
  
  // If clicking active playing sound, stop it (fade out)
  if (ambientSynth.currentSound === soundType) {
    fadeAndStopAmbient(() => {
      buttonEl.classList.remove('active');
    });
    return;
  }
  
  // Otherwise, if another sound is already active, stop it first
  if (ambientSynth.currentSound !== null) {
    const activeBtn = Array.from(allSoundBtns).find(btn => btn.dataset.sound === ambientSynth.currentSound);
    if (activeBtn) activeBtn.classList.remove('active');
    
    fadeAndStopAmbient(() => {
      startAmbientSound(soundType, currentVolume);
      buttonEl.classList.add('active');
    });
  } else {
    startAmbientSound(soundType, currentVolume);
    buttonEl.classList.add('active');
  }
}

// Start synthesized sound nodes
function startAmbientSound(soundType, volume) {
  const now = audioContext.currentTime;
  
  // Create gain control
  ambientSynth.gainNode = audioContext.createGain();
  ambientSynth.gainNode.gain.setValueAtTime(0, now); // start at zero for fade-in
  
  // Generate brown noise loop
  const buffer = createBrownNoiseBuffer();
  ambientSynth.noiseSource = audioContext.createBufferSource();
  ambientSynth.noiseSource.buffer = buffer;
  ambientSynth.noiseSource.loop = true;
  
  // Setup filters based on sounds
  ambientSynth.filterNode = audioContext.createBiquadFilter();
  
  if (soundType === 'rain') {
    // Rain: Lowpass filtered brown noise (smooth steady sound)
    ambientSynth.filterNode.type = 'lowpass';
    ambientSynth.filterNode.frequency.setValueAtTime(650, now);
    
    ambientSynth.noiseSource.connect(ambientSynth.filterNode);
    ambientSynth.filterNode.connect(ambientSynth.gainNode);
  } 
  else if (soundType === 'wind') {
    // Wind: Sweeping bandpass filtered brown noise modulated by LFO
    ambientSynth.filterNode.type = 'bandpass';
    ambientSynth.filterNode.frequency.setValueAtTime(450, now);
    ambientSynth.filterNode.Q.setValueAtTime(2.5, now);
    
    // Slow LFO to fluctuate wind speeds
    ambientSynth.lfoSource = audioContext.createOscillator();
    ambientSynth.lfoSource.frequency.setValueAtTime(0.08, now); // 12.5s cycle
    
    const lfoGain = audioContext.createGain();
    lfoGain.gain.setValueAtTime(280, now); // swing +- 280Hz
    
    ambientSynth.lfoSource.connect(lfoGain);
    lfoGain.connect(ambientSynth.filterNode.frequency);
    
    ambientSynth.noiseSource.connect(ambientSynth.filterNode);
    ambientSynth.filterNode.connect(ambientSynth.gainNode);
    
    ambientSynth.lfoSource.start(now);
  } 
  else if (soundType === 'noise') {
    // Brown Noise: Deep clean rumble focus filter
    ambientSynth.filterNode.type = 'lowpass';
    ambientSynth.filterNode.frequency.setValueAtTime(1200, now);
    
    ambientSynth.noiseSource.connect(ambientSynth.filterNode);
    ambientSynth.filterNode.connect(ambientSynth.gainNode);
  }
  
  // Output destination connect
  ambientSynth.gainNode.connect(audioContext.destination);
  
  // Play sound & fade in over 0.8 seconds
  ambientSynth.noiseSource.start(now);
  ambientSynth.gainNode.gain.linearRampToValueAtTime(volume * 0.45, now + 0.8); // Scale gain for comfort
  
  ambientSynth.currentSound = soundType;
  showToast(`Synthesizing ambient ${soundType}... 🍃`);
}

// Fade out sound node smoothly before stopping
function fadeAndStopAmbient(callback) {
  if (!ambientSynth.gainNode || !ambientSynth.noiseSource) {
    ambientSynth.currentSound = null;
    if (callback) callback();
    return;
  }
  
  const now = audioContext.currentTime;
  const fadeDuration = 0.5; // half second fade
  
  // Cancel scheduled gains and fade out
  ambientSynth.gainNode.gain.cancelScheduledValues(now);
  ambientSynth.gainNode.gain.setValueAtTime(ambientSynth.gainNode.gain.value, now);
  ambientSynth.gainNode.gain.linearRampToValueAtTime(0, now + fadeDuration);
  
  // Stop nodes after fade finishes
  setTimeout(() => {
    try {
      if (ambientSynth.noiseSource) {
        ambientSynth.noiseSource.stop();
        ambientSynth.noiseSource.disconnect();
      }
      if (ambientSynth.lfoSource) {
        ambientSynth.lfoSource.stop();
        ambientSynth.lfoSource.disconnect();
      }
      if (ambientSynth.filterNode) {
        ambientSynth.filterNode.disconnect();
      }
      if (ambientSynth.gainNode) {
        ambientSynth.gainNode.disconnect();
      }
    } catch(err) {
      console.log('Audio node cleanup error:', err);
    }
    
    ambientSynth.currentSound = null;
    ambientSynth.noiseSource = null;
    ambientSynth.lfoSource = null;
    ambientSynth.filterNode = null;
    ambientSynth.gainNode = null;
    
    if (callback) callback();
  }, fadeDuration * 1000);
}

// Set volume slider
function setAmbientVolume(val) {
  if (ambientSynth.gainNode && audioContext) {
    const now = audioContext.currentTime;
    // Scale slider value down a bit for a gentle sound floor
    ambientSynth.gainNode.gain.linearRampToValueAtTime(val * 0.45, now + 0.1);
  }
}

// Zen timer chime synthesised bell tone
function playZenChime() {
  if (!audioContext) return;
  
  const now = audioContext.currentTime;
  
  // Chime fundamental note (C5 - 523.25Hz)
  const osc1 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(523.25, now);
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.35, now + 0.05);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 3.0); // 3 seconds fade out
  
  // Overtones (E5 - 659.25Hz)
  const osc2 = audioContext.createOscillator();
  const gain2 = audioContext.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(659.25, now);
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.18, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // 2.5s fade out

  osc1.connect(gain1);
  gain1.connect(audioContext.destination);
  
  osc2.connect(gain2);
  gain2.connect(audioContext.destination);
  
  osc1.start(now);
  osc2.start(now);
  
  osc1.stop(now + 3.1);
  osc2.stop(now + 3.1);
}

// --- PORTABILITY & EXPORTS ---

// Download active note as raw text
function exportActiveNoteTXT() {
  const entry = entries.find(e => e.id === activeEntryId);
  if (!entry) {
    showToast('No active page to download');
    return;
  }
  
  const textContent = `================================================
ZEN DIARY ENTRY
================================================
Title:      ${entry.title || 'Untitled'}
Date:       ${formatDateString(entry.datetime)} (${entry.datetime})
Category:   ${entry.category}
Mood:       ${entry.mood || 'Unspecified'}
Last Saved: ${new Date(entry.lastModified).toLocaleString()}
------------------------------------------------

${entry.content || ''}

================================================
Generated via ZenDiary 🍃
`;

  const safeTitle = (entry.title || 'Untitled_Page').trim()
                    .replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const dateStamp = entry.datetime.substring(0, 10);
  const fileName = `${safeTitle}_${dateStamp}.txt`;
  
  triggerFileDownload(textContent, 'text/plain', fileName);
  showToast('Note exported as TXT');
}

// Export backup to JSON
function exportBackupJSON() {
  const backupStr = JSON.stringify(entries, null, 2);
  const dateStr = new Date().toISOString().substring(0, 10);
  const fileName = `zendiary_backup_${dateStr}.json`;
  
  triggerFileDownload(backupStr, 'application/json', fileName);
  showToast('Backup download started 📥');
}

// Import JSON file backup
function importBackupJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsedData = JSON.parse(evt.target.result);
      
      // Basic validations on structure
      if (Array.isArray(parsedData) && (parsedData.length === 0 || parsedData[0].hasOwnProperty('id'))) {
        if (confirm(`You are importing ${parsedData.length} entries. Would you like to merge them with your current entries or completely overwrite? (OK: Overwrite, Cancel: Merge)`)) {
          // Overwrite
          entries = parsedData;
        } else {
          // Merge (prevent duplicate IDs)
          parsedData.forEach(item => {
            if (!entries.some(e => e.id === item.id)) {
              entries.push(item);
            }
          });
        }
        
        // Reset selections
        if (entries.length > 0) {
          activeEntryId = entries[0].id;
        } else {
          activeEntryId = null;
        }
        
        saveToLocalStorage();
        renderEntriesList();
        loadActiveEntry();
        showToast('Backup restored successfully 🍃');
      } else {
        alert('Invalid backup file. Could not restore database.');
      }
    } catch(err) {
      alert('Error parsing JSON backup file: ' + err.message);
    }
    // Reset file input target value
    e.target.value = '';
  };
  
  reader.readAsText(file);
}

// Helper to trigger direct downloads in browser
function triggerFileDownload(content, type, filename) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}

// --- UTILITIES ---

// Escape HTML utility to prevent XSS injection
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Format DateTime-local ISO format into readable user string
function formatDateString(dateTimeStr) {
  if (!dateTimeStr) return 'Unspecified';
  const d = new Date(dateTimeStr);
  if (isNaN(d.getTime())) return dateTimeStr;
  
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return d.toLocaleDateString(undefined, options);
}

// Helper word count
function countWords(str) {
  if (!str) return 0;
  const cleanStr = str.trim().replace(/\s+/g, ' ');
  return cleanStr === '' ? 0 : cleanStr.split(' ').length;
}

// Custom alert banner notification toast
function showToast(message) {
  const toast = document.getElementById('toast-message');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
