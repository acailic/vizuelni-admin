# Pilot Partner Playbook

**Complete guide for government agency early adopters**

---

## Overview

This playbook guides pilot partners through the Vizualni Admin Srbije adoption process. As an early adopter, you receive enhanced support, direct access to the development team, and the opportunity to shape the platform's future.

### Pilot Program Benefits

| Benefit               | Description                             | Value                   |
| --------------------- | --------------------------------------- | ----------------------- |
| **Free Pro Access**   | Full enterprise features at no cost     | €5,000/year value       |
| **Priority Support**  | 4-hour response time, dedicated channel | Expedited resolution    |
| **Custom Training**   | On-site or virtual training sessions    | Team enablement         |
| **Feature Influence** | Direct input on roadmap priorities      | Shape the product       |
| **Extended LTS**      | 24-month support guarantee              | Stability assurance     |
| **Dedicated Contact** | Named technical account manager         | Relationship continuity |

---

## Onboarding Timeline

### Week 1: Setup & Access

#### Day 1-2: Account Provisioning

**What happens:**

- Pilot partner account created
- API keys generated
- Team members invited
- Access credentials shared

**Your actions:**

1. Verify email invitation
2. Complete team member registration
3. Set up 2FA (required for government accounts)
4. Test login to dashboard.vizuelni-admin.rs

**Deliverables:**

- [ ] All team members can log in
- [ ] 2FA enabled for all accounts
- [ ] API keys stored securely

#### Day 3-5: Technical Setup

**What happens:**

- Kick-off call with technical account manager
- Environment assessment
- Integration planning

**Your actions:**

1. Complete technical assessment form
2. Identify data sources to visualize
3. List existing systems for integration
4. Define initial use cases

**Deliverables:**

- [ ] Technical assessment complete
- [ ] Data sources identified
- [ ] Integration requirements documented

### Week 2-3: Training

#### Training Session 1: Platform Overview (2 hours)

**Audience:** All team members

**Agenda:**

1. Platform capabilities demo (30 min)
2. Data.gov.rs integration walkthrough (30 min)
3. Hands-on: Create first visualization (45 min)
4. Q&A (15 min)

**Materials provided:**

- Recording
- Slide deck
- Hands-on exercise workbook
- Quick reference card

#### Training Session 2: Your Data, Your Way (2 hours)

**Audience:** Technical team

**Agenda:**

1. Uploading custom datasets (20 min)
2. Creating dashboards for your metrics (40 min)
3. Embedding in existing websites (30 min)
4. Export and reporting (20 min)
5. Q&A (10 min)

**Materials provided:**

- Dataset templates
- Dashboard examples
- Embed code snippets
- Export best practices

#### Training Session 3: Advanced Features (2 hours)

**Audience:** Technical team, analysts

**Agenda:**

1. Geographic visualizations with Serbian data (30 min)
2. Scheduled reports and alerts (20 min)
3. API integration for developers (40 min)
4. Accessibility compliance (20 min)
5. Q&A (10 min)

**Materials provided:**

- GeoJSON examples
- API documentation
- Accessibility checklist
- Code samples

### Week 4-6: Implementation

#### Phase 1: Pilot Project

**Objective:** Deploy one production visualization

**Steps:**

1. Select pilot dataset (with TAM guidance)
2. Create visualization
3. Internal review
4. Security review
5. Public launch

**Support:**

- Daily office hours access
- Priority bug fixes
- Design review assistance

#### Phase 2: Expansion

**Objective:** Add 2-3 additional visualizations

**Steps:**

1. Prioritize additional datasets
2. Create dashboard integrating multiple visualizations
3. Internal training for broader team
4. Stakeholder demo
5. Iteration based on feedback

### Week 7-8: Stabilization

**Activities:**

- Performance review
- User feedback collection
- Documentation handoff
- Knowledge transfer planning
- Success metrics review

---

## Support Model

### Support Channels

| Channel              | Use Case                   | Response Time | Availability       |
| -------------------- | -------------------------- | ------------- | ------------------ |
| **Dedicated Slack**  | General questions, updates | 4 hours       | Business hours CET |
| **Email (priority)** | Detailed issues, requests  | 4 hours       | Business hours CET |
| **Phone hotline**    | Urgent production issues   | 1 hour        | 8:00-20:00 CET     |
| **Weekly sync**      | Status updates, planning   | Scheduled     | Fixed time slot    |

### Escalation Path

```
Level 1: Technical Account Manager
    ↓ (4 hours no resolution)
Level 2: Senior Engineer
    ↓ (8 hours no resolution)
Level 3: Engineering Lead
    ↓ (24 hours no resolution)
Executive Sponsor Contact
```

### Your Technical Account Manager

**Role:** Single point of contact for all technical matters

**Responsibilities:**

- Coordinate onboarding activities
- Facilitate training sessions
- Manage support requests
- Track success metrics
- Advocate for your feature requests

**Contact:** [Assigned during kick-off]

---

## Technical Requirements

### For Web Platform Access

| Requirement | Minimum                                       | Recommended    |
| ----------- | --------------------------------------------- | -------------- |
| Browser     | Chrome 80+, Firefox 75+, Safari 14+, Edge 80+ | Latest version |
| Internet    | 5 Mbps                                        | 10+ Mbps       |
| Screen      | 1366×768                                      | 1920×1080+     |

### For API Integration

| Requirement     | Details                               |
| --------------- | ------------------------------------- |
| Authentication  | API key (provided) or OAuth 2.0       |
| Rate Limits     | 10,000 requests/hour (pilot partners) |
| IP Whitelisting | Optional, contact TAM to enable       |
| SSL             | Required (TLS 1.2+)                   |

### For Self-Hosted Option (Enterprise)

| Requirement | Details                                   |
| ----------- | ----------------------------------------- |
| Server      | 4 CPU, 8GB RAM, 50GB storage              |
| Runtime     | Node.js 18+, Docker supported             |
| Database    | PostgreSQL 14+ (optional, for caching)    |
| Network     | Internal access, optional external access |

---

## Security & Compliance

### Data Handling

| Aspect              | Implementation              |
| ------------------- | --------------------------- |
| **Data at rest**    | Encrypted (AES-256)         |
| **Data in transit** | TLS 1.2+                    |
| **Authentication**  | 2FA required, SSO available |
| **Access logging**  | Full audit trail            |
| **Data residency**  | EU servers (Frankfurt)      |

### Compliance Certifications

- [ ] ISO 27001 (planned Q3 2026)
- [ ] SOC 2 Type II (planned Q4 2026)
- [x] GDPR compliant
- [x] Serbian Data Protection Law compliant

### Government Security Requirements

For agencies with specific security requirements:

1. **On-premise deployment:** Available for classified data
2. **Security questionnaire:** We'll complete your vendor assessment
3. **Penetration testing:** Annual third-party audit, reports available
4. **Breach notification:** 24-hour SLA for security incidents

---

## Success Metrics

### Pilot Program KPIs

We track these metrics to ensure pilot success:

| Metric                          | Target    | Measurement                  |
| ------------------------------- | --------- | ---------------------------- |
| **Time to first visualization** | < 2 weeks | From account creation        |
| **Team adoption rate**          | > 80%     | Active users / Total invited |
| **Visualizations created**      | 5+        | By end of pilot period       |
| **User satisfaction**           | > 4.0/5.0 | Survey at 30 and 60 days     |
| **Support ticket resolution**   | < 4 hours | Average response time        |
| **Uptime**                      | 99.5%     | Platform availability        |

### Monthly Review

Each month during the pilot, we review:

1. **Usage metrics:** Logins, visualizations created, API calls
2. **Support metrics:** Tickets opened, resolution times
3. **Feedback themes:** Common requests, pain points
4. **Roadmap alignment:** Feature requests prioritization

---

## Communication Cadence

### Weekly

- **Sync call:** 30 minutes, status update and planning
- **Office hours:** Thursday 14:00-16:00 CET (optional)

### Monthly

- **Executive summary:** Usage report, success metrics
- **Roadmap review:** Upcoming features, prioritization discussion

### Quarterly

- **Business review:** Strategic alignment, expansion planning
- **Success story:** Case study development (with permission)

---

## Common Questions

### Data & Privacy

**Q: Where is our data stored?**
A: EU (Frankfurt). On-premise available for classified data.

**Q: Can we delete our data?**
A: Yes, full data deletion within 48 hours upon request.

**Q: Do you access our visualizations?**
A: Only with explicit permission for support purposes.

### Technical

**Q: Can we use our existing authentication?**
A: Yes, SSO via SAML 2.0 or OAuth 2.0 is supported.

**Q: What's the API rate limit?**
A: 10,000 requests/hour for pilot partners (vs 1,000 for standard).

**Q: Can we customize the appearance?**
A: Yes, full theming support including your agency branding.

### Commercial

**Q: What happens after the pilot?**
A: Transition to standard enterprise agreement or extended pilot.

**Q: Is there a long-term commitment?**
A: Pilot is commitment-free. Enterprise agreements are annual.

**Q: Can other agencies see our work?**
A: Only if you choose to make visualizations public.

---

## Transition to Production

### End of Pilot Process

**8 weeks in:**

1. Success metrics review
2. Transition planning call
3. Decision: production, extended pilot, or conclude

**If proceeding to production:**

1. Enterprise agreement finalized
2. Long-term support model established
3. Success story development (optional)
4. Reference customer status (optional)

### Enterprise Agreement Benefits

- 24-month price lock
- Dedicated infrastructure option
- Custom SLA terms
- Named contacts for all escalations
- Quarterly business reviews

---

## Your Pilot Checklist

### Week 1

- [ ] Accept email invitation
- [ ] Complete team registration
- [ ] Enable 2FA for all accounts
- [ ] Store API keys securely
- [ ] Complete technical assessment
- [ ] Attend kick-off call

### Week 2-3

- [ ] Complete Training Session 1
- [ ] Complete Training Session 2
- [ ] Complete Training Session 3
- [ ] Identify pilot dataset
- [ ] Draft initial use cases

### Week 4-6

- [ ] Create first visualization
- [ ] Pass internal review
- [ ] Pass security review
- [ ] Launch pilot visualization
- [ ] Gather initial feedback

### Week 7-8

- [ ] Create 2+ additional visualizations
- [ ] Build integrated dashboard
- [ ] Train broader team
- [ ] Complete feedback survey
- [ ] Attend transition planning call

---

## Contacts

### Primary Contacts

| Role                      | Name                   | Email               | Phone |
| ------------------------- | ---------------------- | ------------------- | ----- |
| Technical Account Manager | [Assigned at kick-off] |                     |       |
| Support Lead              |                        | support@vizualni.rs |       |
| Executive Sponsor         |                        | opendata@ite.gov.rs |       |

### Emergency Contacts

**Production down:** +381 11 XXX XXXX (24/7)

**Security incident:** security@vizualni.rs

---

## Feedback

Your feedback shapes our roadmap. Share thoughts through:

- Weekly sync calls
- Slack #feedback channel
- Monthly survey
- Direct email to TAM

**We commit to:**

- Responding to all feedback within 48 hours
- Explaining decisions when we can't implement suggestions
- Crediting partners whose ideas ship in the product

---

**Welcome to the pilot program!**

We're excited to partner with you in making Serbian government data more accessible and transparent.

_This playbook is a living document. Suggestions for improvement are always welcome._
