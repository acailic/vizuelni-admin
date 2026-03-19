---
layout: home
hero:
  name: Vizualni Admin
  text: Serbian Open Data Visualization Tool
  tagline: Create beautiful, interactive visualizations from Serbian government data
  image:
    src: /hero-image.svg
    alt: Vizualni Admin Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View Demo
      link: https://acailic.github.io/vizualni-admin/
    - theme: alt
      text: GitHub
      link: https://github.com/acailic/vizualni-admin

features:
  - icon: 📊
    title: Rich Chart Library
    details: Support for line charts, bar charts, maps, scatter plots, and more with full customization options.
  - icon: 🇷🇸
    title: Serbian Data Integration
    details: Native integration with data.gov.rs API for seamless access to Serbian government datasets.
  - icon: 🌍
    title: Multilingual Support
    details: Full Serbian (Latin and Cyrillic) and English support with more languages coming soon.
  - icon: 📱
    title: Responsive Design
    details: Works perfectly on desktop, tablet, and mobile devices with touch-friendly interactions.
  - icon: ♿
    title: Accessibility First
    details: WCAG 2.1 compliant with screen reader support and keyboard navigation.
  - icon: 🔧
    title: Developer Friendly
    details: TypeScript-first with comprehensive APIs, easy embedding, and extensive customization.
  - icon: ⚡
    title: High Performance
    details: Built with Next.js, optimized for speed with server-side rendering and efficient data handling.
  - icon: 🎨
    title: Beautiful Theming
    details: Material-UI based with customizable themes to match your brand identity.

  footer: BSD-3-Clause License | Published with ❤️ by the Serbian open data community
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Add any home page specific JavaScript here
})
</script>

<div class="grid-container">
  <div class="workflow-section">
    <h2>How It Works</h2>
    <p>Go from raw public data to a clear chart in a few practical steps.</p>
    <div class="workflow-grid">
      <div class="workflow-card">
        <span class="workflow-step">1</span>
        <h3>Discover</h3>
        <p>Find a dataset from data.gov.rs or start with a curated example.</p>
      </div>
      <div class="workflow-card">
        <span class="workflow-step">2</span>
        <h3>Preview</h3>
        <p>Inspect the metadata and first rows to understand the dataset shape.</p>
      </div>
      <div class="workflow-card">
        <span class="workflow-step">3</span>
        <h3>Decide</h3>
        <p>Check whether the data is already chart-ready or needs cleanup first.</p>
      </div>
      <div class="workflow-card">
        <span class="workflow-step">4</span>
        <h3>Transform</h3>
        <p>Aggregate, filter, pivot, or compute percentages when the raw structure is not enough.</p>
      </div>
      <div class="workflow-card">
        <span class="workflow-step">5</span>
        <h3>Visualize</h3>
        <p>Generate a first chart, then refine labels, mappings, and presentation until the story is clear.</p>
      </div>
    </div>
    <div class="workflow-links">
      <a href="/DATASET_VISUALIZATION_TUTORIAL">Quick Tutorial</a>
      <a href="/DATASET_TO_VISUALIZATION_FLOW">Full Workflow</a>
      <a href="/DEVELOPER_DATASET_WORKFLOW">Developer Guide</a>
    </div>
  </div>

  <div class="demo-section">
    <h2>See It In Action</h2>
    <p>Explore interactive examples showcasing Vizualni Admin's capabilities</p>
    <div class="demo-grid">
      <a href="/examples/serbian-demographics" class="demo-card">
        <h3>Population Dynamics</h3>
        <p>Interactive visualization of Serbian demographic data</p>
        <span class="demo-tag">Population Data</span>
      </a>
      <a href="/examples/economic-indicators" class="demo-card">
        <h3>Economic Indicators</h3>
        <p>Track key economic metrics from Serbian government data</p>
        <span class="demo-tag">Economics</span>
      </a>
      <a href="/examples/regional-mapping" class="demo-card">
        <h3>Regional Mapping</h3>
        <p>Geographic visualizations of Serbian regions and municipalities</p>
        <span class="demo-tag">Maps</span>
      </a>
    </div>
  </div>
</div>

<style scoped>
.grid-container {
  margin-top: 2rem;
}

.workflow-section {
  text-align: center;
  padding: 3rem 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 0 0 3rem 0;
}

.workflow-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-brand-1);
}

.workflow-section p {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

.workflow-card {
  text-align: left;
  padding: 1.25rem;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
}

.workflow-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.workflow-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.1rem;
}

.workflow-card p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.workflow-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.workflow-links a {
  display: inline-block;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.2s ease;
}

.workflow-links a:hover {
  background: var(--vp-c-bg-soft);
  transform: translateY(-2px);
}

.demo-section {
  text-align: center;
  padding: 3rem 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 3rem 0;
}

.demo-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-brand-1);
}

.demo-section p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.demo-card {
  display: block;
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.demo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.demo-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-brand-1);
  font-size: 1.25rem;
}

.demo-card p {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.demo-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .workflow-grid {
    grid-template-columns: 1fr;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .workflow-section,
  .demo-section {
    padding: 2rem 0;
  }
}
</style>
