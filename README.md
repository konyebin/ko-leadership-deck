# Kenneth Onyebinachi — Leadership Story

A single-page scrolling narrative for interview and leadership conversations. Content is verified against **`Kenneth_Onyebinachi_Resume_SE_Manager.docx`** (primary source), supplemented by `KOLeadershipDeck.pptx` where noted. Structured with **SUCCESS** (*Made to Stick*). Source of truth: **`data/leadership-db.json`**.

**Images:** Bio headshot only from slide 4 (`kenneth-bio.jpg`). Slide 3 motivator photos appear only in the Personal Interests section (`assets/images/motivators/`). See `REVIEW-hiring-manager.md` for recruiter-style review. Confirm titles and dates against [LinkedIn](https://www.linkedin.com/in/kenneth-onyebinachi-jr/).

## Open locally

```bash
open /Users/konyebin/CLAUDE/ko-leadership-deck/index.html
```

Or serve with a local HTTP server (optional, for consistent font/asset loading):

```bash
cd /Users/konyebin/CLAUDE/ko-leadership-deck
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Keyboard shortcuts

- **↓ / Page Down** — next chapter
- **↑ / Page Up** — previous chapter

## Live site (GitHub Pages)

**https://konyebin.github.io/ko-leadership-deck/**

Repo: https://github.com/konyebin/ko-leadership-deck

Open that URL on any computer or phone (no install required). First deploy after a push may take 1–2 minutes.

### Update the live site

```bash
cd /Users/konyebin/CLAUDE/ko-leadership-deck
git add -A
git commit -m "Describe your change"
git push
```

## Project structure

```
ko-leadership-deck/
├── index.html
├── css/styles.css
├── js/main.js
├── data/
│   ├── leadership-db.json   # Structured content database
│   └── README.md
├── assets/images/
│   └── kenneth-bio.jpg      # Only portrait (slide 4)
├── REVIEW-hiring-manager.md
├── .nojekyll
└── README.md
```

## Source deck

Original: `~/Library/CloudStorage/OneDrive-Cisco/Desktop/KOLeadershipDeck.pptx`

Raw extracted media is in `assets/images/raw/` (not required for deployment; can be omitted when publishing).
