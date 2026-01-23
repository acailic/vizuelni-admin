import { useLingui } from "@lingui/react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";

import type { StoryConfig } from "@/types/stories";

import { StoryCard } from "./_components/StoryCard";
import { StoryLayout } from "./_components/StoryLayout";

// Temporary story configs - will be replaced with proper imports
const DEMO_STORIES: StoryConfig[] = [
  {
    id: "demographics",
    title: {
      sr: "Demografska Kriza",
      en: "Demographic Crisis",
    },
    description: {
      sr: "Istražite pad populacije Srbije, starenje društva i odliv mozgova kroz interaktivne podatke.",
      en: "Explore Serbia's population decline, aging society, and brain drain through interactive data.",
    },
    estimatedMinutes: 5,
    difficulty: "beginner",
    theme: "demographics",
    steps: [],
  },
  {
    id: "economy",
    title: {
      sr: "Ekonomska Tranzicija",
      en: "Economic Transition",
    },
    description: {
      sr: "Regionalne nejednakosti, energetska zavisnost i digitalni jaz u srpskoj ekonomiji.",
      en: "Regional disparities, energy dependency, and digital gap in the Serbian economy.",
    },
    estimatedMinutes: 6,
    difficulty: "intermediate",
    theme: "economy",
    steps: [],
  },
  {
    id: "climate",
    title: {
      sr: "Klimatska Kriza",
      en: "Climate Crisis",
    },
    description: {
      sr: "Porast temperature, zagađenje vazduha i tranzicija na obnovljive izvore energije.",
      en: "Temperature rise, air pollution, and the transition to renewable energy sources.",
    },
    estimatedMinutes: 5,
    difficulty: "beginner",
    theme: "climate",
    steps: [],
  },
  {
    id: "healthcare",
    title: {
      sr: "Izazovi Zdravstvenog Sistema",
      en: "Healthcare Challenges",
    },
    description: {
      sr: "Liste čekanja, regionalni pristup i nedostatak zdravstvenog kadra.",
      en: "Waiting lists, regional access, and healthcare workforce shortages.",
    },
    estimatedMinutes: 6,
    difficulty: "intermediate",
    theme: "healthcare",
    steps: [],
  },
];

export default function StoriesIndexPage() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const pageTitle =
    locale === "sr"
      ? "Interaktivne Priče iz Podataka"
      : "Interactive Data Stories";

  const pageDescription =
    locale === "sr"
      ? "Istražite ključne teme o Srbiji kroz angažirajuće priče zasnovane na stvarnim podacima."
      : "Explore key topics about Serbia through engaging stories based on real data.";

  return (
    <StoryLayout title={pageTitle} description={pageDescription}>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 6,
          p: 5,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0ea5e9 100%)",
          borderRadius: 4,
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          {locale === "sr" ? "📊 Priče iz Podataka" : "📊 Data Stories"}
        </Typography>
        <Typography
          variant="body1"
          sx={{ opacity: 0.9, maxWidth: 600, mx: "auto" }}
        >
          {locale === "sr"
            ? "Otkrijte ključne trenutke u razvoju Srbije kroz interaktivne priče zasnovane na stvarnim podacima sa data.gov.rs"
            : "Discover key moments in Serbia's development through interactive stories based on real data from data.gov.rs"}
        </Typography>
      </Box>

      {/* Stories Grid */}
      <Grid container spacing={3}>
        {DEMO_STORIES.map((story) => (
          <Grid item xs={12} sm={6} md={3} key={story.id}>
            <StoryCard story={story} href={`/stories/${story.id}`} />
          </Grid>
        ))}
      </Grid>

      {/* CTA */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          {locale === "sr"
            ? "Želite da kreirate svoju priču?"
            : "Want to create your own story?"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {locale === "sr"
            ? "Naš paket vam omogućava da kreirate interaktivne vizualizacije za vaše podatke."
            : "Our package enables you to create interactive visualizations for your data."}
        </Typography>
        <Link href="/docs" passHref legacyBehavior>
          <Button variant="outlined" component="a">
            {locale === "sr" ? "Dokumentacija" : "Documentation"}
          </Button>
        </Link>
      </Box>
    </StoryLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
