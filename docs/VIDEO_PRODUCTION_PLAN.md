# Video Production Plan

**Logistics for creating and distributing tutorial videos**

---

## Overview

This plan covers production, hosting, and distribution of the 5 tutorial videos outlined in [VIDEO_WALKTHROUGH_SCRIPTS.md](./VIDEO_WALKTHROUGH_SCRIPTS.md).

### Video Summary

| #   | Title                | Duration | Audience       | Priority |
| --- | -------------------- | -------- | -------------- | -------- |
| 1   | Platform Overview    | 3 min    | All            | P0       |
| 2   | First Visualization  | 5 min    | Non-developers | P0       |
| 3   | Geographic Maps      | 7 min    | Intermediate   | P1       |
| 4   | Data Journalism      | 8 min    | Journalists    | P1       |
| 5   | Developer Quickstart | 10 min   | Developers     | P1       |

**Total content:** ~33 minutes

---

## Production Options

### Option A: In-House Production (Recommended)

**Pros:**

- Full control over content
- Updates are easy
- Cost-effective long-term

**Cons:**

- Requires equipment and skills
- Initial time investment

**Estimated cost:** €2,000-5,000 (equipment + software)

**Equipment needed:**

| Item             | Recommended            | Budget Alternative |
| ---------------- | ---------------------- | ------------------ |
| Microphone       | Blue Yeti (€100)       | Headset mic (€30)  |
| Screen recording | Camtasia (€250)        | OBS Studio (free)  |
| Video editing    | DaVinci Resolve (free) | Same               |
| Thumbnail design | Figma (free)           | Canva (free)       |

### Option B: Freelance Production

**Pros:**

- Professional quality
- Fast turnaround

**Cons:**

- Updates require new contract
- Higher cost

**Estimated cost:** €1,500-3,000 per video (€7,500-15,000 total)

**Recommended platforms:**

- Upwork, Fiverr Pro, Local video production agencies in Belgrade

### Option C: Hybrid Approach

1. **In-house:** Screen recording + voiceover
2. **Outsource:** Video editing, intro/outro graphics

**Estimated cost:** €3,000-5,000 total

---

## Production Timeline

### Week 1-2: Pre-Production

**Tasks:**

- [ ] Finalize scripts (already in VIDEO_WALKTHROUGH_SCRIPTS.md)
- [ ] Set up recording environment
- [ ] Test audio quality
- [ ] Create demo accounts and sample data
- [ ] Design intro/outro graphics

**Deliverables:**

- Recording setup complete
- Demo data prepared
- Graphics templates ready

### Week 3-4: Recording

**Schedule:**

| Day   | Video               | Duration | Notes                  |
| ----- | ------------------- | -------- | ---------------------- |
| Day 1 | Video 1: Overview   | 3 min    | Record 3-4 takes       |
| Day 2 | Video 2: First Viz  | 5 min    | Screen recording       |
| Day 3 | Video 3: Maps       | 7 min    | Geographic demos       |
| Day 4 | Video 4: Journalism | 8 min    | Investigation workflow |
| Day 5 | Video 5: Developer  | 10 min   | Code examples          |

**Recording checklist:**

- [ ] Quiet environment (no echo, no background noise)
- [ ] Consistent lighting (if showing face)
- [ ] 1080p minimum resolution (4K preferred)
- [ ] Clear audio (no pops, hisses, or clipping)
- [ ] Cursor visible and smooth

### Week 5-6: Post-Production

**Tasks:**

- [ ] Edit raw footage
- [ ] Add intro/outro graphics
- [ ] Insert lower-thirds for names/terms
- [ ] Add background music (royalty-free)
- [ ] Create captions/subtitles (Serbian + English)
- [ ] Export final versions

**Export specifications:**

| Platform      | Resolution     | Format      | Bitrate    |
| ------------- | -------------- | ----------- | ---------- |
| YouTube       | 4K (3840×2160) | MP4 (H.264) | 35-45 Mbps |
| Vimeo         | 4K             | MP4         | Same       |
| Website embed | 1080p          | MP4         | 8-12 Mbps  |
| GIF previews  | 480p           | GIF         | <5MB       |

### Week 7: Distribution

**Tasks:**

- [ ] Upload to YouTube
- [ ] Upload to Vimeo (backup)
- [ ] Create playlist
- [ ] Add to documentation
- [ ] Announce on social media
- [ ] Embed on website

---

## Hosting Strategy

### Primary: YouTube

**Channel:** Create "Vizualni Admin Srbije" brand channel

**Why YouTube:**

- Free unlimited hosting
- SEO benefits
- Embedding supported
- Analytics available
- Auto-captions (review and correct)

**Channel setup:**

- [ ] Create brand account
- [ ] Design channel banner (2560×1440)
- [ ] Upload channel icon (800×800)
- [ ] Write channel description (Serbian + English)
- [ ] Create playlists: "Tutoriali", "Tutorials", "Demostracije"

### Secondary: Vimeo

**Account:** Vimeo Pro (€20/month)

**Why Vimeo:**

- Professional appearance
- Better privacy controls
- Higher quality playback
- No ads
- Download links for offline use

**Use cases:**

- Government presentations
- Training sessions
- Press kit materials

### Tertiary: Self-Hosted

**For:** Enterprise customers with strict network policies

**Implementation:**

```html
<video controls>
  <source src="/videos/tutorial-1.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/videos/tutorial-1-sr.vtt"
    srclang="sr"
    label="Srpski"
  />
  <track
    kind="captions"
    src="/videos/tutorial-1-en.vtt"
    srclang="en"
    label="English"
  />
</video>
```

---

## Distribution Channels

### 1. Documentation Website

**Location:** docs.vizuelni-admin.rs/tutorials

**Implementation:**

```markdown
## Video Tutorials

### 1. Platform Overview (3 min)

<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID"></iframe>

**What you'll learn:**

- Platform capabilities
- Key features
- Getting started

[Watch on YouTube](https://youtube.com/watch?v=VIDEO_ID) | [Download MP4](/videos/tutorial-1.mp4)
```

### 2. In-Platform Help

**Location:** Help button → Video tutorials

**Implementation:**

```typescript
<HelpPanel>
  <VideoTutorial
    title="Your First Visualization"
    videoId="abc123"
    duration="5:00"
    level="beginner"
  />
</HelpPanel>
```

### 3. Social Media

**Platforms:**

- LinkedIn (professional audience)
- Twitter/X (tech community)
- Facebook (general Serbian audience)

**Content strategy:**

- Full videos on YouTube
- 30-60 second clips on LinkedIn/Twitter
- Native uploads to Facebook (algorithm preference)

### 4. Email Newsletter

**Announce new videos to:**

- Registered users
- Pilot partners
- Newsletter subscribers

**Template:**

```markdown
Нови туторијал: [Наслов]

Погледајте наш најновији видео туторијал који покрива:

- Тема 1
- Тема 2
- Тема 3

📺 Гледајте: [YouTube линк]
📖 Документација: [Документација линк]
```

---

## SEO Optimization

### YouTube SEO

**Titles (Serbian + English):**

```
Визуелизација података Србије | Прва визуелизација | Vizualni Admin Srbije
Serbian Data Visualization | Your First Chart | Vizualni Admin Srbije
```

**Tags:**

```
србија, подаци, визуелизација, data visualization, serbia,
open data, data.gov.rs, chart, map, react, tutorial
```

**Description template:**

```markdown
Научите како да [циљ видеоа].

📖 Документација: https://docs.vizuelni-admin.rs/...
💻 Пример кода: https://github.com/...
📧 Контакт: opendata@ite.gov.rs

Временске ознаке:
0:00 - Увод
0:30 - Корак 1
...

EN: Learn how to [goal]. This tutorial covers [topics].
```

### Website SEO

**Schema markup:**

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Your First Visualization - Vizualni Admin Srbije",
  "description": "Create your first data visualization with Serbian government data",
  "thumbnailUrl": "https://vizuelni-admin.rs/videos/thumbnails/tutorial-2.jpg",
  "uploadDate": "2026-03-15",
  "duration": "PT5M",
  "contentUrl": "https://vizuelni-admin.rs/videos/tutorial-2.mp4",
  "embedUrl": "https://www.youtube.com/embed/VIDEO_ID"
}
```

---

## Accessibility

### Captions

**Languages:**

- Serbian Cyrillic (primary)
- Serbian Latin
- English

**Format:** WebVTT (.vtt)

**Tools:**

- YouTube auto-captions (review and correct)
- Rev.com (€1.25/minute for professional)
- Amara.org (free, crowdsourced)

### Transcripts

**Include with each video:**

- Full text transcript
- Downloadable PDF
- Searchable on documentation site

---

## Maintenance

### Update Triggers

Videos should be updated when:

- UI changes significantly
- New features are added
- User feedback indicates confusion
- Annually (review for accuracy)

### Version Control

**File naming:**

```
tutorial-1-platform-overview-v1.0.mp4
tutorial-1-platform-overview-v1.1.mp4 (minor updates)
tutorial-1-platform-overview-v2.0.mp4 (major re-record)
```

**Changelog:**

```markdown
## Tutorial 2: First Visualization

| Version | Date       | Changes                         |
| ------- | ---------- | ------------------------------- |
| 1.0     | 2026-03-15 | Initial release                 |
| 1.1     | 2026-06-01 | Updated UI after v1.1.0 release |
```

---

## Budget Summary

### One-Time Costs

| Item                   | Cost                             |
| ---------------------- | -------------------------------- |
| Microphone             | €100                             |
| Video editing software | €0 (DaVinci free)                |
| Screen recording       | €0 (OBS free) or €250 (Camtasia) |
| Graphics design        | €200 (freelancer) or €0 (DIY)    |
| **Total**              | **€300-550**                     |

### Ongoing Costs

| Item                         | Monthly | Annual   |
| ---------------------------- | ------- | -------- |
| Vimeo Pro                    | €20     | €240     |
| Music licensing (Artlist)    | €10     | €120     |
| Thumbnail design (Canva Pro) | €12     | €144     |
| **Total**                    | **€42** | **€504** |

### Freelance Alternative

| Video            | Estimated Cost    |
| ---------------- | ----------------- |
| Video 1 (3 min)  | €500-1,000        |
| Video 2 (5 min)  | €750-1,500        |
| Video 3 (7 min)  | €1,000-2,000      |
| Video 4 (8 min)  | €1,200-2,500      |
| Video 5 (10 min) | €1,500-3,000      |
| **Total**        | **€4,950-10,000** |

---

## Success Metrics

### Track These KPIs

| Metric                   | Target | Measurement Tool     |
| ------------------------ | ------ | -------------------- |
| Total views (3 months)   | 10,000 | YouTube Analytics    |
| Average watch time       | >60%   | YouTube Analytics    |
| Click-through from docs  | >5%    | Google Analytics     |
| Tutorial completion rate | >70%   | In-platform tracking |
| Support tickets reduced  | -20%   | Support system       |

### Quarterly Review

- Compare video performance
- Identify drop-off points
- Gather user feedback
- Plan updates

---

## Quick Start (Minimal Viable Production)

**If budget/time is limited, start with:**

1. **Record with free tools:**
   - OBS Studio for screen recording
   - Built-in laptop microphone
   - DaVinci Resolve for editing

2. **Host on YouTube only:**
   - Free, unlimited
   - Good enough for MVP

3. **Create 2 videos first:**
   - Video 1: Platform Overview
   - Video 2: First Visualization

4. **Add captions via YouTube:**
   - Auto-generate
   - Manually correct

**MVP timeline:** 2 weeks
**MVP cost:** €0-100

---

## Next Steps

1. [ ] Decide: in-house vs freelance
2. [ ] Allocate budget
3. [ ] Set up recording environment
4. [ ] Schedule recording sessions
5. [ ] Create YouTube channel
6. [ ] Record first video (Platform Overview)
7. [ ] Publish and gather feedback
8. [ ] Iterate and produce remaining videos

---

**Questions?** Contact: opendata@ite.gov.rs
