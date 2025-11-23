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
import { t, Trans } from "@lingui/macro";

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

const TutorialsSection = () => {
  const tutorials = [
    {
      title: t({
        id: "home.tutorials.gettingStarted.title",
        message: "Getting Started",
      }),
      description: t({
        id: "home.tutorials.gettingStarted.description",
        message: "Learn the basics of using Vizualni Admin",
      }),
      link: "/docs/getting-started",
      icon: "🚀",
    },
    {
      title: t({
        id: "home.tutorials.chartTypes.title",
        message: "Chart Types",
      }),
      description: t({
        id: "home.tutorials.chartTypes.description",
        message: "Explore different chart types",
      }),
      link: "/docs/chart-types-guide",
      icon: "📊",
    },
    {
      title: t({ id: "home.tutorials.embedding.title", message: "Embedding" }),
      description: t({
        id: "home.tutorials.embedding.description",
        message: "How to embed visualizations on your site",
      }),
      link: "/docs/embedding-guide",
      icon: "🔗",
    },
    {
      title: t({ id: "home.tutorials.apiGuide.title", message: "API Guide" }),
      description: t({
        id: "home.tutorials.apiGuide.description",
        message: "Using the data.gov.rs API",
      }),
      link: "/docs/data-gov-rs-guide",
      icon: "📡",
    },
  ];

  return (
    <Box sx={{ py: 8, px: 2, backgroundColor: "background.paper" }}>
      <Typography variant="h4" align="center" gutterBottom>
        <Trans id="home.tutorials.title">Learn and Explore</Trans>
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        <Trans id="home.tutorials.subtitle">
          Discover our tutorials and guides for creating amazing visualizations
        </Trans>
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
                  <Trans id="home.tutorials.learnMore">Learn More</Trans>
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const HeroSection = () => {
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
          <Trans id="home.hero.overline">Visualize open data</Trans>
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 2, mb: 2 }}>
          <Trans id="home.hero.title">
            Get to insights from Serbian open data faster
          </Trans>
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
          <Trans id="home.hero.description">
            Browse data.gov.rs, pick a dataset, and craft visualizations you can
            share or embed instantly.
          </Trans>
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/browse"
            sx={{ minWidth: 160 }}
          >
            <Trans id="home.hero.browseButton">Browse datasets</Trans>
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
            <Trans id="home.hero.guideButton">Start guide</Trans>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default function ContentPage({ staticPage }: ContentPageProps) {
  const Component = staticPages[staticPage]?.component;
  const isHomePage = staticPage === "/sr/index" || staticPage === "/en/index";

  return (
    <ContentMDXProvider>
      {isHomePage && <HeroSection />}
      {Component ? <Component /> : "NOT FOUND"}
      {isHomePage && <TutorialsSection />}
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
