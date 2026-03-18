import { loadDatasetFromUrl, type DatasetLoadOptions, type ParsedDataset } from '@vizualni/data'

export async function loadAndClassifyDataset(
  resourceUrl: string,
  options: DatasetLoadOptions = {}
): Promise<ParsedDataset> {
  return loadDatasetFromUrl(resourceUrl, options)
}
