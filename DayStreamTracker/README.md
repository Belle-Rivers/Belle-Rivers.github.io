# DayStreamTracker

> Track your daily streams/tasks with a clean, responsive UI and lightweight client-side logic.

---

## 🧭 Project Synopsis
DayStreamTracker is a lightweight front-end application that helps users log, view, and manage day-by-day stream/task entries directly in the browser. It emphasizes clarity, speed, and simplicity—ideal for quick personal tracking without backend setup.

---

## 🎯 Project Goal
- Provide a fast, intuitive interface for creating and reviewing daily entries.
- Maintain zero-backend complexity using browser storage (if implemented) and vanilla web technologies.
- Offer a clean, responsive layout that works on phones and laptops.
- Serve as a foundation that I can extend with more advanced features later.

---

## 🧪 Usage
1. Open `index.html` in any modern browser.
2. Interact with the UI to add/view daily entries (e.g., tasks, durations, notes—depending on current implementation in `script.js`).
3. Your data persists for the session or via localStorage (if implemented).

If deploying:
- You can host the three static files (`index.html`, `styles.css`, `script.js`) on any static hosting (e.g., GitHub Pages, Netlify, Vercel).

---

## 🏗️ Project Structure
```
/ (root)
├── index.html     # App shell, root markup, and component placeholders
├── styles.css     # Global styles, layout, responsive rules
└── script.js      # App logic: event handling, state mgmt, rendering helpers
```

---

## 🧰 Technologies Used
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Runtime**: Browser (no backend required)
- **Libraries**: None (vanilla JS/CSS) unless specified in code
- **Storage**: LocalStorage (if implemented) for persistence

---

## 🔍 Technical Details & Key Functions
Below are typical functions and patterns present in a minimal DayStreamTracker. Exact names may vary based on `script.js`:

- **Initialization**
  - `init()` — Sets up event listeners, loads initial state, triggers first render.

- **State Management**
  - `loadState()` — Reads existing entries from `localStorage` or initializes defaults.
  - `saveState(state)` — Writes current entries to `localStorage` (if enabled).
  - In-memory state object (e.g., `{ entries: [], filter: { date: ... } }`).

- **Entry CRUD**
  - `addEntry(entry)` — Adds a new daily entry (fields may include `date`, `title`, `notes`, `duration`).
  - `updateEntry(id, patch)` — Updates fields for an existing entry.
  - `deleteEntry(id)` — Removes an entry by ID.

- **Rendering**
  - `renderEntries(list)` — Renders the list of entries into the DOM.
  - `renderEmptyState()` — Shows an empty state message when no data exists.

- **Utilities**
  - `formatDate(date)` — Normalizes date display.
  - `generateId()` — Creates stable identifiers for entries.

If your current `script.js` differs, align the names above to your actual implementations. These function names are recommendations and are commonly used in similar apps for clarity and maintainability.

---

## ✅ Strengths / Good Points
- **Lightweight**: Zero external dependencies; quick to load and easy to host.
- **Maintainable**: Clear separation of HTML (structure), CSS (presentation), and JS (logic).
- **Extensible**: Straightforward state and render flow make it easy to add features.
- **Responsive**: Designed for comfortable use on phones and laptops.
- **Accessible-first mindset**: Semantic HTML and focusable interactive elements (recommended patterns).

---

## 🖥️ UI/UX Preferences
- **Minimal, readable typography** with high-contrast colors and adequate spacing.
- **Clear affordances** for actions (add, edit, delete). Use descriptive button labels and visible hover/focus states.
- **Non-intrusive feedback**: Use subtle toasts or inline messages for success/errors.
- **Consistent spacing scale** (e.g., 4/8px) and component sizing for visual rhythm.
- **Keyboard accessibility**: Focus outlines preserved; actionable elements tabbable.

---

## 📱 Responsiveness
- **Mobile-first CSS** with fluid containers and stack-to-row layout progression.
- **Small screens (phones)**: Single-column layout, large tap targets, sticky add button optional.
- **Medium/Large screens (laptops/desktop)**: Multi-column list, side panel for details (if present), comfortable density.
- Use media queries (e.g., `@media (min-width: 640px)` and `@media (min-width: 1024px)`) to adjust typography and layout.

---

## 🧭 Suggested Screenshots & Branding
- Place screenshots in a `/docs` or `/assets` folder.
- Recommended placements in README:
  - App hero screenshot here:

    ![App Hero Screenshot](./docs/screenshot-hero.png)

  - Entry list view:

    ![Entries List](./docs/screenshot-list.png)

- You may include a simple text-based logo at the top or an SVG logo in `/assets/logo.svg`:

  ```html
  <!-- Place in index.html header -->
  <img src="./assets/logo.svg" alt="DayStreamTracker logo" height="48" />
  <h1 class="brand">DayStreamTracker</h1>
  ```

---

## 🚀 Future Enhancements
- **Data Persistence**: Robust localStorage schema with migrations.
- **Import/Export**: JSON/CSV export and import for portability.
- **Filtering & Search**: By date range, tags, keywords.
- **Analytics**: Daily/weekly summaries and charts (e.g., via Chart.js or lightweight custom plots).
- **PWA Support**: Offline capability and installable app manifest.
- **Theming**: Light/Dark mode toggle persisted per user preference.
- **Accessibility Audits**: Automated checks (e.g., axe) and improved semantics/ARIA.

This work can be updated and reused in future projects by me.

---

## 📦 How to Contribute (Internal Guidance)
- Since this repository is read-only for external users, contributions are internal only.
- Follow semantic commits and keep PRs scoped (single feature/fix per PR).
- Add/update tests if you introduce logic with complexity (where applicable).

---

## 🧪 Success Criteria / Quality Checks
- Loads without console errors in latest Chrome, Firefox, and Safari.
- Responsive layout verified at 375px, 768px, 1024px, and 1440px widths.
- Basic accessibility: tabbable controls, sufficient color contrast, descriptive labels.
- No 3rd-party runtime dependencies unless explicitly documented.
- If localStorage is used, data survives page reloads and schema changes are safe.

---

## 📄 Copyright & Usage Restrictions
Copyright (c) 2026 Rawan El Shenieky

All rights reserved.

This repository is provided for viewing and evaluation purposes only.

No permission is granted to copy, modify, or redistribute this code.

---

## 📜 License
This is a restricted, non-open-source repository. No license is granted beyond the usage restrictions above.

---

## 🧾 Credits
- Design and development by Rawan El Shenieky.
- Built with vanilla web technologies for portability and simplicity.
