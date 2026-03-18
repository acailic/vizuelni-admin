import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    client: 'src/client.ts',
    errors: 'src/errors.ts',
    types: 'src/types.ts',
    datasets: 'src/datasets.ts',
    organizations: 'src/organizations.ts',
    reuses: 'src/reuses.ts',
    topics: 'src/topics.ts',
    contacts: 'src/contacts.ts',
    discussions: 'src/discussions.ts',
    dataservices: 'src/dataservices.ts',
    site: 'src/site.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: false,
})
