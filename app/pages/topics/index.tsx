// app/pages/topics/index.tsx
import { Container, Typography, Grid, Box, alpha } from "@mui/material";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout";
import { TopicCard } from "@/components/topics/TopicCard";
import topicIndex from "@/data/topics/index.json";
import type { Topic, TopicIndex } from "@/types/topics";

interface TopicsPageProps {
  topics: Topic[];
}

export default function TopicsPage({ topics }: TopicsPageProps) {
  const router = useRouter();
  const locale = (router.locale || "sr") as string;

  const pageTitle =
    locale === "sr"
      ? "Истражите отворене податке | Vizualni Admin"
      : locale === "sr-Latn"
        ? "Istražite otvorene podatke | Vizualni Admin"
        : "Explore Open Data | Vizualni Admin";

  const heading =
    locale === "sr"
      ? "Истражите отворене податке"
      : locale === "sr-Latn"
        ? "Istražite otvorene podatke"
        : "Explore Open Data";

  const subheading =
    locale === "sr"
      ? "Пронађите скупове података по категоријама и визуализујте их"
      : locale === "sr-Latn"
        ? "Pronađite skupove podataka po kategorijama i vizualizujte ih"
        : "Find datasets by category and visualize them";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={subheading} />
      </Head>
      <AppLayout>
        <Container sx={{ py: 6 }}>
          {/* Hero Section */}
          <Box
            sx={{
              mb: 5,
              p: 5,
              borderRadius: 4,
              background:
                "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
              color: "white",
              boxShadow: "0 10px 40px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
            >
              📊 {heading}
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", opacity: 0.95, fontSize: "1.1rem" }}
            >
              {subheading}
            </Typography>
          </Box>

          {/* Stats Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: (theme) => alpha(theme.palette.primary.main, 0.1),
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {topics.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === "sr"
                    ? "Категорија података"
                    : locale === "sr-Latn"
                      ? "Kategorija podataka"
                      : "Data Categories"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: (theme) => alpha(theme.palette.success.main, 0.1),
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {topics.reduce(
                    (acc, topic) => acc + (topic.datasetCount || 0),
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === "sr"
                    ? "Укупно скупова података"
                    : locale === "sr-Latn"
                      ? "Ukupno skupova podataka"
                      : "Total Datasets"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Topic Cards */}
          <Grid container spacing={3}>
            {topics.map((topic) => (
              <Grid item xs={12} sm={6} md={4} key={topic.id}>
                <TopicCard topic={topic} locale={locale} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </AppLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps<TopicsPageProps> = async ({
  locale: _locale,
}) => {
  const data = topicIndex as TopicIndex;

  return {
    props: {
      topics: data.topics,
    },
  };
};
