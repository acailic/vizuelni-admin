# Vizualni Starter Template

A quick-start template for building data visualizations with Serbian government data using `@vizualni/charts`.

## Quick Start

### Option 1: StackBlitz (No Install)

Click the button below to open this template in StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/acailic/vizualni-admin)

### Option 2: Local Development

```bash
# Clone the template
npx create-next-app@latest my-vizualni-app --example https://github.com/acailic/vizualni-admin

# Or use degit
npx degit acailic/vizualni-admin my-vizualni-app

cd my-vizualni-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## What's Included

- **@vizualni/charts** - Chart components (Bar, Line, Pie, etc.)
- **@vizualni/data** - Serbian geographic and administrative data
- **@vizualni/sample-data** - Sample datasets for testing

## Example Usage

```tsx
import { BarChart } from '@vizualni/charts';

const data = [
  { region: 'Belgrade', population: 1688000 },
  { region: 'Vojvodina', population: 1895000 },
];

export default function Chart() {
  return (
    <BarChart
      data={data}
      xField='region'
      yField='population'
      title='Population by Region'
      options={{
        showGrid: true,
        showLegend: true,
        colors: ['#0D4077'],
      }}
    />
  );
}
```

## Features

- 🇷🇸 **Serbian data support** - Cyrillic, Latin, and English scripts
- 📊 **Multiple chart types** - Bar, Line, Pie, Area, Scatter, Map
- 🎨 **Customizable** - Colors, styling, and theming
- 📱 **Responsive** - Works on all screen sizes
- 🌙 **Dark mode** - Built-in dark mode support

## Learn More

- [Documentation](https://github.com/vizualni/vizualni-admin-srbije#readme)
- [Demo Gallery](https://vizualni.rs/demo-gallery)
- [Sample Data](https://vizualni.rs/data)

## License

MIT
