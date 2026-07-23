# Logo sourcing log

Tracker for every gated brand asset on this site. Updated as the PR & Outreach department sources each logo.

## How to use this file

When sourcing a recruiter, school, or ranking-authority logo, add a row below recording:

1. **Company / authority** — the brand name
2. **Date sourced** — when the file was downloaded
3. **Source URL** — where it came from (official press kit, brand guidelines page, or direct from the brand's marketing contact)
4. **License terms** — what use is permitted (institutional partner use, attribution required, etc.)
5. **Contact who approved** — name and email of the brand-side contact if approval was via email rather than a public press kit
6. **Path on disk** — where the file lives in this repo

## Recruiter logos

| Company | Date | Source | License | Approved by | Path |
|---|---|---|---|---|---|
| _example_ | _2026-01-15_ | _https://www.deloitte.com/global/en/about/brand.html_ | _Partner use permitted in institutional materials_ | _Public press kit_ | _public/logos/recruiters/deloitte.svg_ |
|  |  |  |  |  |  |

## Business school logos

| School | Date | Source | License | Approved by | Path |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## Ranking authorities

| Authority | Date | Source | License | Approved by | Path |
|---|---|---|---|---|---|
| _example_ | _2026-02-10_ | _Written permission from NIRF Secretariat_ | _Display in institutional context permitted_ | _name@nirfindia.org_ | _public/logos/rankings/nirf.svg_ |
|  |  |  |  |  |  |

## SVC and University of Delhi crests

| Asset | Date sourced | Source | Approver | Path |
|---|---|---|---|---|
| SVC crest | 2025-12 | Sri Venkateswara College Principal's Office | Faculty Convener | public/logos/svc-crest.png |
| University of Delhi crest | Pending | DU Central Communications Office |  | (add to public/logos/du-crest.svg) |

## Process notes

- Never download a logo from search results, third-party aggregators, or social media profiles. The file must come from the brand's own controlled distribution channel (press kit, brand guidelines page, or direct from a verified brand contact via email).
- When a brand's press kit page exists but is unclear about partner use, send a confirmation email. Save the reply on the documentation drive.
- The file must match the slug in `src/lib/data/partners.ts` (or `notable-alumni.ts` for schools, `rankings.ts` for badges). If you must add a new slug, edit the data file in the same pull request.
- Prefer SVG. PNG is acceptable if the brand only supplies raster files. Save at 2x the highest display size used in the project.
- Once a logo is dropped at the expected path, the component renders it on next build. No code changes needed.

## Sign-off

Sourced logos are reviewed by:
- The Faculty Convener (Dr. Abhishek Malhotra) for recruiter and ranking-authority assets
- The President for alumni-related school logos
- The PR & Outreach department head for routine recruiter logo additions

A monthly audit reconciles `docs/asset-checklist.md` (status per asset) with this log (license details per asset).
