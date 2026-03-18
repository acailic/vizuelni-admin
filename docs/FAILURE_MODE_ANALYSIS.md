# Failure Mode Analysis

> **Анализа режима квара** | Risk assessment and contingency planning

This document analyzes potential failure scenarios and provides mitigation strategies for Vizuelni Admin Srbije.

---

## Executive Summary

**Purpose:** Identify, assess, and prepare for scenarios that could threaten platform viability

**Approach:** Systematic analysis of failure modes with probability, impact, and response plans

**Key Findings:**

- 8 critical failure modes identified
- 5 high-probability scenarios require active mitigation
- 3 black swan events require contingency plans

---

## Failure Mode Categories

| Category        | Description                    | Example                 |
| --------------- | ------------------------------ | ----------------------- |
| **Technical**   | System failures, bugs, outages | Database crash          |
| **External**    | Dependencies, regulations      | data.gov.rs shutdown    |
| **Market**      | Competition, adoption          | Free competitor appears |
| **Operational** | Team, funding, resources       | Key developer leaves    |
| **Political**   | Government changes, policy     | New administration      |

---

## Critical Failure Modes

### FM-1: data.gov.rs Shutdown

**Probability:** Low (10%)  
**Impact:** Critical  
**Risk Score:** 🔴 High

**Scenario:**
data.gov.rs goes offline permanently or significantly changes API without notice.

**Warning Signs:**

- Increased API errors
- Delayed dataset updates
- Staff turnover at ITE
- Budget cuts to open data program

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| Core functionality | Severely degraded | Permanent |
| User trust | Major damage | Long-term |
| Platform value | 80% reduction | Permanent |

**Mitigation Strategy:**

1. **Preventive:**
   - Cache all accessed datasets locally
   - Establish relationship with ITE team
   - Monitor data.gov.rs health metrics

2. **Reactive:**

   ```typescript
   // Automatic fallback to cached data
   async function fetchDataset(id: string) {
     try {
       return await dataGovClient.fetch(id);
     } catch (error) {
       console.warn('data.gov.rs unavailable, using cache');
       return await cache.get(`dataset:${id}`);
     }
   }
   ```

3. **Recovery:**
   - Shift to user-uploaded data focus
   - Partner with alternative data sources
   - Enable community data contribution

**Contingency Plan:**

```
Day 0: data.gov.rs goes offline
├── Immediate: Switch to cached data mode
├── Hour 1: Notify users via banner
├── Day 1: Assess data freshness
├── Week 1: Implement alternative sources
├── Month 1: Pivot strategy if permanent
└── Month 3: New normal operations
```

---

### FM-2: No Agency Adoption in Year 1

**Probability:** Medium (30%)  
**Impact:** Critical  
**Risk Score:** 🔴 High

**Scenario:**
Despite outreach efforts, no government agencies adopt the platform in first 12 months.

**Warning Signs:**

- Pilot partners not engaging
- Low attendance at demos
- Long procurement delays
- Competitor contracts signed

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| Revenue | 0 from government | Year 1 |
| Credibility | Difficult to attract others | Long-term |
| Grant eligibility | May lose funding | Medium-term |

**Mitigation Strategy:**

1. **Preventive:**
   - Identify and address barriers early
   - Offer extended free trials
   - Reduce onboarding friction
   - Partner with champions inside agencies

2. **Alternative Paths:**

   ```
   Primary: Government agencies
      ↓ (if no adoption by month 6)
   Secondary: Media organizations
      ↓ (if no adoption by month 9)
   Tertiary: International NGOs in Serbia
      ↓ (if no adoption by month 12)
   Pivot: Open-source community project
   ```

3. **Pivot Strategy:**
   - Focus on journalism use case
   - Target NGOs and civil society
   - Build grassroots community
   - Re-approach government with success stories

**Success Metrics Checkpoints:**

- Month 3: 2 agencies in pilot
- Month 6: 5 agencies in pilot
- Month 9: 3 agencies paying
- Month 12: 10 agencies total

---

### FM-3: Free Competitor Appears

**Probability:** Medium (25%)  
**Impact:** High  
**Risk Score:** 🟡 Medium-High

**Scenario:**
Google, Microsoft, or another major player releases a free Serbian government visualization tool.

**Warning Signs:**

- Tech company interest in Serbian market
- Government contracts with big tech
- Announcements at conferences
- Hiring in Belgrade

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| Market share | 50-80% loss | Permanent |
| Pricing power | Eliminated | Permanent |
| User base | Significant loss | Long-term |

**Mitigation Strategy:**

1. **Differentiation:**

   ```
   Our Advantages vs. Big Tech:
   ✅ Data sovereignty (Serbia/EU)
   ✅ Local support in Serbian
   ✅ No vendor lock-in
   ✅ Open source transparency
   ✅ Government alignment
   ✅ No data harvesting
   ```

2. **Defensive Positioning:**
   - Strengthen government relationships
   - Emphasize data sovereignty
   - Build switching costs (integrations)
   - Create community lock-in

3. **Coexistence Strategy:**
   - Position as privacy-focused alternative
   - Target security-conscious agencies
   - Offer migration from competitor
   - Focus on unique features

---

### FM-4: Grant Applications Fail

**Probability:** High (50%)  
**Impact:** High  
**Risk Score:** 🔴 High

**Scenario:**
None of the targeted grants (UNDP, EU, USAID, Innovation Fund) are approved.

**Warning Signs:**

- Negative feedback on applications
- Program budget cuts
- New eligibility requirements
- Long delays in decisions

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| Development pace | 50% slower | Year 1-2 |
| Team size | Cannot expand | Medium-term |
| Features | Delayed roadmap | Long-term |

**Mitigation Strategy:**

1. **Diversified Funding:**

   ```
   Revenue Mix Target:
   ├── Grants: 40% (reduced from 70%)
   ├── Government licenses: 35%
   ├── Services/consulting: 15%
   └── Community support: 10%
   ```

2. **Lean Operations:**
   - Reduce burn rate
   - Prioritize revenue-generating features
   - Automate support
   - Community contributions

3. **Alternative Funding:**
   - Serbian government direct contract
   - Private foundation grants
   - Corporate sponsorship
   - Crowdfunding

---

### FM-5: Key Developer Leaves

**Probability:** Medium (20%)  
**Impact:** Critical  
**Risk Score:** 🔴 High

**Scenario:**
Lead developer (only person with deep platform knowledge) leaves unexpectedly.

**Warning Signs:**

- Decreased engagement
- Missed deadlines
- External job searching
- Personal issues

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| Development | Stopped | 1-3 months |
| Bug fixes | Delayed | Medium-term |
| Knowledge | Lost | Permanent |

**Mitigation Strategy:**

1. **Preventive:**
   - Competitive compensation
   - Good working conditions
   - Professional development
   - Documentation requirements

2. **Knowledge Distribution:**

   ```
   Required Documentation:
   ├── Architecture decisions (ADRs)
   ├── API documentation
   ├── Deployment procedures
   ├── Debug guides
   └── Video walkthroughs
   ```

3. **Bus Factor Reduction:**
   - Code reviews required
   - Pair programming sessions
   - Knowledge transfer sessions
   - Multiple contributors per component

4. **Recovery Plan:**
   - Detailed handover requirements in contract
   - 30-day notice period minimum
   - Documentation audit before departure
   - Hire replacement immediately

---

### FM-6: Major Security Breach

**Probability:** Low (5%)  
**Impact:** Critical  
**Risk Score:** 🟡 Medium

**Scenario:**
Unauthorized access to user data or government datasets.

**Warning Signs:**

- Vulnerability reports
- Suspicious activity in logs
- Industry breaches
- Outdated dependencies

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| User trust | Destroyed | Long-term |
| Government contracts | Cancelled | Permanent |
| Legal liability | Significant | Medium-term |

**Mitigation Strategy:**

1. **Preventive:**
   - Regular security audits
   - Penetration testing
   - Dependency updates
   - Security training

2. **Detection:**
   - Logging and monitoring
   - Anomaly detection
   - Intrusion detection
   - Regular audits

3. **Response Plan:**
   ```
   Hour 0: Breach detected
   ├── Min 0-15: Assess scope
   ├── Min 15-30: Contain breach
   ├── Hour 1: Notify stakeholders
   ├── Hour 4: Begin forensic analysis
   ├── Day 1: User notification
   ├── Week 1: Post-mortem
   └── Month 1: Security improvements
   ```

---

### FM-7: Political/Regulatory Change

**Probability:** Low (15%)  
**Impact:** High  
**Risk Score:** 🟡 Medium

**Scenario:**
New government administration changes priorities, or new regulations affect operations.

**Warning Signs:**

- Election cycle
- Policy announcements
- Staff changes at ITE
- Regulatory proposals

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| Government adoption | Halted | 6-18 months |
| Funding | At risk | Medium-term |
| Data access | Potentially restricted | Unknown |

**Mitigation Strategy:**

1. **Political Neutrality:**
   - Non-partisan positioning
   - Focus on technical benefits
   - Diverse stakeholder relationships

2. **Regulatory Compliance:**
   - GDPR compliance (already required)
   - Serbian data protection law
   - Government security standards

3. **Diversification:**
   - Don't rely solely on government
   - Build media, NGO, international users
   - Private sector opportunities

---

### FM-8: Platform Performance Degradation

**Probability:** Medium (30%)  
**Impact:** Medium  
**Risk Score:** 🟡 Medium

**Scenario:**
As user base grows, performance degrades to unacceptable levels.

**Warning Signs:**

- Slow page loads
- Timeout errors
- Database bottlenecks
- Increased support tickets

**Impact Analysis:**
| Area | Impact | Duration |
|------|--------|----------|
| User satisfaction | Decreased | Medium-term |
| Churn | Increased | Ongoing |
| Reputation | Damaged | Long-term |

**Mitigation Strategy:**

1. **Monitoring:**
   - Performance metrics tracking
   - Automated alerts
   - Regular load testing

2. **Scaling Plan:**

   ```yaml
   Users 0-1000: Current infrastructure
   Users 1000-5000: Add caching layer
   Users 5000-20000: Database replication
   Users 20000+: Horizontal scaling
   ```

3. **Optimization:**
   - Code profiling
   - Database indexing
   - CDN implementation
   - Query optimization

---

## Black Swan Events

### BS-1: Serbia-EU Relations Breakdown

**Probability:** Very Low (2%)  
**Impact:** Critical

**Scenario:**
Major diplomatic incident affects Serbia's EU integration path.

**Response:**

- Focus on domestic market
- Reduce EU grant dependency
- Strengthen regional partnerships

### BS-2: Global Internet Fragmentation

**Probability:** Very Low (3%)  
**Impact:** High

**Scenario:**
Internet Balkanization requires local-only hosting and operations.

**Response:**

- Already positioned for local hosting
- Ensure all dependencies can be mirrored
- Build offline capabilities

### BS-3: AI Makes Visualization Obsolete

**Probability:** Low (10%)  
**Impact:** Critical

**Scenario:**
AI tools automatically generate visualizations from natural language, eliminating need for dedicated tools.

**Response:**

- Integrate AI capabilities
- Position as AI-powered platform
- Focus on domain expertise (Serbian data)
- Add natural language chart creation

---

## Risk Register Summary

| ID   | Failure Mode         | Prob | Impact   | Score       | Owner     | Status     |
| ---- | -------------------- | ---- | -------- | ----------- | --------- | ---------- |
| FM-1 | data.gov.rs shutdown | 10%  | Critical | 🔴 High     | Tech Lead | Monitoring |
| FM-2 | No adoption          | 30%  | Critical | 🔴 High     | Product   | Active     |
| FM-3 | Free competitor      | 25%  | High     | 🟡 Med-High | Strategy  | Planning   |
| FM-4 | Grant failure        | 50%  | High     | 🔴 High     | Director  | Active     |
| FM-5 | Key dev leaves       | 20%  | Critical | 🔴 High     | HR        | Monitoring |
| FM-6 | Security breach      | 5%   | Critical | 🟡 Medium   | Security  | Active     |
| FM-7 | Political change     | 15%  | High     | 🟡 Medium   | Director  | Watching   |
| FM-8 | Performance issues   | 30%  | Medium   | 🟡 Medium   | Tech Lead | Planning   |

---

## Monitoring Dashboard

### Key Risk Indicators

| Indicator            | Green         | Yellow | Red      |
| -------------------- | ------------- | ------ | -------- |
| data.gov.rs uptime   | >99%          | 95-99% | <95%     |
| Monthly active users | +10%          | 0-10%  | Negative |
| Grant success rate   | >50%          | 25-50% | <25%     |
| Team stability       | <10% turnover | 10-25% | >25%     |
| Performance (p95)    | <1s           | 1-3s   | >3s      |
| Security incidents   | 0             | 1-2    | >2       |

---

## Response Team

| Role           | Responsibility        | Contact |
| -------------- | --------------------- | ------- |
| Crisis Lead    | Overall coordination  | [Name]  |
| Tech Lead      | Technical response    | [Name]  |
| Communications | User/public messaging | [Name]  |
| Legal          | Regulatory compliance | [Name]  |

---

## Post-Incident Process

1. **Immediate:** Contain and communicate
2. **Week 1:** Detailed analysis
3. **Week 2:** Post-mortem meeting
4. **Month 1:** Implement improvements
5. **Quarter 1:** Verify effectiveness

### Post-Mortem Template

```markdown
# Incident Post-Mortem

**Date:** [Date]
**Severity:** [P1/P2/P3]
**Duration:** [Time]

## Summary

[Brief description]

## Timeline

- [Time]: [Event]

## Root Cause

[Analysis]

## Impact

- Users affected: [Number]
- Data affected: [Description]
- Duration: [Time]

## What Went Well

- [Positive aspects]

## What Could Be Improved

- [Areas for improvement]

## Action Items

- [ ] [Action] (Owner, Due Date)

## Lessons Learned

[Key takeaways]
```

---

_Failure Mode Analysis v1.0 - March 2026_
_Review Schedule: Quarterly_
