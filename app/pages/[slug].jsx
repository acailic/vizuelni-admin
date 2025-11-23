import { staticPages } from "@/static-pages";
export default function ContentPage({ staticPage }) {
  var _a;
  const Component =
    (_a = staticPages[staticPage]) === null || _a === void 0
      ? void 0
      : _a.component;
  return (
    <ContentMDXProvider>
      {Component ? <Component /> : "NOT FOUND"}
    </ContentMDXProvider>
  );
}
export const getStaticPaths = async () => {
  const paths = Object.keys(staticPages)
    .filter((path) => !path.endsWith("/index")) // Exclude index pages
    .map((path) => {
      const [, locale, slug] = path.split("/");
      return {
        params: { slug },
        locale,
      };
    });

  return {
    paths,
    fallback: false, // Changed from 'blocking' for static export compatibility
  };
};
export const getStaticProps = async ({ params, locale }) => {
  const path = `/${locale}/${params.slug}`;
  // FIXME: this check should not be needed when fallback: false can be used
  const pageExists = !!staticPages[path];
  if (!pageExists) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      staticPage: path,
    },
  };
};
