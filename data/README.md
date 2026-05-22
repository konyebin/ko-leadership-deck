# Leadership content database

`leadership-db.json` is the **source of truth** for Kenneth Onyebinachi’s leadership story site. The webpage should reflect this file—not ad-hoc edits that drift from the deck or LinkedIn.

## Schema overview

| Entity | Purpose |
|--------|---------|
| `meta` | Version, sources, LinkedIn URL, verification notes |
| `person` | Identity, location, education, title, portrait asset rules |
| `slides` | Per-slide purpose and **image usage rules** (slide 3 = interests only, slide 4 = bio/portrait) |
| `personal` | About me, interests, focus areas |
| `leadership_principles` | EMATTAA |
| `career_path` | Employers, roles, periods, achievements |
| `metrics` | Quantified outcomes with exact deck wording |
| `leadership_style` | How I Stand Out content |
| `career_vision` | Aspirational 2023–2028 map (not current HR status) |
| `plan_30_60_90` | Target enablement role readiness |
| `today` | Current role leadership dimensions |
| `legacy` | Legacy narrative + Dag Peak quote |
| `narrative` | SUCCESS mapping + core message |
| `corrections_log` | Audit trail of fixes |

## Verification fields

- `verified_via: deck_slide_*` — from KOLeadershipDeck.pptx
- `verified_via: public_secondary` — third-party mention (e.g. Cisco blog)
- LinkedIn fields should be checked manually at https://www.linkedin.com/in/kenneth-onyebinachi-jr/ and updated in this JSON when confirmed

## Portrait rule

**Only** `person.portrait_asset.file` (`kenneth-bio.jpg` from slide 4 / `image23.png`) may appear on the site.

**Never** use media listed under `slides.3.images` (Personal Interests / Motivators collage).

## Updating

1. Edit `leadership-db.json`
2. Sync `index.html` (or future renderer) to match
3. Add an entry to `corrections_log` when fixing inaccuracies
