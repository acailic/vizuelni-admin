import { DatasetBrowser } from "@/pages/browse";

// Note: In static export mode (GitHub Pages), these routes won't be pre-rendered.
// The DatasetBrowser component handles routing client-side.
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  };
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default DatasetBrowser;
