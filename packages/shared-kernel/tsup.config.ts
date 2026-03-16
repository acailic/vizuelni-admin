import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'types/observation': 'src/types/observation.ts',
    'types/filter': 'src/types/filter.ts',
    'types/transform-context': 'src/types/transform-context.ts',
    'types/geographic': 'src/types/geographic.ts',
    'types/pagination': 'src/types/pagination.ts',
    'serbian/transliteration': 'src/serbian/transliteration.ts',
    'serbian/collation': 'src/serbian/collation.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
})
