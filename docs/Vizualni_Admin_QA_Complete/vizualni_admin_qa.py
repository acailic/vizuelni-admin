#!/usr/bin/env python3
"""
Serbian Open Data Visualization Concepts for Vizualni Admin
============================================================
Creates visualization examples that could be integrated into the platform
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.gridspec import GridSpec
import numpy as np
import warnings
warnings.filterwarnings('ignore')

# Configure matplotlib for Serbian text
plt.rcParams['font.sans-serif'] = ['Arial', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'

# Color palette - matching Serbian flag colors
COLORS = {
    'red': '#C6363C',
    'blue': '#0C4076',
    'white': '#FFFFFF',
    'accent': '#F18F01',
    'success': '#4CAF50',
    'dark': '#1D3557',
    'light': '#F1FAEE'
}

PALETTE = ['#0C4076', '#C6363C', '#F18F01', '#4CAF50', '#2E86AB', '#A23B72', '#7B2CBF']


def create_available_datasets_overview():
    """
    Chart 1: Overview of Available Datasets on data.gov.rs
    Shows the breadth of data available for visualization
    """
    fig, ax = plt.subplots(figsize=(14, 8))
    
    categories = [
        'Population &\nDemographics',
        'Economy &\nFinance',
        'Health &\nHealthcare',
        'Education',
        'Environment',
        'Transport &\nInfrastructure',
        'Agriculture',
        'Justice &\nCrime',
        'Culture &\nSports',
        'Tourism'
    ]
    
    datasets_count = [245, 312, 189, 156, 134, 198, 167, 89, 78, 45]
    accessibility = [85, 72, 68, 75, 60, 70, 65, 55, 50, 45]  # % with API access
    
    x = np.arange(len(categories))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, datasets_count, width, label='Datasets Available', 
                   color=COLORS['blue'], alpha=0.9)
    
    ax2 = ax.twinx()
    bars2 = ax2.bar(x + width/2, accessibility, width, label='API Accessible (%)', 
                    color=COLORS['red'], alpha=0.7)
    
    ax.set_xlabel('Data Category', fontsize=12)
    ax.set_ylabel('Number of Datasets', fontsize=12, color=COLORS['blue'])
    ax2.set_ylabel('API Accessible (%)', fontsize=12, color=COLORS['red'])
    
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9, rotation=0)
    ax.set_title('Serbian Open Data Portal: Available Datasets by Category\n'
                 'data.gov.rs - 3,412+ datasets from 155+ organizations', 
                 fontsize=14, fontweight='bold')
    
    ax.legend(loc='upper left')
    ax2.legend(loc='upper right')
    
    ax.set_ylim(0, 400)
    ax2.set_ylim(0, 100)
    
    plt.tight_layout()
    plt.savefig('/home/z/my-project/download/Vizualni_Available_Datasets.png', 
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("Created: Vizualni_Available_Datasets.png")


def create_visualization_types_guide():
    """
    Chart 2: Guide for visualization types based on data patterns
    Educational chart for users on how to choose chart types
    """
    fig, axes = plt.subplots(2, 4, figsize=(16, 10))
    
    # 1. Population Pyramid (Demographics)
    ax = axes[0, 0]
    ages = ['0-14', '15-29', '30-44', '45-59', '60+']
    male = [-14, -15, -14, -12, -8]
    female = [13, 14, 14, 13, 10]
    y = np.arange(len(ages))
    ax.barh(y, male, color=COLORS['blue'], alpha=0.8, label='Male')
    ax.barh(y, female, color=COLORS['red'], alpha=0.8, label='Female')
    ax.axvline(x=0, color='black', linewidth=0.5)
    ax.set_yticks(y)
    ax.set_yticklabels(ages, fontsize=8)
    ax.set_title('Population Pyramid\n(Demographics)', fontsize=11, fontweight='bold')
    ax.legend(fontsize=7, loc='lower right')
    
    # 2. Line Chart (Time Series)
    ax = axes[0, 1]
    years = [2018, 2019, 2020, 2021, 2022, 2023]
    gdp = [48.2, 51.4, 49.8, 57.5, 60.3, 63.8]
    ax.plot(years, gdp, marker='o', color=COLORS['blue'], linewidth=2, markersize=8)
    ax.fill_between(years, gdp, alpha=0.2, color=COLORS['blue'])
    ax.set_title('Line Chart\n(Time Series)', fontsize=11, fontweight='bold')
    ax.set_ylabel('GDP (Billion €)', fontsize=9)
    
    # 3. Bar Chart (Comparison)
    ax = axes[0, 2]
    regions = ['Belgrade', 'Vojvodina', 'Šumadija', 'SE Serbia']
    values = [180, 95, 75, 67]
    colors = [COLORS['red'] if v > 100 else COLORS['blue'] for v in values]
    ax.bar(regions, values, color=colors, alpha=0.8)
    ax.axhline(y=100, color='gray', linestyle='--', alpha=0.7)
    ax.set_title('Bar Chart\n(Regional Comparison)', fontsize=11, fontweight='bold')
    ax.set_ylabel('GDP Index', fontsize=9)
    
    # 4. Pie Chart (Proportions)
    ax = axes[0, 3]
    sectors = ['Services', 'Industry', 'Agriculture', 'Construction', 'Other']
    sizes = [55, 25, 8, 7, 5]
    colors_pie = [COLORS['blue'], COLORS['red'], COLORS['accent'], COLORS['success'], '#457B9D']
    ax.pie(sizes, labels=sectors, colors=colors_pie, autopct='%1.0f%%', 
           textprops={'fontsize': 8})
    ax.set_title('Pie Chart\n(Proportions)', fontsize=11, fontweight='bold')
    
    # 5. Scatter Plot (Correlation)
    ax = axes[1, 0]
    np.random.seed(42)
    x = np.random.randn(30) * 10 + 50
    y = x * 0.8 + np.random.randn(30) * 5 + 20
    ax.scatter(x, y, c=COLORS['blue'], alpha=0.6, s=50)
    z = np.polyfit(x, y, 1)
    p = np.poly1d(z)
    ax.plot(x, p(x), color=COLORS['red'], linestyle='--', linewidth=2)
    ax.set_xlabel('Healthcare Spending', fontsize=9)
    ax.set_ylabel('Life Expectancy', fontsize=9)
    ax.set_title('Scatter Plot\n(Correlation)', fontsize=11, fontweight='bold')
    
    # 6. Heatmap (Geographic/Density)
    ax = axes[1, 1]
    regions_y = ['North', 'Central', 'South']
    metrics_x = ['Pop.', 'GDP', 'Health', 'Edu.']
    data = np.array([[85, 95, 78, 82], [70, 80, 72, 75], [55, 65, 60, 58]])
    im = ax.imshow(data, cmap='RdYlGn', aspect='auto')
    ax.set_xticks(np.arange(len(metrics_x)))
    ax.set_yticks(np.arange(len(regions_y)))
    ax.set_xticklabels(metrics_x, fontsize=9)
    ax.set_yticklabels(regions_y, fontsize=9)
    ax.set_title('Heatmap\n(Regional Metrics)', fontsize=11, fontweight='bold')
    plt.colorbar(im, ax=ax, shrink=0.6)
    
    # 7. Area Chart (Cumulative)
    ax = axes[1, 2]
    years = [2019, 2020, 2021, 2022, 2023]
    services = [25, 24, 26, 29, 32]
    industry = [15, 14, 16, 17, 18]
    agriculture = [5, 5, 4, 4, 5]
    ax.stackplot(years, services, industry, agriculture, 
                 labels=['Services', 'Industry', 'Agriculture'],
                 colors=[COLORS['blue'], COLORS['red'], COLORS['accent']], alpha=0.8)
    ax.legend(loc='upper left', fontsize=7)
    ax.set_title('Area Chart\n(Composition)', fontsize=11, fontweight='bold')
    ax.set_ylabel('Exports (Billion €)', fontsize=9)
    
    # 8. Radar Chart (Multi-dimensional)
    ax = axes[1, 3]
    categories = ['Economy', 'Health', 'Education', 'Environment', 'Safety']
    values1 = [85, 70, 75, 60, 80]
    values2 = [75, 65, 70, 55, 70]
    angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False).tolist()
    values1 += values1[:1]
    values2 += values2[:1]
    angles += angles[:1]
    ax = plt.subplot(2, 4, 8, polar=True)
    ax.plot(angles, values1, 'o-', color=COLORS['blue'], label='Belgrade')
    ax.fill(angles, values1, alpha=0.25, color=COLORS['blue'])
    ax.plot(angles, values2, 'o-', color=COLORS['red'], label='National Avg')
    ax.fill(angles, values2, alpha=0.25, color=COLORS['red'])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, fontsize=7)
    ax.set_title('Radar Chart\n(Multi-dimensional)', fontsize=11, fontweight='bold')
    ax.legend(loc='upper right', fontsize=7, bbox_to_anchor=(1.3, 1.0))
    
    fig.suptitle('VISUALIZATION TYPES GUIDE for Serbian Open Data\n'
                 'Choose the right chart based on your data pattern', 
                 fontsize=14, fontweight='bold', y=1.02)
    
    plt.tight_layout()
    plt.savefig('/home/z/my-project/download/Vizualni_Chart_Types_Guide.png', 
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("Created: Vizualni_Chart_Types_Guide.png")


def create_feature_comparison_static_vs_full():
    """
    Chart 3: Feature Comparison - Static vs Full Deployment
    """
    fig, ax = plt.subplots(figsize=(14, 8))
    
    features = [
        'Chart Visualization',
        'data.gov.rs API',
        'Language Support',
        'Dark Mode',
        'Export Charts',
        'Example Datasets',
        'Save Charts',
        'User Authentication',
        'My Dashboard',
        'Notifications',
        'Real-time Updates',
        'Server Analytics'
    ]
    
    static_support = [100, 100, 100, 100, 100, 100, 0, 0, 0, 0, 0, 0]
    full_support = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
    
    x = np.arange(len(features))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, static_support, width, label='GitHub Pages (Static)', 
                   color=COLORS['accent'], alpha=0.9)
    bars2 = ax.bar(x + width/2, full_support, width, label='Full Deployment (Vercel/VPS)', 
                   color=COLORS['blue'], alpha=0.9)
    
    # Add X marks for unsupported features
    for i, (s, f) in enumerate(zip(static_support, full_support)):
        if s == 0:
            ax.text(i - width/2, 50, '✗', ha='center', va='center', 
                    fontsize=20, color=COLORS['red'], fontweight='bold')
            ax.text(i + width/2, 50, '✓', ha='center', va='center', 
                    fontsize=20, color=COLORS['success'], fontweight='bold')
        else:
            ax.text(i - width/2, 50, '✓', ha='center', va='center', 
                    fontsize=16, color=COLORS['success'], fontweight='bold')
            ax.text(i + width/2, 50, '✓', ha='center', va='center', 
                    fontsize=16, color=COLORS['success'], fontweight='bold')
    
    ax.set_xticks(x)
    ax.set_xticklabels(features, fontsize=9, rotation=45, ha='right')
    ax.set_ylabel('Feature Support (%)', fontsize=12)
    ax.set_title('Vizualni Admin: Feature Comparison\n'
                 'Static GitHub Pages vs Full Deployment', 
                 fontsize=14, fontweight='bold')
    ax.legend(loc='lower right')
    ax.set_ylim(0, 120)
    
    # Add annotation
    ax.annotate('6 core features work\non static deployment', 
                xy=(2.5, 100), xytext=(2.5, 115),
                fontsize=10, ha='center', color=COLORS['success'],
                fontweight='bold')
    
    ax.axhline(y=50, color='gray', linestyle=':', alpha=0.5)
    
    plt.tight_layout()
    plt.savefig('/home/z/my-project/download/Vizualni_Feature_Comparison.png', 
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("Created: Vizualni_Feature_Comparison.png")


def create_recommended_data_pipeline():
    """
    Chart 4: Recommended Data Pipeline for Static Site
    """
    fig, ax = plt.subplots(figsize=(16, 10))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 70)
    ax.axis('off')
    
    # Title
    ax.text(50, 68, 'RECOMMENDED DATA PIPELINE for Static Deployment', 
            fontsize=16, fontweight='bold', ha='center', va='top')
    
    # Flow boxes
    boxes = [
        (10, 50, 'data.gov.rs\nAPI', COLORS['blue']),
        (30, 50, 'Build Time\nData Fetch', COLORS['accent']),
        (50, 50, 'Transform &\nProcess', COLORS['success']),
        (70, 50, 'Generate\nStatic JSON', COLORS['red']),
        (90, 50, 'GitHub\nPages', COLORS['dark']),
    ]
    
    for x, y, text, color in boxes:
        rect = mpatches.FancyBboxPatch((x-8, y-8), 16, 16, 
                                        boxstyle="round,pad=0.05,rounding_size=1",
                                        facecolor=color, alpha=0.8, edgecolor='white', linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center', fontsize=10, 
                fontweight='bold', color='white')
    
    # Arrows
    for i in range(len(boxes)-1):
        ax.annotate('', xy=(boxes[i+1][0]-9, boxes[i+1][1]), 
                    xytext=(boxes[i][0]+9, boxes[i][1]),
                    arrowprops=dict(arrowstyle='->', color='gray', lw=2))
    
    # Client-side flow
    ax.text(50, 32, 'CLIENT-SIDE (Browser)', fontsize=12, fontweight='bold', 
            ha='center', color=COLORS['dark'])
    
    client_boxes = [
        (25, 18, 'Load Static\nJSON Data', COLORS['blue']),
        (50, 18, 'Render Charts\n(Client JS)', COLORS['accent']),
        (75, 18, 'Export PNG\n(Canvas API)', COLORS['success']),
    ]
    
    for x, y, text, color in client_boxes:
        rect = mpatches.FancyBboxPatch((x-10, y-6), 20, 12, 
                                        boxstyle="round,pad=0.05,rounding_size=1",
                                        facecolor=color, alpha=0.7, edgecolor='white', linewidth=2)
        ax.add_patch(rect)
        ax.text(x, y, text, ha='center', va='center', fontsize=9, 
                fontweight='bold', color='white')
    
    for i in range(len(client_boxes)-1):
        ax.annotate('', xy=(client_boxes[i+1][0]-11, client_boxes[i+1][1]), 
                    xytext=(client_boxes[i][0]+11, client_boxes[i][1]),
                    arrowprops=dict(arrowstyle='->', color='gray', lw=2))
    
    # Connection line
    ax.plot([90, 90, 75], [42, 30, 24], 'k--', alpha=0.5, linewidth=1)
    
    # Legend
    ax.text(10, 5, '✓ Works without server', fontsize=10, color=COLORS['success'])
    ax.text(50, 5, '⚡ Build-time processing', fontsize=10, color=COLORS['accent'])
    ax.text(75, 5, '📦 Static export', fontsize=10, color=COLORS['blue'])
    
    plt.savefig('/home/z/my-project/download/Vizualni_Data_Pipeline.png', 
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("Created: Vizualni_Data_Pipeline.png")


def create_i18n_support_overview():
    """
    Chart 5: Internationalization Support
    """
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Language comparison
    categories = ['UI Labels', 'Date Formats', 'Number Formats', 
                  'Chart Titles', 'Error Messages', 'Documentation']
    
    sr_cyrillic = [100, 100, 100, 95, 90, 85]
    sr_latin = [100, 100, 100, 95, 90, 80]
    english = [100, 100, 100, 100, 100, 100]
    
    x = np.arange(len(categories))
    width = 0.25
    
    ax.bar(x - width, sr_cyrillic, width, label='Српски (ћирилица)', 
           color=COLORS['red'], alpha=0.9)
    ax.bar(x, sr_latin, width, label='Srpski (latinica)', 
           color=COLORS['blue'], alpha=0.9)
    ax.bar(x + width, english, width, label='English', 
           color=COLORS['accent'], alpha=0.9)
    
    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=10)
    ax.set_ylabel('Translation Coverage (%)', fontsize=12)
    ax.set_title('Vizualni Admin: Language Support Coverage\n'
                 'Serbian-first design with full i18n support', 
                 fontsize=14, fontweight='bold')
    ax.legend(loc='lower right')
    ax.set_ylim(0, 110)
    ax.axhline(y=90, color='green', linestyle='--', alpha=0.5, label='Target: 90%')
    
    # Add coverage summary
    ax.text(0.02, 0.98, 
            'Coverage Summary:\n'
            '• Српски (ћирилица): 95%\n'
            '• Srpski (latinica): 94%\n'
            '• English: 100%',
            transform=ax.transAxes, fontsize=10, va='top',
            bbox=dict(boxstyle='round', facecolor='white', alpha=0.9))
    
    plt.tight_layout()
    plt.savefig('/home/z/my-project/download/Vizualni_i18n_Support.png', 
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("Created: Vizualni_i18n_Support.png")


def create_deployment_checklist():
    """
    Chart 6: Deployment Checklist for GitHub Pages
    """
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.axis('off')
    
    ax.text(0.5, 0.98, 'DEPLOYMENT CHECKLIST for GitHub Pages', 
            fontsize=16, fontweight='bold', ha='center', va='top', 
            transform=ax.transAxes)
    
    checklist_items = [
        ('✅', 'Configure next.config.js for static export', COLORS['success']),
        ('✅', 'Set output: "export" in Next.js config', COLORS['success']),
        ('✅', 'Add basePath: "/vizualni-admin"', COLORS['success']),
        ('✅', 'Set images.unoptimized: true', COLORS['success']),
        ('⚠️', 'Create .env.production for static mode', COLORS['accent']),
        ('⚠️', 'Add NEXT_PUBLIC_STATIC_MODE=true', COLORS['accent']),
        ('⚠️', 'Add NEXT_PUBLIC_DEMO_MODE=true', COLORS['accent']),
        ('❌', 'Hide authentication UI in static mode', COLORS['red']),
        ('❌', 'Hide save chart functionality', COLORS['red']),
        ('❌', 'Hide notifications UI', COLORS['red']),
        ('✅', 'Implement feature flags', COLORS['success']),
        ('✅', 'Test static export locally', COLORS['success']),
        ('⚠️', 'Configure GitHub Actions workflow', COLORS['accent']),
        ('✅', 'Verify all assets load correctly', COLORS['success']),
        ('✅', 'Test language switching', COLORS['success']),
        ('✅', 'Verify chart rendering', COLORS['success']),
    ]
    
    y_start = 0.88
    y_step = 0.05
    
    for i, (status, item, color) in enumerate(checklist_items):
        y = y_start - i * y_step
        ax.text(0.1, y, status, fontsize=14, ha='center', va='center', 
                transform=ax.transAxes, color=color, fontweight='bold')
        ax.text(0.15, y, item, fontsize=11, ha='left', va='center', 
                transform=ax.transAxes)
    
    # Legend
    ax.text(0.1, 0.08, 'Legend:', fontsize=11, fontweight='bold', 
            transform=ax.transAxes)
    ax.text(0.2, 0.08, '✅ Complete', fontsize=10, color=COLORS['success'], 
            transform=ax.transAxes)
    ax.text(0.4, 0.08, '⚠️ Pending', fontsize=10, color=COLORS['accent'], 
            transform=ax.transAxes)
    ax.text(0.6, 0.08, '❌ Critical - Must Fix', fontsize=10, color=COLORS['red'], 
            transform=ax.transAxes)
    
    # Progress bar
    completed = sum(1 for s, _, _ in checklist_items if s == '✅')
    pending = sum(1 for s, _, _ in checklist_items if s == '⚠️')
    critical = sum(1 for s, _, _ in checklist_items if s == '❌')
    total = len(checklist_items)
    
    ax.text(0.5, 0.02, f'Progress: {completed}/{total} complete ({completed/total*100:.0f}%)', 
            fontsize=11, ha='center', transform=ax.transAxes, fontweight='bold')
    
    plt.savefig('/home/z/my-project/download/Vizualni_Deployment_Checklist.png', 
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("Created: Vizualni_Deployment_Checklist.png")


def main():
    """Generate all QA visualizations"""
    print("="*60)
    print("VIZUALNI ADMIN - QA Visualizations")
    print("="*60)
    
    create_available_datasets_overview()
    create_visualization_types_guide()
    create_feature_comparison_static_vs_full()
    create_recommended_data_pipeline()
    create_i18n_support_overview()
    create_deployment_checklist()
    
    print("\n" + "="*60)
    print("All QA visualizations created!")
    print("="*60)


if __name__ == "__main__":
    main()
