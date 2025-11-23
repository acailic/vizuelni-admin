import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Stack,
} from "@mui/material";
import { GetStaticProps } from "next";
import Link from "next/link";

import { ContentMDXProvider } from "@/components/content-mdx-provider";
import { staticPages } from "@/static-pages";

/**
 * TODO: this page can be combined with [slug].tsx into [[...slug]].tsx,
 * once these issues are resolved:
 *
 * - https://github.com/vercel/next.js/issues/19934
 * - https://github.com/vercel/next.js/issues/19950
 *
 */

interface ContentPageProps {
  staticPage: string;
}

const TutorialsSection = ({ locale }: { locale: "sr" | "en" }) => {
  const tutorials = [
    {
      title: locale === "sr" ? "Početak" : "Getting Started",
      description:
        locale === "sr"
          ? "Naučite osnove korišćenja Vizualni Admin"
          : "Learn the basics of using Vizualni Admin",
      link: "/docs/getting-started",
      icon: "🚀",
    },
    {
      title: locale === "sr" ? "Tipovi Grafikona" : "Chart Types",
      description:
        locale === "sr"
          ? "Istražite različite tipove grafikona"
          : "Explore different chart types",
      link: "/docs/chart-types-guide",
      icon: "📊",
    },
    {
      title: locale === "sr" ? "Ugrađivanje" : "Embedding",
      description:
        locale === "sr"
          ? "Kako ugraditi vizualizacije na vaš sajt"
          : "How to embed visualizations on your site",
      link: "/docs/embedding-guide",
      icon: "🔗",
    },
    {
      title: locale === "sr" ? "API Vodič" : "API Guide",
      description:
        locale === "sr"
          ? "Korišćenje data.gov.rs API-ja"
          : "Using the data.gov.rs API",
      link: "/docs/data-gov-rs-guide",
      icon: "📡",
    },
  ];

  return (
    <Box sx={{ py: 8, px: 2, backgroundColor: "background.paper" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {locale === "sr" ? "Naučite i Istražite" : "Learn and Explore"}
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        {locale === "sr"
          ? "Otkrijte naše tutorijale i vodiče za kreiranje sjajnih vizualizacija"
          : "Discover our tutorials and guides for creating amazing visualizations"}
      </Typography>
      <Grid container spacing={4}>
        {tutorials.map((tutorial, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const HeroSection = ({ locale }: { locale: "sr" | "en" }) => {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 6,
        px: { xs: 3, md: 6 },
        py: { xs: 8, md: 12 },
        background:
          "radial-gradient(circle at 10% 10%, rgba(0,163,255,0.15), transparent 25%), radial-gradient(circle at 90% 0%, rgba(0,220,190,0.2), transparent 30%), linear-gradient(135deg, #0f1b2c, #132c42)",
        color: "white",
        mb: { xs: 6, md: 8 },
      }}
    >
      <Box sx={{ maxWidth: 720 }}>
        <Typography variant="overline" sx={{ letterSpacing: 2 }}>
          {locale === "sr" ? "Vizualizujte podatke" : "Visualize open data"}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 2, mb: 2 }}>
          {locale === "sr"
            ? "Brže do priče iz otvorenih podataka Srbije"
            : "Get to insights from Serbian open data faster"}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
          {locale === "sr"
            ? "Pregledajte data.gov.rs, izaberite dataset i kreirajte vizualizacije koje možete odmah deliti ili ugraditi."
            : "Browse data.gov.rs, pick a dataset, and craft visualizations you can share or embed instantly."}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/browse"
            sx={{ minWidth: 160 }}
          >
            {locale === "sr" ? "Pregledaj datasete" : "Browse datasets"}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            component={Link}
            href="/docs/getting-started"
            sx={{
              minWidth: 160,
              borderColor: "rgba(255,255,255,0.4)",
              color: "white",
            }}
          >
            {locale === "sr" ? "Vodič za početak" : "Start guide"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default function ContentPage({ staticPage }: ContentPageProps) {
  const Component = staticPages[staticPage]?.component;
  const isHomePage = staticPage === "/sr/index" || staticPage === "/en/index";
  const locale = staticPage.startsWith("/sr") ? "sr" : "en";

  return (
    <ContentMDXProvider>
      {isHomePage && <HeroSection locale={locale} />}
      {Component ? <Component /> : "NOT FOUND"}
      {isHomePage && <TutorialsSection locale={locale} />}
    </ContentMDXProvider>
  );
}

export const getStaticProps: GetStaticProps<ContentPageProps> = async ({
  locale,
}) => {
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
