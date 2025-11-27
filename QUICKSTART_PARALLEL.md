# Quick Start Guide - Parallel Execution

**5 AI Terminals Can Work Simultaneously on Wave 1 Tasks**

---

## 🚀 Instant Start (Copy-Paste Commands)

### Terminal #1: Dataset Discovery Engine

```bash
# Navigate to project
cd ai_working/vizualni-admin

# Create branch
git checkout -b task-1a-dataset-discovery

# Create directory structure
mkdir -p amplifier/scenarios/dataset_discovery
cd amplifier/scenarios/dataset_discovery

# Create files
cat > README.md << 'EOF'
# Dataset Discovery Engine

Automated discovery of datasets from data.gov.rs uData API.

## Usage

```bash
python discover_datasets.py --category budget --min-results 5
```

## Features
- Serbian keyword expansion (budžet → budzet variations)
- Tag-based search fallback
- Pagination support
- JSON output compatible with demo config

## Requirements
- Python 3.11+
- requests library
EOF

# Start implementation
# TODO: Implement discover_datasets.py, query_expander.py, api_client.py, output_formatter.py
# See PARALLEL_TASKS.md Task 1A for detailed requirements
```

**Acceptance Criteria**:
- [ ] Finds 10+ datasets for "kvalitet vazduha"
- [ ] Output JSON format: `{ "id", "title", "organization", "tags", "format", "url" }`
- [ ] Works with Python 3.11+

---

### Terminal #2: Data Quality Scorer

```bash
cd ai_working/vizualni-admin

git checkout -b task-1b-quality-scorer

mkdir -p amplifier/scenarios/dataset_validation
cd amplifier/scenarios/dataset_validation

cat > README.md << 'EOF'
# Data Quality Scorer

Scores datasets on multiple quality dimensions (0.0-1.0).

## Scoring Components
- Completeness: 30% (% non-null values)
- Temporal Coverage: 20% (date ranges)
- Format Quality: 25% (CSV > JSON > XLS)
- Metadata Richness: 25% (description, tags)

## Usage

```bash
python data_quality_scorer.py --dataset-id abc123 --format CSV
```
EOF

# Start implementation
# TODO: Implement data_quality_scorer.py, completeness_checker.py, temporal_analyzer.py, format_ranker.py, metadata_scorer.py
```

**Acceptance Criteria**:
- [ ] Returns score 0.0-1.0 with component breakdown
- [ ] Handles CSV, JSON, XLS formats
- [ ] Graceful handling of missing data

---

### Terminal #3: Onboarding Wizard UI

```bash
cd ai_working/vizualni-admin

git checkout -b task-1c-onboarding-wizard

mkdir -p app/pages/onboarding
mkdir -p app/components/onboarding

cat > app/pages/onboarding/index.tsx << 'EOF'
/**
 * Onboarding Wizard - Main Entry Point
 *
 * 6-step wizard for new user onboarding:
 * 1. Welcome
 * 2. Language Selection
 * 3. Category Selection
 * 4. Dataset Browser
 * 5. Theme Customization
 * 6. Deployment Options
 */

export default function OnboardingWizard() {
  // TODO: Implement wizard with Material-UI Stepper
  // See PARALLEL_TASKS.md Task 1C for details
  return <div>Onboarding Wizard</div>;
}
EOF

# Create component stubs
touch app/components/onboarding/StepperWizard.tsx
touch app/components/onboarding/WelcomeStep.tsx
touch app/components/onboarding/LanguageSelection.tsx
# ... etc
```

**Acceptance Criteria**:
- [ ] All 6 steps render
- [ ] Progress saves to localStorage
- [ ] Generates valid config file
- [ ] Bilingual (SR/EN)
- [ ] Mobile responsive

---

### Terminal #4: Configuration System

```bash
cd ai_working/vizualni-admin

git checkout -b task-1d-configuration-system

mkdir -p app/lib/config
mkdir -p app/pages/config
mkdir -p app/components/config

cat > app/lib/config/schema.json << 'EOF'
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Vizualni Admin Configuration",
  "type": "object",
  "required": ["project", "categories"],
  "properties": {
    "project": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "language": { "enum": ["sr", "en"] },
        "theme": { "enum": ["light", "dark", "custom"] }
      }
    },
    "categories": {
      "type": "object",
      "properties": {
        "enabled": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}
EOF

# Create TypeScript types and validator
# TODO: Implement defaults.ts, validator.ts, types.ts
# TODO: Create visual config editor UI
```

**Acceptance Criteria**:
- [ ] JSON schema validates configs
- [ ] TypeScript types auto-generated
- [ ] Visual editor with live preview
- [ ] Import/export works

---

### Terminal #5: Client Dashboard

```bash
cd ai_working/vizualni-admin

git checkout -b task-1e-client-dashboard

mkdir -p app/pages/dashboard
mkdir -p app/components/dashboard

cat > app/pages/dashboard/index.tsx << 'EOF'
/**
 * Client Dashboard
 *
 * Main landing page for users showing:
 * - Welcome card
 * - Quick stats
 * - Category overview
 * - Recent visualizations
 * - Dataset health
 * - Quick actions
 */

import { Grid } from '@mui/material';

export default function Dashboard() {
  return (
    <Grid container spacing={3}>
      {/* TODO: Add dashboard components */}
      {/* See PARALLEL_TASKS.md Task 1E for layout */}
    </Grid>
  );
}
EOF

# Create component stubs
touch app/components/dashboard/WelcomeCard.tsx
touch app/components/dashboard/QuickStats.tsx
# ... etc
```

**Acceptance Criteria**:
- [ ] Desktop responsive
- [ ] Mobile responsive
- [ ] Stats display correctly
- [ ] Quick actions functional

---

## 📊 Progress Tracking

Create a shared tracking file:

```bash
cat > TASK_PROGRESS.md << 'EOF'
# Task Progress Tracker

## Wave 1 (Week 1)

| Task | Owner | Status | Started | Completed |
|------|-------|--------|---------|-----------|
| 1A: Dataset Discovery | Terminal #1 | 🔵 In Progress | 2025-01-27 | - |
| 1B: Quality Scorer | Terminal #2 | 🔵 In Progress | 2025-01-27 | - |
| 1C: Onboarding Wizard | Terminal #3 | 🔵 In Progress | 2025-01-27 | - |
| 1D: Configuration | Terminal #4 | 🔵 In Progress | 2025-01-27 | - |
| 1E: Dashboard | Terminal #5 | 🔵 In Progress | 2025-01-27 | - |

## Blockers
- None currently

## Questions
- None currently

## Completed Deliverables
- (List as tasks complete)
EOF
```

---

## 🔄 Workflow

### 1. Start Task
```bash
git checkout -b task-{id}-{name}
# e.g., git checkout -b task-1a-dataset-discovery
```

### 2. Implement
Follow the detailed requirements in `PARALLEL_TASKS.md`

### 3. Test Locally
```bash
# Python tasks
python -m pytest tests/

# TypeScript tasks
yarn test
yarn typecheck
```

### 4. Submit
```bash
git add .
git commit -m "feat: Complete Task {ID} - {Name}"
git push origin task-{id}-{name}

# Create PR on GitHub
```

### 5. Update Tracker
Mark task as ✅ Completed in `TASK_PROGRESS.md`

---

## 📁 Key Files

### Planning Docs (Read These First!)
- `PARALLEL_TASKS.md` - Detailed task specifications
- `ROADMAP.md` - 8-week sprint plan
- `IMPROVEMENT_AND_RELEASE_PLAN.md` - Comprehensive strategy
- `EXECUTIVE_SUMMARY.md` - Quick overview

### Progress Tracking
- `TASK_PROGRESS.md` - Shared progress tracker (create this)

### Coordination
- GitHub Project Board (recommended)
- Shared chat/Slack channel (optional)

---

## ⚡ Tips for Parallel Work

### Avoid Conflicts
- Each task has separate directories
- Minimal file overlap
- Use feature branches

### Communication
- Update `TASK_PROGRESS.md` daily
- Note blockers immediately
- Ask questions in shared chat

### Quality
- Run tests before committing
- Follow acceptance criteria strictly
- Document decisions in code comments

### Speed
- Don't wait for perfection
- Ship working code, iterate later
- Focus on acceptance criteria

---

## 🎯 Wave 1 Goals

**End of Week 1, we should have:**

✅ 5 completed tasks
✅ 100% independent (no blocking dependencies)
✅ All acceptance criteria met
✅ Tests passing
✅ Documentation complete
✅ Ready for Wave 2 integration

**Target**: Ship Wave 1 in 3-4 days with 5 terminals working in parallel!

---

## 📞 Getting Help

### Questions About Tasks
- See detailed specs in `PARALLEL_TASKS.md`
- Check acceptance criteria
- Review existing code in repo

### Technical Blockers
- Document in `TASK_PROGRESS.md`
- Create GitHub issue
- Ask in shared chat

### Need Clarification
- Refer to planning docs first
- Ask coordinator
- Propose solution and get approval

---

**Ready? Pick your task and start coding!** 🚀

**Remember**: All Wave 1 tasks are independent. You don't need to wait for anyone else!
