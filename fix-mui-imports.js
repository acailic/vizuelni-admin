// Fix for MUI X packages directory import issue
// This patches the ES module exports to use index.js instead of directory imports

const fs = require('fs');
const path = require('path');

// Fix for @mui/utils/composeClasses
const composeClassesPath = require.resolve('@mui/utils/composeClasses');
const composeClassesDir = path.dirname(composeClassesPath);
const composeClassesIndexPath = path.join(composeClassesDir, 'index.js');

if (fs.existsSync(composeClassesIndexPath)) {
  // Create a package.json that exports index.js
  const packageJsonPath = path.join(composeClassesDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(packageJsonPath, JSON.stringify({
      type: 'module',
      main: './index.js',
      exports: {
        '.': './index.js'
      }
    }, null, 2));
  }
}

// Similar fix for @mui/material/Alert
const alertPath = require.resolve('@mui/material/Alert');
if (fs.existsSync(alertPath)) {
  const alertDir = path.dirname(alertPath);
  const packageJsonPath = path.join(alertDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(packageJsonPath, JSON.stringify({
      type: 'module',
      main: './index.js',
      exports: {
        '.': './index.js'
      }
    }, null, 2));
  }
}

console.log('MUI import fixes applied');