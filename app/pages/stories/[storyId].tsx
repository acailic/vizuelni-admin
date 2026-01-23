import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Container, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { StoryContainer } from "@/components/stories";
import type { StoryConfig } from "@/types/stories";

import { StoryLayout } from "./_components/StoryLayout";

// Temporary story configs - will be replaced with proper imports
const STORY_CONFIGS: Record<string, StoryConfig> = {
  demographics: {
    id: "demographics",
    title: {
      sr: "Demografska Kriza",
      en: "Demographic Crisis",
    },
    description: {
      sr: "Istražite pad populacije Srbije kroz 5 ključnih koraka.",
      en: "Explore Serbia's population decline through 5 key steps.",
    },
    estimatedMinutes: 5,
    difficulty: "beginner",
    theme: "demographics",
    steps: [], // Will be populated in Phase 2
  },
  economy: {
    id: "economy",
    title: {
      sr: "Ekonomska Tranzicija",
      en: "Economic Transition",
    },
    description: {
      sr: "Regionalne nejednakosti i ekonomski razvoj.",
      en: "Regional disparities and economic development.",
    },
    estimatedMinutes: 6,
    difficulty: "intermediate",
    theme: "economy",
    steps: [],
  },
  climate: {
    id: "climate",
    title: {
      sr: "Klimatska Kriza",
      en: "Climate Crisis",
    },
    description: {
      sr: "Klimatske promene u Srbiji.",
      en: "Climate change in Serbia.",
    },
    estimatedMinutes: 5,
    difficulty: "beginner",
    theme: "climate",
    steps: [],
  },
  healthcare: {
    id: "healthcare",
    title: {
      sr: "Izazovi Zdravstva",
      en: "Healthcare Challenges",
    },
    description: {
      sr: "Zdravstveni sistem u Srbiji.",
      en: "Healthcare system in Serbia.",
    },
    estimatedMinutes: 6,
    difficulty: "intermediate",
    theme: "healthcare",
    steps: [],
  },
};

export default function StoryPage() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { storyId } = router.query;

  const story = useMemo(() => {
    if (typeof storyId !== "string") return null;
    return STORY_CONFIGS[storyId] || null;
  }, [storyId]);

  if (!story) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          {i18n._(
            defineMessage({
              id: "stories.notFound",
              message: "Story Not Found",
            })
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {i18n._(
            defineMessage({
              id: "stories.notFoundDesc",
              message: "The story you're looking for doesn't exist.",
            })
          )}
        </Typography>
      </Container>
    );
  }

  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const title = story.title[locale];
  const description = story.description[locale];

  return (
    <>
      <Head>
        <title>{title} | Vizualni Admin</title>
        <meta name="description" content={description} />
      </Head>
      <StoryLayout title={title} description={description}>
        <StoryContainer storyId={story.id} config={story} />
      </StoryLayout>
    </>
  );
}

export async function getStaticPaths() {
  const paths = Object.keys(STORY_CONFIGS).map((storyId) => ({
    params: { storyId },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { storyId: string };
}) {
  return {
    props: {},
  };
}
