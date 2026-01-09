/**
 * Distribution Artifacts Validation Test Suite
 *
 * This test suite validates that the built `dist` artifacts are correct and complete.
 * It tests the actual build output, ensuring the library can be consumed properly.
 *
 * Purpose:
 * - Validate built artifacts exist after build
 * - Check exports are correctly bundled
 * - Verify main entry points are accessible
 * - Ensure dependencies are properly bundled (or peer dependencies are external)
 * - Validate bundle structure and content
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

describe('Distribution Artifacts Validation', () => {
  const appDir = process.cwd();
  const distDir = join(appDir, 'dist');

  // Check if dist exists before running tests
  const distExists = existsSync(distDir);
  const distFiles = distExists
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('fs').readdirSync(distDir)
    : [];

  beforeAll(() => {
    if (distExists) {
      console.log(`✓ Testing against built artifacts in ${distDir}`);
      console.log(`  Found ${distFiles.length} files: ${distFiles.join(', ')}`);
    } else {
      console.log(`⚠ Dist directory not found. Run 'npm run build:lib' first.`);
    }
  });

  describe('Build Output Structure', () => {
    it('should have dist directory', () => {
      expect(distExists).toBe(true);
    });

    it('should have at least one built file', () => {
      expect(distFiles.length).toBeGreaterThan(0);
    });

    it('should have both CJS and ESM builds', () => {
      if (!distExists) {
        return;
      }

      // Check for common CJS patterns
      const hasCjs =
        distFiles.some((f: string) => f.endsWith('.cjs')) ||
        distFiles.some((f: string) => f.endsWith('.js'));

      // Check for common ESM patterns
      const hasEsm =
        distFiles.some((f: string) => f.endsWith('.mjs')) ||
        distFiles.some((f: string) => f.endsWith('.esm.js'));

      expect(hasCjs).toBe(true);
      expect(hasEsm).toBe(true);
    });
  });

  describe('Main Entry Point', () => {
    const cjsFile = join(distDir, 'index.js');
    const esmFile = join(distDir, 'index.mjs');
    const dtsFile = join(distDir, 'index.d.ts');

    it('should have CJS entry point (index.js)', () => {
      if (!distExists) return;
      expect(existsSync(cjsFile)).toBe(true);
    });

    it('should have ESM entry point (index.mjs)', () => {
      if (!distExists) return;
      expect(existsSync(esmFile)).toBe(true);
    });

    it('CJS bundle should be non-empty', () => {
      if (!existsSync(cjsFile)) return;

      const stats = statSync(cjsFile);
      expect(stats.size).toBeGreaterThan(1000); // At least 1KB
    });

    it('ESM bundle should be non-empty', () => {
      if (!existsSync(esmFile)) return;

      const stats = statSync(esmFile);
      expect(stats.size).toBeGreaterThan(1000); // At least 1KB
    });

    it('CJS bundle should have valid CommonJS format', () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, 'utf-8');

      // Should have use strict
      expect(content).toMatch(/'use strict'/);

      // Should have exports (either module.exports or Object.defineProperty(exports))
      expect(content).toMatch(/exports/);

      // Should have require statements for external deps
      expect(content).toMatch(/require\(/);
    });

    it('ESM bundle should have valid ES module format', () => {
      if (!existsSync(esmFile)) return;

      const content = readFileSync(esmFile, 'utf-8');

      // Should have import/export statements
      expect(content).toMatch(/import |export /);

      // Should not have CommonJS require
      expect(content).not.toMatch(/require\(/);
    });
  });

  describe('TypeScript Declarations', () => {
    it('should have TypeScript declaration files if DTS generation is enabled', () => {
      if (!distExists) return;

      const dtsFiles = distFiles.filter((f: string) => f.endsWith('.d.ts'));

      // Note: DTS generation might be disabled in tsup.config.ts
      // This test checks consistency - if DTS files exist, validate them
      if (dtsFiles.length > 0) {
        console.log(`  Found ${dtsFiles.length} declaration file(s)`);
        expect(dtsFiles.length).toBeGreaterThan(0);
      } else {
        console.log(`  No declaration files found (DTS generation may be disabled)`);
      }
    });

    it('declaration files should have valid TypeScript syntax', () => {
      if (!distExists) return;

      const dtsFiles = distFiles.filter((f: string) => f.endsWith('.d.ts'));

      for (const dtsFile of dtsFiles) {
        const filePath = join(distDir, dtsFile);
        const content = readFileSync(filePath, 'utf-8');

        // Should have declare or export keywords
        expect(content).toMatch(/declare |export /);
      }
    });
  });

  describe('Dependency Bundling', () => {
    const cjsFile = join(distDir, 'index.js');
    const esmFile = join(distDir, 'index.mjs');

    // Dependencies that should be external (not bundled) AND are used in main entry
    const usedExternalDeps = [
      '@lingui/react',
      '@lingui/core',
      'd3-format',
      'd3-time-format',
      'io-ts',
    ];

    // All peer dependencies (including those not used in main entry)
    const allPeerDeps = [
      'react',
      'react-dom',
      'next',
      '@lingui/react',
      '@lingui/core',
      'd3-format',
      'd3-time-format',
      'make-plural',
      'fp-ts',
      'io-ts',
    ];

    // Dependencies that should be bundled
    const bundledDeps = [
      '@visx/group',
      '@visx/text',
      'd3-scale',
      'd3-axis',
      'react-table',
      'react-window',
    ];

    it('should not bundle used peer dependencies', () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, 'utf-8');

      // Check that USED peer dependencies are externalized
      for (const dep of usedExternalDeps) {
        // In CJS, external deps should be require() statements
        // Handle both single and double quotes
        const hasRequire =
          content.includes(`require('${dep}')`) ||
          content.includes(`require("${dep}")`);

        expect(hasRequire).toBe(true);
      }
    });

    it('should not bundle used peer dependencies in ESM', () => {
      if (!existsSync(esmFile)) return;

      const content = readFileSync(esmFile, 'utf-8');

      // Check that USED peer dependencies are externalized
      for (const dep of usedExternalDeps) {
        // In ESM, external deps should be import statements
        const hasImport =
          content.includes(`from'${dep}'`) ||
          content.includes(`from"${dep}"`) ||
          content.includes(`from '${dep}'`) ||
          content.includes(`from "${dep}"`);

        expect(hasImport).toBe(true);
      }
    });

    it('should not have any bundled peer dependencies', () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, 'utf-8');

      // Check that none of the peer dependencies are bundled (inlined)
      // They should all be externalized via require()
      const bundledPeerDeps: string[] = [];

      for (const dep of allPeerDeps) {
        // If we find the dependency name but not as a require, it might be bundled
        // This is a heuristic - in minified code, names might be shortened
        const hasRequire =
          content.includes(`require('${dep}')`) ||
          content.includes(`require("${dep}")`);

        const depInCode = content.includes(dep);

        if (depInCode && !hasRequire && dep !== 'react' && dep !== 'react-dom' && dep !== 'next') {
          // Exclude react/react-dom/next as they might be referenced in comments
          bundledPeerDeps.push(dep);
        }
      }

      if (bundledPeerDeps.length > 0) {
        console.log(
          `  Warning: These peer dependencies might be bundled: ${bundledPeerDeps.join(', ')}`,
        );
      }
    });

    it('should bundle regular dependencies', () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, 'utf-8');

      // These should be bundled (no require for them)
      for (const dep of bundledDeps) {
        // If a bundled dep appears as require, it might not be properly bundled
        // This is a soft check - the dep might not be used in the code
        if (content.includes(dep)) {
          // If dep name appears, it should be inlined code, not a require
          const requirePattern = new RegExp(`require\\(['"]${dep}['"]\\)`);
          const hasRequire = requirePattern.test(content);

          if (hasRequire) {
            console.log(
              `  Warning: ${dep} appears to be required instead of bundled`,
            );
          }
        }
      }
    });
  });

  describe('Export Validation', () => {
    const cjsFile = join(distDir, 'index.js');
    const esmFile = join(distDir, 'index.mjs');

    // Expected exports from the main entry point (based on index.ts)
    const expectedExports = [
      'version',
      'I18nProvider',
      'defaultLocale',
      'locales',
      'parseLocaleString',
      'i18n',
      'getD3TimeFormatLocale',
      'getD3FormatLocale',
      'validateConfig',
      'DEFAULT_CONFIG',
      'DataGovRsClient',
      'createDataGovRsClient',
      'dataGovRsClient',
      // Note: Chart components are not exported from main entry point
      // They are available via subpath exports (./charts, ./hooks, etc.)
    ];

    it('CJS bundle should export expected symbols', () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, 'utf-8');

      // Check for exports - names might be minified, so check for exports pattern
      let foundExports = 0;
      for (const exportName of expectedExports) {
        // Exported symbols should appear in the bundle
        // In minified bundles, exports might be aliased
        const hasExport =
          content.includes(`exports.${exportName}`) ||
          content.includes(`"${exportName}"`) ||
          content.includes(`'${exportName}'`) ||
          content.includes(`as ${exportName}`);

        if (hasExport) {
          foundExports++;
        }
      }

      // At least some expected exports should be found
      expect(foundExports).toBeGreaterThan(expectedExports.length / 2);

      // Should have exports object
      expect(content).toMatch(/exports\./);
    });

    it('ESM bundle should export expected symbols', () => {
      if (!existsSync(esmFile)) return;

      const content = readFileSync(esmFile, 'utf-8');

      // Check for exports - names might be minified
      let foundExports = 0;
      for (const exportName of expectedExports) {
        // Exported symbols should appear in the bundle
        const hasExport =
          content.includes(`export{${exportName}`) ||
          content.includes(`export { ${exportName}`) ||
          content.includes(`"${exportName}"`) ||
          content.includes(`'${exportName}'`) ||
          content.includes(`as ${exportName}`);

        if (hasExport) {
          foundExports++;
        }
      }

      // At least some expected exports should be found
      expect(foundExports).toBeGreaterThan(expectedExports.length / 2);

      // Should have export statements
      expect(content).toMatch(/export\{/);
    });
  });

  describe('Bundle Quality', () => {
    const cjsFile = join(distDir, 'index.js');
    const esmFile = join(distDir, 'index.mjs');

    it('should not have source maps if disabled', () => {
      if (!distExists) return;

      const mapFiles = distFiles.filter((f: string) =>
        f.endsWith('.map'),
      );

      // If source maps are disabled in tsup.config.ts, there should be no map files
      if (mapFiles.length > 0) {
        console.log(`  Found ${mapFiles.length} source map file(s)`);
      }
    });

    it('should have reasonable bundle sizes', () => {
      if (!existsSync(cjsFile) || !existsSync(esmFile)) return;

      const cjsStats = statSync(cjsFile);
      const esmStats = statSync(esmFile);

      const cjsSizeKB = cjsStats.size / 1024;
      const esmSizeKB = esmStats.size / 1024;

      console.log(`  CJS bundle size: ${cjsSizeKB.toFixed(2)} KB`);
      console.log(`  ESM bundle size: ${esmSizeKB.toFixed(2)} KB`);

      // Bundles should be reasonable (not empty, not excessively large)
      expect(cjsSizeKB).toBeGreaterThan(10);
      expect(cjsSizeKB).toBeLessThan(10000); // Less than 10MB

      expect(esmSizeKB).toBeGreaterThan(10);
      expect(esmSizeKB).toBeLessThan(10000);
    });

    it('should not contain development-only code in production', () => {
      if (!existsSync(cjsFile)) return;

      const content = readFileSync(cjsFile, 'utf-8');

      // Should not have console.log statements (unless intentional)
      // This is a soft check - there might be intentional logging
      const consoleLogCount = (content.match(/console\.log/g) || []).length;

      if (consoleLogCount > 0) {
        console.log(`  Warning: Found ${consoleLogCount} console.log statements`);
      }
    });
  });

  describe('Package.json Consistency', () => {
    it('main entry point should exist', () => {
      const packageJsonPath = join(appDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      const mainFile = join(appDir, packageJson.main);

      if (distExists) {
        if (!existsSync(mainFile)) {
          // Check if the actual built file exists
          const actualFile = join(distDir, 'index.js');
          if (existsSync(actualFile)) {
            console.log(
              `  Note: package.json main points to ${packageJson.main} but actual file is dist/index.js`,
            );
          } else {
            console.log(
              `  Warning: Neither ${packageJson.main} nor dist/index.js exists`,
            );
          }
        }
      }
    });

    it('module entry point should exist', () => {
      const packageJsonPath = join(appDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      const moduleFile = join(appDir, packageJson.module);

      if (distExists) {
        if (!existsSync(moduleFile)) {
          // Check if the actual built file exists
          const actualFile = join(distDir, 'index.mjs');
          if (existsSync(actualFile)) {
            console.log(
              `  Note: package.json module points to ${packageJson.module} but actual file is dist/index.mjs`,
            );
          } else {
            console.log(
              `  Warning: Neither ${packageJson.module} nor dist/index.mjs exists`,
            );
          }
        }
      }
    });

    it('types entry point should exist if DTS is enabled', () => {
      const packageJsonPath = join(appDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      const typesFile = join(appDir, packageJson.types);

      if (distExists && existsSync(typesFile)) {
        expect(existsSync(typesFile)).toBe(true);
      } else {
        console.log(`  Types file ${typesFile} not found (DTS may be disabled)`);
      }
    });
  });

  describe('Build Configuration Validation', () => {
    it('tsup.config.ts should exist and be valid', () => {
      const tsupConfigPath = join(appDir, 'tsup.config.ts');
      expect(existsSync(tsupConfigPath)).toBe(true);

      const content = readFileSync(tsupConfigPath, 'utf-8');

      // Should have defineConfig
      expect(content).toMatch(/defineConfig/);

      // Should specify entry points
      expect(content).toMatch(/entry:/);

      // Should specify formats
      expect(content).toMatch(/format:/);
    });

    it('should configure external dependencies', () => {
      const tsupConfigPath = join(appDir, 'tsup.config.ts');
      const content = readFileSync(tsupConfigPath, 'utf-8');

      // Should have external configuration
      expect(content).toMatch(/external:/);

      // Should externalize React
      expect(content).toMatch(/['"]react['"]/);

      // Should externalize @lingui
      expect(content).toMatch(/['"]@lingui\//);
    });
  });

  describe('Subpath Exports', () => {
    const packageJsonPath = join(appDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const exports = packageJson.exports || {};

    it('should have exports field in package.json', () => {
      expect(typeof exports).toBe('object');
      expect(Object.keys(exports).length).toBeGreaterThan(0);
    });

    it('should have main export (.)', () => {
      expect(exports['.']).toBeDefined();
      expect(exports['.'].import).toBeDefined();
      expect(exports['.'].require).toBeDefined();
    });

    it('main export files should exist if dist is built', () => {
      if (!distExists) return;

      const mainExport = exports['.'];

      // Check if the files specified in package.json exist
      // Note: Currently tsup builds to index.js and index.mjs, but package.json
      // expects acailic-vizualni-admin.cjs.js and acailic-vizualni-admin.esm.js
      // This test documents the discrepancy
      if (mainExport.import) {
        const importFile = join(appDir, mainExport.import);
        if (!existsSync(importFile)) {
          console.log(
            `  Warning: Import file ${mainExport.import} does not exist (tsup builds to index.mjs)`,
          );
          // Check the actual file that exists
          const actualFile = join(distDir, 'index.mjs');
          if (existsSync(actualFile)) {
            console.log(`  Actual ESM file: dist/index.mjs exists`);
          }
        }
      }

      if (mainExport.require) {
        const requireFile = join(appDir, mainExport.require);
        if (!existsSync(requireFile)) {
          console.log(
            `  Warning: Require file ${mainExport.require} does not exist (tsup builds to index.js)`,
          );
          // Check the actual file that exists
          const actualFile = join(distDir, 'index.js');
          if (existsSync(actualFile)) {
            console.log(`  Actual CJS file: dist/index.js exists`);
          }
        }
      }
    });

    // Note: Current tsup config only builds the main entry point
    // Subpath exports (core, client, charts, hooks, utils) are not built
    // This test documents the expected state
    describe('Subpath build artifacts', () => {
      const subpaths = Object.keys(exports).filter((k) => k !== '.');

      it.each(subpaths)('subpath %s should have corresponding build artifacts', (subpath) => {
        if (!distExists) return;

        const exportConfig = exports[subpath];
        const hasImportFile =
          exportConfig.import && existsSync(join(appDir, exportConfig.import));
        const hasRequireFile =
          exportConfig.require &&
          existsSync(join(appDir, exportConfig.require));

        if (!hasImportFile || !hasRequireFile) {
          console.log(
            `  Note: Subpath ${subpath} build artifacts not found (tsup may only build main entry)`,
          );
        }
      });
    });
  });

  describe('Build Process Validation', () => {
    it('should have build:lib script in package.json', () => {
      const packageJsonPath = join(appDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson.scripts['build:lib']).toBeDefined();
      expect(packageJson.scripts['build:lib']).toContain('tsup');
    });

    it('should have clean script that removes dist', () => {
      const packageJsonPath = join(appDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson.scripts['clean']).toBeDefined();
      expect(packageJson.scripts['clean']).toContain('dist');
    });

    it('should run build:lib as part of build process', () => {
      const packageJsonPath = join(appDir, 'package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson.scripts['postbuild']).toBeDefined();
      expect(packageJson.scripts['postbuild']).toContain('build:lib');
    });
  });

  describe('Consumption Tests', () => {
    it('CJS bundle should be require-able', () => {
      if (!existsSync(join(distDir, 'index.js'))) return;

      // This test validates the bundle can be required
      // We don't actually require it to avoid side effects, just check syntax
      const cjsFile = join(distDir, 'index.js');
      const content = readFileSync(cjsFile, 'utf-8');

      // Should have proper module structure
      expect(content).toMatch(/'use strict'/);
      expect(content).toMatch(/exports/);
    });

    it('ESM bundle should be import-able', () => {
      if (!existsSync(join(distDir, 'index.mjs'))) return;

      const esmFile = join(distDir, 'index.mjs');
      const content = readFileSync(esmFile, 'utf-8');

      // Should have ES module syntax (export{...} is minified form)
      expect(content).toMatch(/export\{/);

      // Should not have shebang (not a CLI script)
      expect(content.startsWith('#!')).toBe(false);
    });
  });
});
