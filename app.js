// State Management
let peekedWord = '';
let demoCount = 0;
let displayIndex = 0;
let usedDemoWords = [];
let headerTapCount = 0;
let headerTapTimer = null;

// Constants
const TARGET_URL = 'research.anthropic-lab.ai';
const DEMO_WORDS = [
    'RHYTHM', 'TEXTURE', 'IMPULSE', 'SIGNAL',
    'DRIFT', 'CLARITY', 'ECHO', 'TENSION',
    'BALANCE', 'SPARK', 'FLOW', 'PATTERN'
];
const DEMOS_BEFORE_REVEAL = 2;

// DOM Elements
const screens = {
    browserHome: document.getElementById('screen-browser-home'),
    addressInput: document.getElementById('screen-address-input'),
    loading: document.getElementById('screen-loading'),
    research: document.getElementById('screen-research'),
    results: document.getElementById('screen-results')
};

const elements = {
    addressBarHome: document.getElementById('address-bar-home'),
    urlDisplay: document.getElementById('url-display'),
    hiddenInput: document.getElementById('hidden-input'),
    cancelBtn: document.getElementById('cancel-btn'),
    goBtn: document.getElementById('go-btn'),
    wordInput: document.getElementById('word-input'),
    analyzeBtn: document.getElementById('analyze-btn'),
    predictedWord: document.getElementById('predicted-word'),
    confidence: document.getElementById('confidence'),
    semanticDistance: document.getElementById('semantic-distance'),
    resetBtn: document.getElementById('reset-btn'),
    researchHeader: document.getElementById('research-header'),
    resultsHeader: document.getElementById('results-header'),
    peekIndicator: document.getElementById('peek-indicator')
};

// Screen Navigation
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

// Initialize
function init() {
    setupEventListeners();
    updatePeekIndicator();
}

function setupEventListeners() {
    // Screen 1: Browser Home - tap address bar
    elements.addressBarHome.addEventListener('click', handleAddressBarClick);

    // Screen 2: Address Input
    elements.cancelBtn.addEventListener('click', handleCancel);
    elements.goBtn.addEventListener('click', handleGoButton);
    elements.hiddenInput.addEventListener('input', handleAddressInput);
    elements.hiddenInput.addEventListener('keydown', handleAddressKeydown);

    // Screen 4: Research Tool
    elements.analyzeBtn.addEventListener('click', handleAnalyze);
    elements.wordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleAnalyze();
        }
    });

    // Screen 5: Results
    elements.resetBtn.addEventListener('click', handleSoftReset);

    // Hard reset: Triple-tap header
    elements.researchHeader.addEventListener('click', handleHeaderTap);
    elements.resultsHeader.addEventListener('click', handleHeaderTap);

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service worker registration failed:', err);
        });
    }
}

// Screen 1 → Screen 2: Address bar clicked
function handleAddressBarClick() {
    showScreen('addressInput');
    peekedWord = '';
    displayIndex = 0;
    elements.urlDisplay.textContent = '';
    elements.hiddenInput.value = '';

    // Focus hidden input to trigger keyboard
    setTimeout(() => {
        elements.hiddenInput.focus();
    }, 100);
}

// Screen 2: Cancel button
function handleCancel() {
    showScreen('browserHome');
    elements.hiddenInput.blur();
}

// Screen 2: Handle typing in address bar (peek mechanism)
function handleAddressInput(e) {
    const inputValue = elements.hiddenInput.value;

    // Store the actual typed character
    if (inputValue.length > peekedWord.length) {
        const newChar = inputValue[inputValue.length - 1];
        peekedWord += newChar;
        displayIndex++;
    } else if (inputValue.length < peekedWord.length) {
        // Handle backspace
        peekedWord = peekedWord.slice(0, -1);
        displayIndex = Math.max(0, displayIndex - 1);
    }

    // Display fake URL character by character
    elements.urlDisplay.textContent = TARGET_URL.substring(0, displayIndex);
}

// Screen 2: Handle Enter/Go key
function handleAddressKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        elements.hiddenInput.blur();
        navigateToSite();
    }
}

// Screen 2: Handle Go button tap
function handleGoButton() {
    elements.hiddenInput.blur();
    navigateToSite();
}

// Screen 2 → Screen 3 → Screen 4: Navigate to fake site
function navigateToSite() {
    // Update peek indicator
    updatePeekIndicator();

    // Show loading screen
    showScreen('loading');

    // Reset loading bar animation
    const loadingProgress = document.querySelector('.loading-progress');
    loadingProgress.style.animation = 'none';
    loadingProgress.offsetHeight; // Trigger reflow
    loadingProgress.style.animation = 'loading 1.8s ease-out forwards';

    // After loading, show research tool
    setTimeout(() => {
        showScreen('research');
        elements.wordInput.value = '';
        elements.wordInput.focus();
    }, 1800);
}

// Update peek indicator
function updatePeekIndicator() {
    if (peekedWord.length > 0) {
        elements.peekIndicator.classList.add('loaded');
    } else {
        elements.peekIndicator.classList.remove('loaded');
    }
}

// Screen 4: Handle Analyze button
function handleAnalyze() {
    const inputWord = elements.wordInput.value.trim();
    if (!inputWord) return;

    // Show loading state on button
    const originalText = elements.analyzeBtn.textContent;
    elements.analyzeBtn.innerHTML = '<div class="btn-spinner"></div>';
    elements.analyzeBtn.classList.add('loading');
    elements.analyzeBtn.disabled = true;

    // Simulate processing
    setTimeout(() => {
        let resultWord, confidence, semanticDistance;

        if (demoCount < DEMOS_BEFORE_REVEAL) {
            // Demo mode: show random word
            resultWord = getRandomDemoWord();
            confidence = getRandomInt(85, 95);
            semanticDistance = (Math.random() * 1.5 + 3.5).toFixed(1);
            demoCount++;
        } else {
            // Reveal mode: show peeked word
            resultWord = peekedWord.toUpperCase() || 'ERROR';
            confidence = getRandomInt(92, 96);
            semanticDistance = (Math.random() * 0.5 + 4.5).toFixed(1);
        }

        // Display results
        elements.predictedWord.textContent = resultWord;
        elements.confidence.textContent = confidence + '%';
        elements.semanticDistance.innerHTML = semanticDistance + '&sigma;';

        // Reset button state
        elements.analyzeBtn.textContent = originalText;
        elements.analyzeBtn.classList.remove('loading');
        elements.analyzeBtn.disabled = false;

        showScreen('results');
    }, 1500);
}

// Get random demo word (avoid repeats in session)
function getRandomDemoWord() {
    const availableWords = DEMO_WORDS.filter(w => !usedDemoWords.includes(w));

    if (availableWords.length === 0) {
        usedDemoWords = [];
        return DEMO_WORDS[Math.floor(Math.random() * DEMO_WORDS.length)];
    }

    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedDemoWords.push(word);
    return word;
}

// Random integer in range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Soft reset: back to input screen, keep peeked word
function handleSoftReset() {
    showScreen('research');
    elements.wordInput.value = '';
    elements.wordInput.focus();
}

// Hard reset: full state reset, back to browser home
function handleHardReset() {
    peekedWord = '';
    demoCount = 0;
    displayIndex = 0;
    usedDemoWords = [];
    updatePeekIndicator();
    showScreen('browserHome');
}

// Triple-tap header for hard reset
function handleHeaderTap() {
    headerTapCount++;

    if (headerTapTimer) {
        clearTimeout(headerTapTimer);
    }

    if (headerTapCount >= 3) {
        headerTapCount = 0;
        handleHardReset();
    } else {
        headerTapTimer = setTimeout(() => {
            headerTapCount = 0;
        }, 500);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
