import Link from "next/link";

import { staticPages } from "@/static-pages";
const TutorialsSection = ({ locale }) => {
    const tutorials = [
        {
            title: locale === "sr" ? "Početak" : "Getting Started",
            description: locale === "sr"
                ? "Naučite osnove korišćenja Vizualni Admin"
                : "Learn the basics of using Vizualni Admin",
            link: "/docs/getting-started",
            icon: "🚀",
        },
        {
            title: locale === "sr" ? "Tipovi Grafikona" : "Chart Types",
            description: locale === "sr"
                ? "Istražite različite tipove grafikona"
                : "Explore different chart types",
            link: "/docs/chart-types-guide",
            icon: "📊",
        },
        {
            title: locale === "sr" ? "Ugrađivanje" : "Embedding",
            description: locale === "sr"
                ? "Kako ugraditi vizualizacije na vaš sajt"
                : "How to embed visualizations on your site",
            link: "/docs/embedding-guide",
            icon: "🔗",
        },
        {
            title: locale === "sr" ? "API Vodič" : "API Guide",
            description: locale === "sr"
                ? "Korišćenje data.gov.rs API-ja"
                : "Using the data.gov.rs API",
            link: "/docs/data-gov-rs-guide",
            icon: "📡",
        },
    ];
    return (<Box sx={{ py: 8, px: 2, backgroundColor: "background.paper" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {locale === "sr" ? "Naučite i Istražite" : "Learn and Explore"}
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        {locale === "sr"
            ? "Otkrijte naše tutorijale i vodiče za kreiranje sjajnih vizualizacija"
            : "Discover our tutorials and guides for creating amazing visualizations"}
      </Typography>
      <Grid container spacing={4}>
        {tutorials.map((tutorial, index) => (<Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {tutorial.icon}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {tutorial.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tutorial.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <Button size="small" component={Link} href={tutorial.link}>
                  {locale === "sr" ? "Saznaj više" : "Learn More"}
                </Button>
              </CardActions>
            </Card>
          </Grid>))}
      </Grid>
    </Box>);
};
export default function ContentPage({ staticPage }) {
    var _a;
    const Component = (_a = staticPages[staticPage]) === null || _a === void 0 ? void 0 : _a.component;
    const isHomePage = staticPage === "/sr/index" || staticPage === "/en/index";
    const locale = staticPage.startsWith("/sr") ? "sr" : "en";
    return (<ContentMDXProvider>
      {Component ? <Component /> : "NOT FOUND"}
      {isHomePage && <TutorialsSection locale={locale}/>}
    </ContentMDXProvider>);
}
export const getStaticProps = async ({ locale, }) => {
    // When i18n is disabled (e.g., for GitHub Pages), use the default locale
    const actualLocale = locale || "sr";
    const path = `/${actualLocale}/index`;
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
