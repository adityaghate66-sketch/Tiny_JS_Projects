# 🚀 Phase 2: Advanced Tool Suite

A comprehensive collection of JavaScript tools built for GSoC 2027 preparation.

## 📂 Features

- ✅ **LocalStorage Persistence** - Data survives page refresh
- ✅ **Export Results** - Download calculations as PDF/JSON
- ✅ **Modular Architecture** - Clean, maintainable code
- ✅ **Unit Testing** - Jest test coverage
- ✅ **Modern UI** - Dark/Light mode + animations

## 🛠️ Installation

```bash
npm install
npm run dev
```

## 📊 Available Tools

| Tool | Purpose | Status |
|------|---------|--------|
| Age Calculator | Calculate age from birthdate | ✅ Phase 2 |
| Temperature Converter | C/F/K conversion | ✅ Phase 2 |
| Weight Converter | Kg/Lbs/Gram conversion | ✅ Phase 2 |
| Tip Calculator | Bill + tip calculation | ✅ Phase 2 |
| Currency Converter | Live exchange rates | 🔧 Planned |

## 🧪 Running Tests

```bash
npm test
npm run test:watch
```

## 🎯 GSoC 2027 Readiness

- [x] Clean code structure
- [x] Unit tests implemented
- [x] Documentation complete
- [x] Responsive design
- [ ] Contribution guidelines (coming soon)

## 📁 Project Structure

```
phase2-tools-suite/
├── index.html          # Modern landing page
├── app.js              # All calculators logic
├── styles.css          # Enhanced styling
├── package.json        # Testing & dev dependencies
├── README.md           # Full documentation
├── utils/
│   ├── storage.js      # LocalStorage manager
│   ├── export.js       # PDF/CSV export
│   └── validators.js   # Input validation
└── tools/
    ├── calculator.js   # Base calculator class
    ├── age.js          # Age calculator
    ├── tip.js          # Tip calculator
    └── converter.js    # Unit converter base
```