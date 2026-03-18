#!/bin/bash

# Phase 2 Quick Start Script
# Sets up the development environment for Phase 2 features

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         Phase 2 Development Environment Setup                    ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git is required but not installed."; exit 1; }

echo "✅ Prerequisites met"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create directory structure
echo "📁 Creating Phase 2 directory structure..."

# Tutorial directories
mkdir -p src/lib/tutorials/tutorials/citizen-explorer
mkdir -p src/lib/tutorials/tutorials/developer-quickstart
mkdir -p src/lib/tutorials/tutorials/government-integration
mkdir -p src/lib/tutorials/tutorials/data-journalism
mkdir -p src/components/tutorials
mkdir -p src/app/\[locale\]/tutorials/\[tutorialId\]

# Geo directories
mkdir -p src/lib/geo
mkdir -p src/components/charts/map

# Dashboard directories
mkdir -p src/lib/dashboards
mkdir -p src/components/dashboards

# Export directories
mkdir -p src/lib/export

# Comparison directories
mkdir -p src/lib/comparison
mkdir -p src/components/comparison

echo "✅ Directory structure created"
echo ""

# Display next steps
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                  Setup Complete! 🎉                              ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📚 Next steps:"
echo "  1. Read docs/PHASE2_ONBOARDING_GUIDE.md"
echo "  2. Review docs/PHASE2_INDEX.md"
echo "  3. Start with Feature 39 (Interactive Tutorials)"
echo ""
echo "🚀 Ready to start development!"
echo ""
echo "Run: npm run dev"
echo ""
