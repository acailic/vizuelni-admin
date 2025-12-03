// Fix ISR conflicts by removing revalidate properties
const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/pages/index.tsx',
  'app/pages/browse/index.tsx',
  'app/pages/serbian-data.tsx',
  'app/pages/demos/index.tsx',
  'app/pages/demos/climate.tsx'
];

filesToFix.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove revalidate lines
    content = content.replace(/^\s*revalidate:\s*\d+.*$/gm, '');

    // Remove trailing commas from export objects
    content = content.replace(/,(\s*\})/g, '$1');

    fs.writeFileSync(fullPath, content);
    console.log(`Fixed ISR in ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});