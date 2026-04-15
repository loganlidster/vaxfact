# VaxFact.net — Deployment & DNS Handoff Guide

## What Has Been Completed

| Item | Status | Details |
|------|--------|---------|
| GitHub Repository | LIVE | https://github.com/loganlidster/vaxfact |
| Vercel Project | LIVE | Project ID: prj_82YUVx5AQpVWfCi76YG5iomEql6h |
| Deployment | READY | Auto-deploys on every main branch push |
| Vercel Preview URL | LIVE | vaxfact.vercel.app |
| vaxfact.net domain | Verified in Vercel | Awaiting DNS update in GoDaddy |
| www.vaxfact.net | Added (redirects to apex) | Awaiting DNS update |
| GitHub Auto-Deploy | ACTIVE | Every push to main triggers rebuild |

---

## GoDaddy DNS Changes Required

Your domain vaxfact.net uses GoDaddy nameservers (ns53.domaincontrol.com / ns54.domaincontrol.com).

### Steps

1. Log in to GoDaddy.com
2. My Products → vaxfact.net → DNS
3. Make the following record changes:

### Record 1 — Root Domain A Record

| Field | New Value |
|-------|-----------|
| Type | A |
| Name | @ |
| Value | 76.76.21.21 |
| TTL | 1 Hour |

Delete any existing A records for @ pointing to other IPs first.

### Record 2 — WWW CNAME

| Field | New Value |
|-------|-----------|
| Type | CNAME |
| Name | www |
| Value | cname.vercel-dns.com. |
| TTL | 1 Hour |

### After DNS Changes

- Propagation takes 15 min to 2 hours (up to 48h in rare cases)
- Vercel auto-provisions SSL once DNS resolves correctly
- Check propagation at: https://dnschecker.org/#A/vaxfact.net

---

## Auto-Deploy via GitHub

Every push to main triggers a Vercel rebuild automatically:

```bash
git add -A
git commit -m "Your change description"
git push origin main
```

Vercel deploys in approximately 2 minutes.

---

## Application Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + glassmorphism |
| Charts | Recharts (scatter, radar, bar, Gantt) |
| Icons | Lucide React |
| Deployment | Vercel with GitHub auto-deploy |

### File Structure

```
vaxfact/                          (GitHub repo root)
├── app/
│   ├── layout.tsx                Root layout, metadata, fonts
│   ├── page.tsx                  Main page, tab routing, state
│   └── globals.css               Global styles
├── components/
│   ├── Header.tsx                Nav bar
│   ├── DisclaimerBanner.tsx      Educational disclaimer
│   ├── ScenarioPanel.tsx         Scenario sliders sidebar
│   ├── VaccineMatrix.tsx         Cards + scatter matrix
│   ├── VaccineDetailModal.tsx    Full detail 5-tab modal
│   └── ScheduleBuilder.tsx       Gantt + visit summary
├── lib/
│   └── vaccineData.ts            All vaccine data + scoring engine
└── public/
```

---

## Scoring Algorithm

### 6 Score Dimensions (all 0-100)

#### 1. Exposure Risk
```
P_exposure = base_rate x age_factor x community_factor x scenario_multipliers
```
- age_factor: 1.4x for newborns, scales down to 0.7x for school age
- community_factor: 1 + (1 - vax_rate/100) x 1.5
- Scenario multipliers: Daycare 2.1x, Travel 2.5x, Outbreak 4.0x, Siblings 1.8x

#### 2. Disease Consequence
```
DiseaseHarm = sum(severity_weight x outcome_probability)
```

Severity weights (from project brief):
| Outcome | Weight |
|---------|--------|
| Death | 100 |
| Permanent neurological injury | 70 |
| Chronic lifelong condition | 60 |
| ICU admission | 40 |
| Hospitalization | 20 |
| Acute QoL loss | 5-15 |
| Long-term QoL loss | 15-50 |

#### 3. Vaccine Benefit
```
Benefit = (VE_severe x 0.5 + VE_death x 0.3 + VE_infection x 0.2) x DiseaseConsequence
```

#### 4. Vaccine Harm
```
VaccineHarm = sum(AE_probability x severity_weight) x 500 + uncertainty_penalty
```

#### 5. Net Benefit
```
NetBenefit = (ExposureRisk x DiseaseConsequence x VaccineBenefit) / 10000 - VaccineHarm + 50
```

Recommendation tiers:
| Score | Label |
|-------|-------|
| 75+ | Strong Support |
| 55-74 | Moderate Support |
| 35-54 | Consider |
| Under 35 | Discuss with Provider |

---

## V1 Vaccine Coverage

| Vaccine | Diseases Prevented | Years in Use | Evidence Score |
|---------|-------------------|-------------|----------------|
| HepB | Hepatitis B, Cirrhosis, Liver Cancer | 44 | 96/100 |
| DTaP | Diphtheria, Tetanus, Pertussis | 30 | 90/100 |
| Hib | Meningitis, Pneumonia, Epiglottitis | 35 | 95/100 |
| PCV | Pneumococcal Meningitis, Pneumonia | 24 | 88/100 |
| MMR | Measles, Mumps, Rubella | 55 | 97/100 |
| Rotavirus | Rotavirus Gastroenteritis | 19 | 85/100 |

---

## Developer Next Steps (V2)

### Database Integration (GCP)
1. Create Cloud SQL for PostgreSQL on GCP project vaxfact
2. Implement the 5 schema modules from project brief: reference, evidence, policy, scoring, application
3. Replace static vaccineData.ts with API calls to /vaccines, /vaccines/{id}/score, etc.
4. Add FastAPI or NestJS backend on Cloud Run

### Vercel Environment Variables
Add in Vercel Dashboard → Project → Settings → Environment Variables:
- DATABASE_URL
- GCP_PROJECT_ID (vaxfact)
- NEXT_PUBLIC_SITE_URL (https://vaxfact.net)

### Adding More Vaccines
Add a new entry to the VACCINES array in lib/vaccineData.ts following the VaccineData interface. All UI components update automatically.

### Research Admin Console (Phase 5 per project brief)
- Add /admin route with authentication
- Build study intake queue, extraction review, claim approval workflow
- Connect to evidence PostgreSQL schema module

---

## Project IDs Reference

| Service | Value |
|---------|-------|
| Vercel Project | prj_82YUVx5AQpVWfCi76YG5iomEql6h |
| GitHub Repo | loganlidster/vaxfact |
| GCP Project ID | vaxfact |
| GCP Project Number | 1090390526220 |
| GCP Service Account | ninjavax@vaxfact.iam.gserviceaccount.com |

Keep your Vercel token, GitHub token, and GCP service account key private.
Never commit credentials to the repository.

---

Generated by NinjaTech AI for VaxFact.net — April 2026