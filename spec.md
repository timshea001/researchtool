TECHNICAL SPECIFICATION: Word Association Research Tool PWA
PROJECT OVERVIEW
Build a Progressive Web App (PWA) that appears to be a browser navigating to a research tool, but actually functions as a mentalism reveal mechanism. The app uses a fake address bar as a secret input method to "peek" the spectator's word, then reveals it through a believable AI prediction interface.

TECHNICAL REQUIREMENTS
Platform

Progressive Web App (installable to home screen)
Mobile-first design (optimized for iPhone)
Works offline
No backend required (client-side only)

Core Technology

HTML5, CSS3, JavaScript
Responsive design
Touch-optimized interactions
Smooth animations/transitions


SCREEN-BY-SCREEN SPECIFICATIONS
SCREEN 1: BROWSER HOME
Visual Elements:

Mimics Safari/Chrome mobile browser interface
Status bar (time, battery, signal - can be static/fake)
Address bar (grayed out, inactive state)
Clean white/gray background
Optional: Generic "Favorites" or bookmark icons below

Interaction:

Tap address bar to activate → proceed to Screen 2

Design Notes:

Must look like actual mobile browser
Address bar should say something neutral like "Search or enter website"


SCREEN 2: FAKE ADDRESS BAR (SECRET PEEK INPUT)
Visual Elements:

Address bar becomes active (white background, cursor blinking)
Mobile keyboard appears (standard system keyboard)
As user types, display fake URL formation: research.anthropic-lab.ai

Secret Functionality:
CRITICAL: Whatever the user types here is stored as the "peeked word"

User types: M → Display shows: r
User types: E → Display shows: re
User types: M → Display shows: res
etc.

The display progressively builds: r → re → res → rese → resea → research.anthropic-lab.ai
Logic:

Actual input: Store each character in hidden variable
Display output: Animate through predefined URL string character by character
Timing: Each keystroke advances display by one character of fake URL
Once user is done typing their word, they press "Go" or "Enter"

Stored Data:
javascriptlet peekedWord = ""; // This captures their actual word
// e.g., if they wrote "MEMORY" on post-it, user types: M-E-M-O-R-Y
```

---

### SCREEN 3: LOADING STATE
**Visual Elements:**
- Standard browser loading animation
- Progress bar at top of screen
- URL displayed in address bar: `research.anthropic-lab.ai`

**Timing:**
- 1.5-2 seconds loading animation

---

### SCREEN 4: RESEARCH TOOL LANDING PAGE
**Layout:**

**HEADER:**
```
Anthropic Research Lab
Word Association Study
```

**SUBHEADER:**
```
Toronto Installation Project | Beta v0.7
```

**BODY (centered):**
```
This algorithm predicts which word a participant selected based on 
semantic distance analysis of an "unrelated" word they provide.

INSTRUCTIONS:
Enter a word that feels completely unrelated to your chosen word, 
then submit for analysis.
```

**INPUT AREA:**
- Large text input field
- Placeholder text: "Type unrelated word..."
- Clean, minimal styling

**BUTTON:**
- Large, prominent button: "ANALYZE"
- Primary color (Anthropic orange/coral or blue)

**FOOTER (small text):**
```
Developed by [Artist Name] | Data collected anonymously
```

**Design Style:**
- Clean, modern, minimal
- Similar to Anthropic's actual design language
- Professional research tool aesthetic
- White/light gray background
- Dark text, good contrast

---

### SCREEN 5-6: DEMO MODE (First Demo)
**User Action (Performer):**
- Performer types: "Cloud"
- Presses ANALYZE

**Loading State:**
- Button shows spinner
- 1-2 second delay

**Result Display:**
```
Based on semantic analysis:

[Large, bold text]
Predicted word: RHYTHM

[Smaller text below]
Confidence: 87%
Semantic distance: 4.2σ
Button at bottom:

"RESET" button (returns to input screen)

Demo Word Pool (for demos only):
javascriptconst demoWords = [
  "RHYTHM", "TEXTURE", "IMPULSE", "SIGNAL", 
  "DRIFT", "CLARITY", "ECHO", "TENSION", 
  "BALANCE", "SPARK", "FLOW", "PATTERN"
];
```

**Logic:**
- When performer is demonstrating, randomly select from demoWords array
- Generate random confidence percentage (85-95%)
- Generate random semantic distance (3.5-5.0σ)

---

### SCREEN 7-9: DEMO MODE (Second Demo)
**Repeat same flow:**
- Performer types: "Bicycle"
- ANALYZE
- Result shows different random word from demo pool
- Different confidence/distance values

**Purpose:**
Establishes pattern that tool is "working" before handing to spectator

---

### SCREEN 10-11: SPECTATOR REVEAL
**User Action (Spectator):**
- Spectator types their unrelated word (can be ANYTHING)
- Presses ANALYZE

**Loading State:**
- Same loading animation
- 1-2 second delay

**Result Display:**
```
Based on semantic analysis:

[Large, bold text]
Predicted word: [THEIR PEEKED WORD]

[Smaller text below]
Confidence: 94%
Semantic distance: 4.7σ
Logic:

Ignore whatever they typed
Display the peekedWord variable from Screen 2
Show slightly higher confidence (92-96%)
Show believable semantic distance


DATA FLOW LOGIC
State Management
javascript// Global state
let peekedWord = "";           // Set during Screen 2
let isPerformerDemo = true;    // Toggle between demo/reveal mode
let demoCount = 0;             // Track number of demos

// Demo word pool
const demoWords = [
  "RHYTHM", "TEXTURE", "IMPULSE", "SIGNAL", 
  "DRIFT", "CLARITY", "ECHO", "TENSION", 
  "BALANCE", "SPARK", "FLOW", "PATTERN"
];
```

### Key Functions

**Function: handleAddressBarInput()**
```
On each keystroke:
  - Store actual character in peekedWord
  - Display next character of fake URL
  - When Enter/Go pressed → navigate to Screen 3
```

**Function: handleAnalyze()**
```
If isPerformerDemo == true:
  - Select random word from demoWords
  - Generate random confidence (85-95%)
  - Display result
  - Increment demoCount
Else (spectator turn):
  - Display peekedWord
  - Generate confidence (92-96%)
  - Display result
```

**Function: handleReset()**
```
- Clear input field
- Return to input screen (Screen 4)
- Keep peekedWord stored
- Keep isPerformerDemo state
```

**Function: fullReset()**
```
- Clear peekedWord
- Reset isPerformerDemo to true
- Reset demoCount to 0
- Return to browser home (Screen 1)

RESET MECHANISMS
Soft Reset (between demos/reveal)

Trigger: Press "RESET" button
Action: Returns to input screen, keeps peeked word stored
Use: Between performer demos and spectator reveal

Hard Reset (between spectators)

Trigger: Triple-tap the header OR shake phone (if feasible)
Action: Complete state reset, back to Screen 1
Use: Preparing for next spectator

Visual Indicator (Optional)

Small dot or icon in corner that changes color when peeked word is loaded
Only visible to performer, subtle


VISUAL DESIGN GUIDELINES
Color Palette
Option 1 (Anthropic-inspired):

Primary: #D97757 (coral/orange)
Background: #FFFFFF
Text: #1A1A1A
Secondary: #F5F5F5 (light gray)

Option 2 (Clean Research Tool):

Primary: #0066CC (blue)
Background: #FFFFFF
Text: #333333
Accent: #F0F0F0

Typography

Headers: Sans-serif, bold, 24-28px
Body: Sans-serif, regular, 16-18px
Results (word reveal): Bold, 32-36px
Confidence/metrics: Regular, 14px, gray

Spacing

Generous padding around all elements
Mobile-optimized touch targets (minimum 44px)
Centered layout, max-width ~600px

Animations

Smooth transitions between screens (300ms)
Loading spinner: subtle rotation
Button press: slight scale/shadow effect
Results: fade-in animation


TECHNICAL IMPLEMENTATION NOTES
PWA Manifest
json{
  "name": "Research Tool",
  "short_name": "Research",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#D97757",
  "icons": [...]
}
Critical Features

Offline capability - Service worker caches all assets
No external dependencies - All JS/CSS inline or bundled
Mobile-optimized - Touch events, prevent zoom on inputs
Browser mimicry - Must look authentic
Smooth performance - No lag, instant responses

Security/Privacy

No data leaves device
No analytics/tracking
No network calls after initial load
Clear local storage on hard reset


USER FLOW SUMMARY

Performer opens app → Browser home screen
Tap address bar → Secretly type spectator's word while appearing to type URL
"Navigate" to site → Loading animation
Land on research tool → Clean, professional interface
Demo #1 → Type "Cloud" → Random result from demo pool
Demo #2 → Type "Bicycle" → Different random result
Hand phone to spectator → "Your turn"
Spectator types → Their "unrelated word"
Reveal → Display their actual word from step 2
Hard reset → Ready for next person


TESTING CHECKLIST

 Address bar peek works on iOS Safari
 Address bar peek works on Chrome Android
 Keyboard doesn't cause layout issues
 Loading animations are smooth
 Demo words never repeat in same session
 Reset button works correctly
 Hard reset clears all state
 PWA installs to home screen
 Works offline after first load
 Touch targets are large enough
 Text is readable on small screens
 App looks like legitimate research tool


STRETCH FEATURES (Optional)
Version 1.1 Enhancements:

Add slight typing sound effects
Vibration feedback on button press
More sophisticated loading messages
"Analyzing neural patterns..." type messages
CSV export button (fake, for authenticity)
About page with fake research details
