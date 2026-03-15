# Pilot Partner Playbook

> **Приручник за пилот партнере** | Complete guide for first adopters

This playbook provides everything you need to successfully onboard, deploy, and use Vizuelni Admin Srbije within your organization.

---

## Table of Contents

1. [Program Overview](#program-overview)
2. [Onboarding Process](#onboarding-process)
3. [Technical Setup](#technical-setup)
4. [Support & SLA](#support--sla)
5. [Success Metrics](#success-metrics)
6. [Issue Reporting](#issue-reporting)
7. [Feedback & Iteration](#feedback--iteration)

---

## Program Overview

### What is the Pilot Program?

The Vizuelni Admin Srbije Pilot Program offers 5 early-adopter Serbian government agencies and media organizations:

- **Free access** to all enterprise features for 12 months
- **Priority support** with dedicated technical contact
- **Direct influence** on product roadmap
- **Custom training** for your team
- **Recognition** as founding partner

### Who Qualifies?

| Organization Type  | Requirements                                    |
| ------------------ | ----------------------------------------------- |
| Government Agency  | Serbian public sector, data visualization needs |
| Media Organization | Serbian journalism focus, data journalism team  |
| NGO/Think Tank     | Transparency focus, public interest mission     |

### Pilot Partner Benefits

```
┌─────────────────────────────────────────────────────────────┐
│                    PILOT PARTNER PACKAGE                     │
├─────────────────────────────────────────────────────────────┤
│ ✅ Unlimited users                                           │
│ ✅ All chart types and export options                        │
│ ✅ Custom branding                                           │
│ ✅ Priority feature requests                                 │
│ ✅ Monthly check-in calls                                    │
│ ✅ Direct Slack/Email channel                                │
│ ✅ On-site training (Belgrade area)                          │
│ ✅ Early access to new features                              │
│                                                              │
│ Value: €5,000/year → FREE for pilot period                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Onboarding Process

### Timeline

```
Week 1        Week 2        Week 3        Week 4        Ongoing
  │             │             │             │              │
  ▼             ▼             ▼             ▼              ▼
┌─────┐      ┌─────┐      ┌─────┐      ┌─────┐       ┌─────────┐
│Kickoff│    │Setup │    │Training│   │Go Live│     │Support │
│Call   │───▶│&Config│───▶│Session│───▶│Support│────▶│&Iterate│
└─────┘      └─────┘      └─────┘      └─────┘       └─────────┘
```

### Week 1: Kickoff Call (60 minutes)

**Agenda:**

1. Team introductions (15 min)
2. Your goals and use cases (20 min)
3. Technical requirements review (15 min)
4. Next steps and timeline (10 min)

**Preparation:**

- [ ] Identify 2-3 key use cases for data visualization
- [ ] List data sources you want to integrate
- [ ] Designate technical contact person
- [ ] Prepare questions about capabilities

**Deliverables:**

- [ ] Technical contact assigned
- [ ] Use case documentation
- [ ] Deployment timeline agreed

### Week 2: Setup & Configuration

**We Handle:**

- [ ] Provision your organization account
- [ ] Configure SSO (if applicable)
- [ ] Set up custom branding (logo, colors)
- [ ] Enable data source integrations
- [ ] Create initial user accounts

**You Provide:**

- [ ] Organization logo (SVG or PNG, transparent background)
- [ ] Brand colors (hex codes)
- [ ] User email list for invitations
- [ ] SSO metadata (if using SAML/OAuth)
- [ ] Data source credentials (if applicable)

### Week 3: Training Session

**Format:** 2-hour live session (remote or on-site in Belgrade)

**Agenda:**

1. **Platform Overview** (20 min)
   - Navigation and interface
   - Key concepts and terminology

2. **Creating Your First Chart** (30 min)
   - Data upload walkthrough
   - Chart type selection
   - Customization options
   - Saving and sharing

3. **Advanced Features** (30 min)
   - Geographic visualizations
   - Export to PDF/Image
   - Embedding in websites
   - API integration

4. **Q&A and Hands-on Practice** (40 min)
   - Work on your actual use cases
   - Troubleshooting with expert help

**Training Materials:**

- [ ] Video recording provided
- [ ] Step-by-step guides in Serbian
- [ ] Example datasets
- [ ] Cheat sheet for common tasks

### Week 4: Go Live Support

**Activities:**

- [ ] Final configuration review
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Documentation review
- [ ] Launch announcement (optional)

---

## Technical Setup

### System Requirements

| Component | Minimum                             | Recommended    |
| --------- | ----------------------------------- | -------------- |
| Browser   | Chrome 90+, Firefox 88+, Safari 15+ | Latest version |
| Internet  | 5 Mbps                              | 25+ Mbps       |
| Screen    | 1366x768                            | 1920x1080+     |

**No installation required** - Vizuelni Admin Srbije runs in your browser.

### Authentication Options

#### Option 1: Google OAuth (Recommended)

```
1. Click "Sign in with Google"
2. Use your @gov.rs or organization email
3. Grant permission
4. Done!
```

#### Option 2: GitHub OAuth

```
1. Click "Sign in with GitHub"
2. Authorize application
3. Done!
```

#### Option 3: Email/Password

```
1. Click "Create account"
2. Enter email and password
3. Verify email
4. Done!
```

#### Option 4: SAML SSO (Enterprise)

Contact your technical lead for SSO configuration.

### Data Source Integration

#### Uploading CSV/Excel Files

```typescript
// Supported formats
- CSV (UTF-8 encoding)
- XLSX (Excel 2007+)
- JSON (array of objects)

// Size limits
- Max file size: 50MB
- Max rows: 100,000
- Max columns: 100
```

#### Connecting to data.gov.rs

```typescript
// Automatic integration - no setup required
// Available datasets:
- Budget data (Budžet)
- Population statistics (Populacija)
- Economic indicators (Ekonomski pokazatelji)
- Administrative divisions (Administrativna podela)
```

### Browser Configuration

**Allow pop-ups** for PDF exports:

```
Chrome: Settings → Privacy → Site Settings → Pop-ups → Allow
Firefox: Preferences → Privacy → Permissions → Block pop-ups → Exceptions
Safari: Preferences → Websites → Pop-up Windows → Allow
```

**Enable JavaScript** (usually enabled by default).

---

## Support & SLA

### Support Channels

| Channel        | Response Time | Best For                                     |
| -------------- | ------------- | -------------------------------------------- |
| **Email**      | < 4 hours     | Non-urgent questions, documentation requests |
| **Slack**      | < 2 hours     | Quick questions, troubleshooting             |
| **Phone**      | < 1 hour      | Urgent issues, production outages            |
| **Video Call** | Scheduled     | Complex problems, training                   |

### Service Level Agreement (SLA)

| Metric                         | Target     | Measurement  |
| ------------------------------ | ---------- | ------------ |
| **Uptime**                     | 99.5%      | Monthly      |
| **Response Time (Critical)**   | < 1 hour   | Per incident |
| **Response Time (High)**       | < 4 hours  | Per incident |
| **Response Time (Normal)**     | < 24 hours | Per incident |
| **Resolution Time (Critical)** | < 8 hours  | Per incident |

### Severity Levels

| Level             | Definition                 | Examples                              |
| ----------------- | -------------------------- | ------------------------------------- |
| **Critical (P1)** | System down, no workaround | Platform inaccessible, data loss      |
| **High (P2)**     | Major feature broken       | Exports failing, charts not rendering |
| **Normal (P3)**   | Minor issue or question    | How-to questions, feature requests    |
| **Low (P4)**      | Enhancement or suggestion  | UI improvements, new chart types      |

### Your Dedicated Contacts

```
Technical Lead: [Name]
Email: support-pilot@vizuelni.rs
Slack: #pilot-support
Phone: +381 11 XXX XXXX (Mon-Fri 9-17 CET)

Emergency (24/7): +381 63 XXX XXXX
```

---

## Success Metrics

### What We Measure Together

#### Usage Metrics

- [ ] Active users per week
- [ ] Charts created per month
- [ ] Data uploads per month
- [ ] Exports generated per month

#### Quality Metrics

- [ ] User satisfaction score (monthly survey)
- [ ] Support ticket volume
- [ ] Feature adoption rate
- [ ] Time to first chart created

#### Impact Metrics

- [ ] Publications using your visualizations
- [ ] Time saved vs. previous methods
- [ ] Public engagement (views, shares)

### Monthly Review

**Format:** 30-minute video call

**Agenda:**

1. Usage review (10 min)
2. Challenges and wins (10 min)
3. Roadmap preview (5 min)
4. Feedback collection (5 min)

### Success Stories

We'll work with you to document:

- How you're using the platform
- Impact on your work
- Time and cost savings
- Lessons learned

With your permission, these may be featured in:

- Case studies
- Marketing materials
- Grant applications
- Conference presentations

---

## Issue Reporting

### Before Reporting

1. **Check [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)**
2. **Try basic fixes:**
   - Refresh the page (Ctrl+R / Cmd+R)
   - Clear browser cache
   - Try a different browser
   - Check internet connection

### How to Report

#### Option 1: In-App Feedback

```
Click (?) Help → Report Issue → Fill form → Submit
```

#### Option 2: Email

```
To: support-pilot@vizuelni.rs
Subject: [PILOT] Brief description

Include:
- What you were trying to do
- What happened (error message, screenshot)
- What you expected
- Browser and version
```

#### Option 3: Slack

```
#pilot-support channel

@here [URGENCY] Description
Screenshot/file attachment
```

### Bug Report Template

```markdown
## Summary

Brief description of the issue

## Steps to Reproduce

1. Go to...
2. Click on...
3. See error

## Expected Result

What should happen

## Actual Result

What actually happened

## Environment

- Browser: Chrome 120
- OS: Windows 11
- User: myemail@gov.rs

## Attachments

- Screenshot: [attach]
- Data file: [attach if relevant]

## Urgency

- [ ] Blocking my work (P1)
- [ ] Workaround available (P2)
- [ ] Minor inconvenience (P3)
```

### Issue Lifecycle

```
Reported → Triaged → In Progress → Fixed → Verified → Closed
   │          │           │           │         │
   │          │           │           │         └─ You confirm fix works
   │          │           │           └─ Deployed to production
   │          │           └─ Developer working on it
   │          └─ Priority assigned, team notified
   └─ Acknowledged within SLA
```

---

## Feedback & Iteration

### Your Voice Matters

As a pilot partner, you have direct influence on our roadmap. We prioritize features based on:

1. **Partner requests** (40% weight)
2. **Strategic alignment** (30% weight)
3. **Effort required** (20% weight)
4. **Community requests** (10% weight)

### Feedback Channels

| Type             | How Often | Method                  |
| ---------------- | --------- | ----------------------- |
| Quick feedback   | Anytime   | In-app feedback button  |
| Feature request  | Anytime   | Slack #feature-requests |
| Monthly check-in | Monthly   | Scheduled call          |
| Quarterly review | Quarterly | Formal survey           |

### Feature Request Template

```markdown
## Problem Statement

What problem are you trying to solve?

## Proposed Solution

How would you like it to work?

## Use Case

Specific example of when you'd use this

## Priority

How important is this to your work?

- [ ] Critical - blocking adoption
- [ ] High - significant productivity gain
- [ ] Medium - nice to have
- [ ] Low - future consideration

## Alternatives Considered

What workarounds have you tried?
```

### Roadmap Transparency

We share our public roadmap at: `roadmap.vizuelni.rs`

**What you'll see:**

- Planned features (next 3 months)
- In-progress work
- Recently shipped
- Under consideration

**What you can do:**

- Vote on features
- Comment on proposals
- See estimated timelines

---

## Appendix

### Glossary

| Term               | Definition                                          |
| ------------------ | --------------------------------------------------- |
| **Chart**          | Visual representation of data (bar, line, pie, map) |
| **Dataset**        | Collection of data points to visualize              |
| **Export**         | Save chart as PDF, PNG, or SVG                      |
| **Embed**          | Insert chart into external website                  |
| **Region Matcher** | Tool to standardize Serbian region names            |
| **GeoJSON**        | Format for geographic boundary data                 |

### Keyboard Shortcuts

| Shortcut           | Action       |
| ------------------ | ------------ |
| `Ctrl+S` / `Cmd+S` | Save chart   |
| `Ctrl+E` / `Cmd+E` | Export chart |
| `Ctrl+Z` / `Cmd+Z` | Undo         |
| `Ctrl+Shift+Z`     | Redo         |
| `?`                | Open help    |
| `Esc`              | Close modal  |

### Common Tasks

#### Create a Chart

1. Click "New Chart"
2. Upload data or select source
3. Choose chart type
4. Configure axes and labels
5. Save

#### Share a Chart

1. Open chart
2. Click "Share"
3. Set visibility (public/private)
4. Copy link or embed code

#### Export to PDF

1. Open chart
2. Click "Export" → "PDF"
3. Configure options (size, quality)
4. Download

---

## Next Steps

- [ ] Schedule kickoff call: support-pilot@vizuelni.rs
- [ ] Prepare use case documentation
- [ ] Designate technical contact
- [ ] Gather branding assets (logo, colors)
- [ ] Review troubleshooting guide
- [ ] Join Slack channel

---

**Questions?** Contact your pilot program coordinator:

📧 support-pilot@vizuelni.rs  
📞 +381 11 XXX XXXX  
💬 Slack: #pilot-support

---

_Welcome to the Vizuelni Admin Srbije Pilot Program!_
