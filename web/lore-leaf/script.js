// ── Database: Novels, Chapters, and Trivia ─────────────────────────────────
const NOVELS = [
    {
        id: "alice",
        title: "Alice's Adventures in Wonderland",
        author: "Lewis Carroll",
        chapters: [
            {
                id: "alice-1",
                title: "Chapter I: Down the Rabbit-Hole",
                content: [
                    "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'",
                    "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
                    "There was nothing so VERY remarkable in that; nor did Alice think it so VERY much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!' (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually TOOK A WATCH OUT OF ITS WAISTCOAT-POCKET, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.",
                    "In another moment down went Alice after it, never once considering how in the world she was to get out again.",
                    "The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well."
                ],
                trivia: [
                    { type: "fact", label: "Real Alice", title: "The Real Alice", text: "The character of Alice was inspired by Alice Liddell, the daughter of Henry Liddell, dean of Christ Church, Oxford, where Carroll taught mathematics." },
                    { type: "vocab", label: "Daisy-chain", title: "Daisy-chain", text: "A decorative string of daisies linked together by their stems. Used here to portray Alice's idle, child-like boredom." },
                    { type: "lore", label: "Waistcoat watch", title: "Victorian Punctuality", text: "The White Rabbit checking a pocket-watch satirizes the Victorian obsession with strict punctuality, schedules, and work efficiency." }
                ]
            },
            {
                id: "alice-2",
                title: "Chapter II: The Pool of Tears",
                content: [
                    "'Curiouser and curiouser!' cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); 'now I'm opening out like the largest telescope that ever was! Good-bye, feet!' (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off).",
                    "'Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I'm sure I shan't be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can; —but I must be kind to them,' thought Alice, 'or perhaps they won't walk the way I want to go!'",
                    "Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door."
                ],
                trivia: [
                    { type: "vocab", label: "Curiouser", title: "Curiouser", text: "A playful, grammatically incorrect comparative coined by Carroll which has since entered the English dictionary to describe something strange." },
                    { type: "fact", label: "Mathematical subversion", title: "Math & Logic", text: "Lewis Carroll was a mathematician, and much of the weird behavior in Wonderland refers to mathematical concepts like non-Euclidean geometry and symbolic logic." }
                ]
            }
        ]
    },
    {
        id: "time_machine",
        title: "The Time Machine",
        author: "H.G. Wells",
        chapters: [
            {
                id: "tm-1",
                title: "Chapter I: The Time Traveller's Explanation",
                content: [
                    "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burned brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses.",
                    "Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere when thought runs gracefully free of the trammels of precision.",
                    "He put this point to us, marking it with a lean forefinger: 'You must follow me carefully. I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, they taught you at school is founded on a misconception.'"
                ],
                trivia: [
                    { type: "fact", label: "Father of Sci-Fi", title: "H.G. Wells", text: "Alongside Jules Verne, H.G. Wells is often hailed as the 'father of science fiction'. The Time Machine popularized the concept of time travel using a vehicle." },
                    { type: "vocab", label: "Trammels", title: "Trammels", text: "A restriction or impediment to someone's freedom of action. The traveler seeks to free minds from rigid assumptions." },
                    { type: "lore", label: "Fourth Dimension", title: "The 4th Dimension", text: "Wells published this in 1895, ten years before Einstein published his theory of Special Relativity, which formalized time as the fourth dimension of space-time." }
                ]
            }
        ]
    },
    {
        id: "sherlock",
        title: "The Adventures of Sherlock Holmes",
        author: "Arthur Conan Doyle",
        chapters: [
            {
                id: "sherlock-1",
                title: "A Scandal in Bohemia",
                content: [
                    "To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.",
                    "He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer.",
                    "They were admirable things for the observer—excellent for drawing the veil from men’s motives and actions. But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results."
                ],
                trivia: [
                    { type: "fact", label: "Real Inspiration", title: "Dr. Joseph Bell", text: "Doyle based Sherlock Holmes on Dr. Joseph Bell, a surgeon under whom he studied. Bell could deduce a patient's occupation and habits by simple observation." },
                    { type: "vocab", label: "Gibe", title: "Gibe / Sneer", text: "An insulting or mocking remark. Holmes viewed emotions as irrational disturbances to logical thought." },
                    { type: "lore", label: "Irene Adler", title: "The Woman", text: "Irene Adler is one of the most prominent female characters in the Holmes canon, notable for outsmarting Holmes, earning his deep respect." }
                ]
            }
        ]
    }
];

// ── Database: Curated Facts Board ───────────────────────────────────────────
const CURATED_FACTS = [
    {
        id: "entanglement",
        category: "science",
        title: "Spooky Action",
        text: "Quantum Entanglement allows two particles to instantaneously influence each other regardless of distance. Albert Einstein famously rejected this, calling it 'spooky action at a distance'.",
        source: "Physics Review"
    },
    {
        id: "alexandria",
        category: "history",
        title: "Alexandria's End",
        text: "The Library of Alexandria did not burn down in a single catastrophic fire. Instead, it suffered a gradual decline over centuries due to budget cuts, civil riots, and multiple small conflicts.",
        source: "Classical Studies Journal"
    },
    {
        id: "frankenstein",
        category: "literature",
        title: "Volcanic Summer",
        text: "Mary Shelley wrote 'Frankenstein' in 1816 during the 'Year Without a Summer'. A massive volcanic eruption in Indonesia blocked global sunlight, forcing her and friends to stay indoors and write ghost stories.",
        source: "Literary History"
    },
    {
        id: "neutron",
        category: "space",
        title: "Ultra Dense Stars",
        text: "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons on Earth. They are the collapsed cores of massive stars.",
        source: "NASA Astrophysics"
    },
    {
        id: "voyager",
        category: "space",
        title: "Earth's Capsule",
        text: "The Voyager Golden Record launched in 1977 contains 115 images, greetings in 55 languages, and natural sounds of Earth, designed as a time capsule for extraterrestrials.",
        source: "JPL Lab"
    },
    {
        id: "rosetta",
        category: "history",
        title: "Unlocking Hieroglyphs",
        text: "The Rosetta Stone, discovered by French soldiers in 1799, contains the same text in Greek, Demotic, and Egyptian Hieroglyphs, allowing scholars to translate ancient Egyptian for the first time.",
        source: "British Museum Studies"
    },
    {
        id: "bananas",
        category: "science",
        title: "Bananas are Berries",
        text: "Botanically, bananas are classified as berries because they grow from a flower with one ovary and have soft skins. Strawberries, however, are not berries since their seeds are external.",
        source: "Botanical Review"
    },
    {
        id: "shakespeare",
        category: "literature",
        title: "Coined Words",
        text: "William Shakespeare is credited with introducing over 1,700 words into the English language by converting nouns to verbs, borrowing from other languages, and inventing new prefixes.",
        source: "Oxford Lexicon"
    }
];

// ── Database: Instant Random Generator Facts ──────────────────────────────
const RANDOM_FACTS = [
    { text: "Honey never spoils. Archeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.", tag: "History" },
    { text: "Before eraser rubbers were invented, people used rolled-up pieces of moist white bread to erase pencil marks.", tag: "History" },
    { text: "Venus is the only planet in the Solar System that rotates clockwise (retrograde rotation).", tag: "Space" },
    { text: "Wombat feces are cube-shaped, which stops the droppings from rolling away and helps mark their territory.", tag: "Biology" },
    { text: "There are more trees on Earth than stars in the Milky Way galaxy. (Approx. 3 trillion trees vs 100-400 billion stars).", tag: "Science" },
    { text: "The Eiffel Tower can grow up to 15 cm (6 inches) taller during the summer due to thermal expansion of the iron structure.", tag: "Physics" },
    { text: "Oxford University is older than the Aztec Empire. Oxford teaching began in 1096, while the Aztec civilization began around 1325.", tag: "History" },
    { text: "A day on Venus is longer than a year on Venus. It takes Venus 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.", tag: "Space" },
    { text: "Octopuses have three hearts: two pump blood to the gills, and one pumps it to the rest of the body.", tag: "Biology" },
    { text: "The first novel ever written is widely considered to be 'The Tale of Genji', written in Japan in the 11th century by Murasaki Shikibu.", tag: "Literature" }
];

// ── App State Management ───────────────────────────────────────────────────
let state = {
    activeSection: "section-reader",
    selectedBookId: "alice",
    selectedChapterIndex: 0,
    
    // Reading settings
    theme: "light",
    fontFamily: "serif", // "serif" or "sans"
    fontSize: 18,        // in pixels
    lineHeight: 1.7,
    
    // Saved database
    savedChapters: [], // array of objects { bookId, chapterIdx, title, timestamp }
    savedFacts: [],    // array of objects { id, text, category/tag, timestamp }
    
    // TTS system
    isSpeaking: false,
    utterance: null
};

// ── Application Initialization ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    loadSettingsFromStorage();
    initUI();
    renderBookSelector();
    loadChapter();
    renderFactsBoard();
    renderSavedItems();
    generateRandomFact();
});

// ── Load Local Settings ────────────────────────────────────────────────────
function loadSettingsFromStorage() {
    const storedSettings = localStorage.getItem("loreleaf_settings");
    if (storedSettings) {
        try {
            const parsed = JSON.parse(storedSettings);
            state.theme = parsed.theme || "light";
            state.fontFamily = parsed.fontFamily || "serif";
            state.fontSize = parsed.fontSize || 18;
            state.lineHeight = parsed.lineHeight || 1.7;
        } catch (e) {
            console.error("Failed to parse settings", e);
        }
    }
    
    const storedChapters = localStorage.getItem("loreleaf_saved_chapters");
    if (storedChapters) {
        try {
            state.savedChapters = JSON.parse(storedChapters);
        } catch (e) {}
    }
    
    const storedFacts = localStorage.getItem("loreleaf_saved_facts");
    if (storedFacts) {
        try {
            state.savedFacts = JSON.parse(storedFacts);
        } catch (e) {}
    }
    
    // Apply initial settings to HTML body
    applySettingsToDOM();
}

function saveSettingsToStorage() {
    localStorage.setItem("loreleaf_settings", JSON.stringify({
        theme: state.theme,
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight
    }));
}

function applySettingsToDOM() {
    const body = document.body;
    
    // Theme
    body.className = `theme-${state.theme} font-${state.fontFamily}`;
    
    // Font parameters in the reading space
    const textArea = document.getElementById("book-text-area");
    if (textArea) {
        textArea.style.fontSize = `${state.fontSize}px`;
        textArea.style.lineHeight = state.lineHeight;
    }
    
    // Update active visual triggers in settings panel
    document.querySelectorAll(".theme-selector").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.theme === state.theme);
    });
    
    document.getElementById("selector-font-serif").classList.toggle("active", state.fontFamily === "serif");
    document.getElementById("selector-font-sans").classList.toggle("active", state.fontFamily === "sans");
    
    document.getElementById("font-size-display").innerText = `${state.fontSize}px`;
    
    document.querySelectorAll(".height-selector").forEach(btn => {
        btn.classList.toggle("active", parseFloat(btn.dataset.height) === state.lineHeight);
    });
}

// ── Initialize Event Listeners & UI Components ─────────────────────────────
function initUI() {
    // Nav bar routing
    document.querySelectorAll("#main-nav .nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#main-nav .nav-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const targetSection = btn.dataset.target;
            document.querySelectorAll(".app-section").forEach(sec => sec.classList.remove("active"));
            document.getElementById(targetSection).classList.add("active");
            
            // Stop speech synth if moving away from reader
            if (targetSection !== "section-reader" && state.isSpeaking) {
                stopReadingAloud();
            }
            
            state.activeSection = targetSection;
        });
    });
    
    // Overlay Settings Toggle
    const settingsOverlay = document.getElementById("settings-overlay");
    document.getElementById("btn-reading-settings").addEventListener("click", () => {
        settingsOverlay.classList.remove("hidden");
    });
    document.getElementById("btn-close-settings").addEventListener("click", () => {
        settingsOverlay.classList.add("hidden");
    });
    settingsOverlay.addEventListener("click", (e) => {
        if (e.target === settingsOverlay) {
            settingsOverlay.classList.add("hidden");
        }
    });
    
    // Cycle theme button in header
    document.getElementById("btn-theme-cycle").addEventListener("click", () => {
        const themes = ["light", "sepia", "green", "dark"];
        let nextIdx = (themes.indexOf(state.theme) + 1) % themes.length;
        state.theme = themes[nextIdx];
        saveSettingsToStorage();
        applySettingsToDOM();
        showNotification(`Switched Theme to ${themes[nextIdx].toUpperCase()}`);
    });
    
    // Settings selectors click bindings
    document.querySelectorAll(".theme-selector").forEach(btn => {
        btn.addEventListener("click", () => {
            state.theme = btn.dataset.theme;
            saveSettingsToStorage();
            applySettingsToDOM();
        });
    });
    
    document.getElementById("selector-font-serif").addEventListener("click", () => {
        state.fontFamily = "serif";
        saveSettingsToStorage();
        applySettingsToDOM();
    });
    document.getElementById("selector-font-sans").addEventListener("click", () => {
        state.fontFamily = "sans";
        saveSettingsToStorage();
        applySettingsToDOM();
    });
    
    document.getElementById("btn-font-dec").addEventListener("click", () => {
        if (state.fontSize > 12) {
            state.fontSize -= 2;
            saveSettingsToStorage();
            applySettingsToDOM();
        }
    });
    document.getElementById("btn-font-inc").addEventListener("click", () => {
        if (state.fontSize < 36) {
            state.fontSize += 2;
            saveSettingsToStorage();
            applySettingsToDOM();
        }
    });
    
    document.querySelectorAll(".height-selector").forEach(btn => {
        btn.addEventListener("click", () => {
            state.lineHeight = parseFloat(btn.dataset.height);
            saveSettingsToStorage();
            applySettingsToDOM();
        });
    });
    
    // Sidebar right close button
    document.getElementById("btn-close-info-sidebar").addEventListener("click", () => {
        document.getElementById("info-sidebar").classList.add("collapsed");
    });
    document.getElementById("btn-toggle-info-sidebar").addEventListener("click", () => {
        document.getElementById("info-sidebar").classList.toggle("collapsed");
    });
    
    // Book Selector Select
    document.getElementById("book-select").addEventListener("change", (e) => {
        state.selectedBookId = e.target.value;
        state.selectedChapterIndex = 0;
        loadChapter();
        stopReadingAloud();
    });
    
    // Chapter Pagination Footer
    document.getElementById("btn-prev-chapter").addEventListener("click", () => {
        if (state.selectedChapterIndex > 0) {
            state.selectedChapterIndex--;
            loadChapter();
            stopReadingAloud();
            document.querySelector(".reader-pane").scrollTop = 0;
        }
    });
    document.getElementById("btn-next-chapter").addEventListener("click", () => {
        const book = NOVELS.find(b => b.id === state.selectedBookId);
        if (state.selectedChapterIndex < book.chapters.length - 1) {
            state.selectedChapterIndex++;
            loadChapter();
            stopReadingAloud();
            document.querySelector(".reader-pane").scrollTop = 0;
        }
    });
    
    // Bookmark Chapter Button
    document.getElementById("btn-bookmark-page").addEventListener("click", () => {
        bookmarkCurrentChapter();
    });
    
    // Text-to-Speech (Speak Button)
    document.getElementById("btn-speak").addEventListener("click", () => {
        toggleTextToSpeech();
    });
    
    // Facts Board filtering
    document.querySelectorAll("#facts-categories .filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#facts-categories .filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderFactsBoard(btn.dataset.category);
        });
    });
    
    // Random fact generator actions
    document.getElementById("btn-generate-fact").addEventListener("click", () => {
        generateRandomFact();
    });
    document.getElementById("btn-save-generated-fact").addEventListener("click", () => {
        saveGeneratedFact();
    });
    
    // Scroll progress tracker
    document.querySelector(".reader-pane").addEventListener("scroll", (e) => {
        updateReadingProgress(e.target);
    });
}

// ── Novel Reader Logic ──────────────────────────────────────────────────────
function renderBookSelector() {
    const select = document.getElementById("book-select");
    select.innerHTML = NOVELS.map(book => `
        <option value="${book.id}">${book.title} (${book.author})</option>
    `).join("");
}

function loadChapter() {
    const book = NOVELS.find(b => b.id === state.selectedBookId);
    const chapter = book.chapters[state.selectedChapterIndex];
    
    // Update Chapter titles
    document.getElementById("meta-book-title").innerText = book.title;
    
    // Compute total words
    const textContentStr = chapter.content.join(" ");
    const wordCount = textContentStr.split(/\s+/).length;
    document.getElementById("meta-word-count").innerText = `${wordCount} words`;
    
    // Render text html
    const textArea = document.getElementById("book-text-area");
    let contentHtml = `<h2>${chapter.title}</h2>`;
    
    chapter.content.forEach((para, idx) => {
        contentHtml += `<p id="para-${idx}" data-idx="${idx}">${para}</p>`;
    });
    
    textArea.innerHTML = contentHtml;
    
    // Render chapters list sidebar
    const chapterList = document.getElementById("chapter-list");
    chapterList.innerHTML = book.chapters.map((ch, idx) => `
        <li class="chapter-item ${idx === state.selectedChapterIndex ? 'active' : ''}" data-idx="${idx}">
            <i class="fa-solid ${idx === state.selectedChapterIndex ? 'fa-book-open' : 'fa-book'}"></i>
            ${ch.title.split(":")[0]}
        </li>
    `).join("");
    
    // Click chapter handlers
    chapterList.querySelectorAll(".chapter-item").forEach(item => {
        item.addEventListener("click", () => {
            state.selectedChapterIndex = parseInt(item.dataset.idx);
            loadChapter();
            stopReadingAloud();
            document.querySelector(".reader-pane").scrollTop = 0;
        });
    });
    
    // Set Chapter progress pagination UI
    document.getElementById("footer-chapter-label").innerText = `Chapter ${state.selectedChapterIndex + 1} of ${book.chapters.length}`;
    document.getElementById("btn-prev-chapter").disabled = state.selectedChapterIndex === 0;
    document.getElementById("btn-next-chapter").disabled = state.selectedChapterIndex === book.chapters.length - 1;
    
    // Load context sidebar trivia
    renderTriviaSidebar(chapter.trivia);
    
    // Check if current chapter is bookmarked already
    const bookmarked = state.savedChapters.some(c => c.bookId === state.selectedBookId && c.chapterIdx === state.selectedChapterIndex);
    const bkmkBtn = document.getElementById("btn-bookmark-page");
    if (bookmarked) {
        bkmkBtn.classList.add("active");
        bkmkBtn.querySelector("i").className = "fa-solid fa-bookmark";
    } else {
        bkmkBtn.classList.remove("active");
        bkmkBtn.querySelector("i").className = "fa-regular fa-bookmark";
    }
    
    // Reset reading progress bar
    document.getElementById("reading-progress").style.width = "0%";
}

function updateReadingProgress(target) {
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("reading-progress").style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

// ── Trivia Sidebar Rendering ─────────────────────────────────────────────────
function renderTriviaSidebar(triviaItems) {
    const container = document.getElementById("context-info-area");
    
    // Update Floating Toolbar trivia counter
    const triviaCount = triviaItems ? triviaItems.length : 0;
    document.getElementById("btn-toggle-info-sidebar").querySelector(".btn-text").innerText = `Trivia (${triviaCount})`;
    
    if (!triviaItems || triviaItems.length === 0) {
        container.innerHTML = `
            <div class="empty-sidebar-state">
                <i class="fa-solid fa-ghost"></i>
                <p>No historical context found in this sector. Standard read mode active.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = triviaItems.map(item => {
        let typeIcon = "fa-lightbulb";
        let typeClass = "fact";
        
        if (item.type === "vocab") {
            typeIcon = "fa-language";
            typeClass = "vocab";
        } else if (item.type === "lore") {
            typeIcon = "fa-scroll";
            typeClass = "lore";
        }
        
        return `
            <div class="trivia-card">
                <div class="trivia-card-header ${typeClass}">
                    <i class="fa-solid ${typeIcon}"></i> ${item.label}
                </div>
                <h4>${item.title}</h4>
                <p>${item.text}</p>
            </div>
        `;
    }).join("");
}

// ── Bookmark Current Chapter ──────────────────────────────────────────────
function bookmarkCurrentChapter() {
    const book = NOVELS.find(b => b.id === state.selectedBookId);
    const chapter = book.chapters[state.selectedChapterIndex];
    
    const index = state.savedChapters.findIndex(c => c.bookId === state.selectedBookId && c.chapterIdx === state.selectedChapterIndex);
    const bkmkBtn = document.getElementById("btn-bookmark-page");
    
    if (index > -1) {
        // Remove bookmark
        state.savedChapters.splice(index, 1);
        bkmkBtn.classList.remove("active");
        bkmkBtn.querySelector("i").className = "fa-regular fa-bookmark";
        showNotification("Chapter Bookmark Removed");
    } else {
        // Add bookmark
        state.savedChapters.push({
            bookId: state.selectedBookId,
            bookTitle: book.title,
            chapterIdx: state.selectedChapterIndex,
            chapterTitle: chapter.title,
            timestamp: new Date().toLocaleDateString()
        });
        bkmkBtn.classList.add("active");
        bkmkBtn.querySelector("i").className = "fa-solid fa-bookmark";
        showNotification("Chapter Bookmarked Successfully");
    }
    
    localStorage.setItem("loreleaf_saved_chapters", JSON.stringify(state.savedChapters));
    renderSavedItems();
}

// ── Text To Speech Audio ───────────────────────────────────────────────────
function toggleTextToSpeech() {
    if (state.isSpeaking) {
        stopReadingAloud();
        return;
    }
    
    const book = NOVELS.find(b => b.id === state.selectedBookId);
    const chapter = book.chapters[state.selectedChapterIndex];
    const textToSpeak = chapter.content.join(" ");
    
    if (!window.speechSynthesis) {
        showNotification("Speech synthesis not supported in this browser");
        return;
    }
    
    state.isSpeaking = true;
    const speakBtn = document.getElementById("btn-speak");
    speakBtn.classList.add("active");
    speakBtn.innerHTML = `<i class="fa-solid fa-pause"></i> <span class="btn-text">Stop</span>`;
    
    state.utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Select a suitable reading speed
    state.utterance.rate = 0.95;
    
    state.utterance.onend = () => {
        stopReadingAloud();
    };
    
    state.utterance.onerror = () => {
        stopReadingAloud();
    };
    
    window.speechSynthesis.speak(state.utterance);
    showNotification("Speaking Chapter Text...");
}

function stopReadingAloud() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    state.isSpeaking = false;
    const speakBtn = document.getElementById("btn-speak");
    if (speakBtn) {
        speakBtn.classList.remove("active");
        speakBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span class="btn-text">Listen</span>`;
    }
    state.utterance = null;
}

// ── Facts Board Logic ───────────────────────────────────────────────────────
function renderFactsBoard(filter = "all") {
    const grid = document.getElementById("facts-grid");
    const filtered = filter === "all" ? CURATED_FACTS : CURATED_FACTS.filter(f => f.category === filter);
    
    grid.innerHTML = filtered.map(fact => {
        const isSaved = state.savedFacts.some(sf => sf.id === fact.id);
        
        return `
            <div class="fact-card" data-id="${fact.id}">
                <div class="fact-card-inner">
                    <!-- Front of card -->
                    <div class="fact-card-front">
                        <div class="card-top">
                            <span class="card-category">${fact.category}</span>
                            <button class="card-save-btn ${isSaved ? 'active' : ''}" data-id="${fact.id}" title="Save Fact">
                                <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
                            </button>
                        </div>
                        <h4 class="card-front-title">${fact.title}</h4>
                        <div class="card-click-label">
                            <i class="fa-solid fa-repeat"></i> Click to Reveal
                        </div>
                    </div>
                    <!-- Back of card -->
                    <div class="fact-card-back">
                        <div class="card-top">
                            <span class="card-category">${fact.category}</span>
                        </div>
                        <p class="card-back-text">"${fact.text}"</p>
                        <div class="card-back-footer">
                            Source: ${fact.source}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
    
    // Add Click listener for flip
    grid.querySelectorAll(".fact-card").forEach(card => {
        card.addEventListener("click", (e) => {
            // If user clicked the bookmark button, don't flip
            if (e.target.closest(".card-save-btn")) {
                toggleSaveFact(e.target.closest(".card-save-btn").dataset.id);
                return;
            }
            card.classList.toggle("flipped");
        });
    });
}

function toggleSaveFact(factId) {
    const fact = CURATED_FACTS.find(f => f.id === factId);
    if (!fact) return;
    
    const index = state.savedFacts.findIndex(sf => sf.id === factId);
    
    if (index > -1) {
        state.savedFacts.splice(index, 1);
        showNotification("Fact removed from saved board");
    } else {
        state.savedFacts.push({
            id: fact.id,
            text: fact.text,
            category: fact.category,
            timestamp: new Date().toLocaleDateString()
        });
        showNotification("Fact saved successfully!");
    }
    
    localStorage.setItem("loreleaf_saved_facts", JSON.stringify(state.savedFacts));
    renderFactsBoard(document.querySelector("#facts-categories .filter-btn.active").dataset.category);
    renderSavedItems();
}

// ── Instant Random Fact Generator Logic ────────────────────────────────────
let currentRandomFact = null;

function generateRandomFact() {
    const available = RANDOM_FACTS.filter(f => !currentRandomFact || f.text !== currentRandomFact.text);
    const selected = available[Math.floor(Math.random() * available.length)];
    
    currentRandomFact = selected;
    document.getElementById("generated-fact-text").innerText = `"${selected.text}"`;
    document.getElementById("generated-fact-tag").innerText = selected.tag;
    
    // Check if already saved
    const isSaved = state.savedFacts.some(sf => sf.text === selected.text);
    document.getElementById("btn-save-generated-fact").disabled = isSaved;
    document.getElementById("btn-save-generated-fact").innerHTML = isSaved ? `
        <i class="fa-solid fa-check"></i> Saved
    ` : `
        <i class="fa-solid fa-plus"></i> Save Fact
    `;
}

function saveGeneratedFact() {
    if (!currentRandomFact) return;
    
    // Generate unique ID based on timestamp
    const pseudoId = `rand-${Date.now()}`;
    
    state.savedFacts.push({
        id: pseudoId,
        text: currentRandomFact.text,
        category: currentRandomFact.tag,
        timestamp: new Date().toLocaleDateString()
    });
    
    localStorage.setItem("loreleaf_saved_facts", JSON.stringify(state.savedFacts));
    showNotification("Random Fact saved successfully!");
    
    document.getElementById("btn-save-generated-fact").disabled = true;
    document.getElementById("btn-save-generated-fact").innerHTML = `<i class="fa-solid fa-check"></i> Saved`;
    
    renderSavedItems();
    renderFactsBoard(document.querySelector("#facts-categories .filter-btn.active").dataset.category);
}

// ── Saved Bindings Section Rendering ────────────────────────────────────────
function renderSavedItems() {
    const chaptersList = document.getElementById("saved-chapters-list");
    const factsList = document.getElementById("saved-facts-list");
    
    // Render Chapters Bookmarks
    if (state.savedChapters.length === 0) {
        chaptersList.innerHTML = `<p class="empty-state">No chapters bookmarked yet. Use the bookmark button inside the Novel Reader.</p>`;
    } else {
        chaptersList.innerHTML = state.savedChapters.map(ch => `
            <div class="saved-item-card">
                <div class="saved-card-header">
                    <span class="saved-card-tag">${ch.bookTitle.split("'s")[0]}</span>
                    <button class="saved-remove-btn" onclick="removeBookmarkedChapter('${ch.bookId}', ${ch.chapterIdx})" title="Remove Bookmark">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="saved-card-content">
                    <strong>${ch.chapterTitle}</strong>
                </div>
                <div class="saved-card-footer">
                    <span>Added: ${ch.timestamp}</span>
                    <a href="#" class="saved-card-link" onclick="loadBookmarkedChapter('${ch.bookId}', ${ch.chapterIdx})">
                        Read Now <i class="fa-solid fa-arrow-right-to-bracket"></i>
                    </a>
                </div>
            </div>
        `).join("");
    }
    
    // Render Saved Facts
    if (state.savedFacts.length === 0) {
        factsList.innerHTML = `<p class="empty-state">No facts saved yet. Add some from the Facts Board or the random generator!</p>`;
    } else {
        factsList.innerHTML = state.savedFacts.map(fact => `
            <div class="saved-item-card">
                <div class="saved-card-header">
                    <span class="saved-card-tag">${fact.category}</span>
                    <button class="saved-remove-btn" onclick="removeSavedFact('${fact.id}')" title="Remove Fact">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="saved-card-content">
                    <p class="font-serif">"${fact.text}"</p>
                </div>
                <div class="saved-card-footer">
                    <span>Added: ${fact.timestamp}</span>
                </div>
            </div>
        `).join("");
    }
}

// Global functions linked to generated element clicks
window.loadBookmarkedChapter = (bookId, chapterIdx) => {
    state.selectedBookId = bookId;
    state.selectedChapterIndex = chapterIdx;
    
    // Update select element
    document.getElementById("book-select").value = bookId;
    
    loadChapter();
    
    // Force redirect to reader section
    document.querySelectorAll("#main-nav .nav-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("nav-btn-reader").classList.add("active");
    document.querySelectorAll(".app-section").forEach(sec => sec.classList.remove("active"));
    document.getElementById("section-reader").classList.add("active");
    state.activeSection = "section-reader";
};

window.removeBookmarkedChapter = (bookId, chapterIdx) => {
    const idx = state.savedChapters.findIndex(c => c.bookId === bookId && c.chapterIdx === chapterIdx);
    if (idx > -1) {
        state.savedChapters.splice(idx, 1);
        localStorage.setItem("loreleaf_saved_chapters", JSON.stringify(state.savedChapters));
        renderSavedItems();
        showNotification("Bookmark Removed");
        
        // If current chapter page is showing, sync active button
        if (state.selectedBookId === bookId && state.selectedChapterIndex === chapterIdx) {
            const bkmkBtn = document.getElementById("btn-bookmark-page");
            bkmkBtn.classList.remove("active");
            bkmkBtn.querySelector("i").className = "fa-regular fa-bookmark";
        }
    }
};

window.removeSavedFact = (factId) => {
    const idx = state.savedFacts.findIndex(sf => sf.id === factId);
    if (idx > -1) {
        state.savedFacts.splice(idx, 1);
        localStorage.setItem("loreleaf_saved_facts", JSON.stringify(state.savedFacts));
        renderSavedItems();
        showNotification("Fact Removed");
        
        // Update facts board cards and generator sync
        renderFactsBoard(document.querySelector("#facts-categories .filter-btn.active").dataset.category);
        generateRandomFact();
    }
};

// ── Notification Toast System ──────────────────────────────────────────────
function showNotification(message) {
    const container = document.getElementById("notification-container");
    const toast = document.createElement("div");
    toast.className = "notification";
    toast.innerHTML = `<i class="fa-solid fa-circle-check text-accent"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Trigger animation slide in
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 350);
    }, 3000);
}
