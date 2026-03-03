/**
 * Dynamic Demo Page
 *
 * A dynamic route that renders any configured demo based on the demoId parameter.
 * Uses getStaticPaths to pre-render all demo IDs from DEMO_CONFIGS.
 *
 * @route /demos/[demoId]
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import {
  DemoError,
  DemoLayout,
  DemoLoading,
} from "@/components/demos/demo-layout";
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import DemoSkeleton from "@/components/demos/DemoSkeleton";
import { Header } from "@/components/header";
import { getDemoConfig, getAllDemoIds } from "@/lib/demos/config";
import type { DemoConfig } from "@/types/demos";

interface DemoPageProps {
  demoConfig: DemoConfig | null;
}

export default function DynamicDemoPage({ demoConfig }: DemoPageProps) {
  const router = useRouter();
  const { i18n } = useLingui();
  const theme = useTheme();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo content
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner during fallback
  if (router.isFallback) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "monochrome.100",
        }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <DemoLoading
            message={i18n._(
              defineMessage({
                id: "demos.dynamic.loading",
                message: "Loading demo...",
              })
            )}
          />
        </Container>
      </Box>
    );
  }

  // Show error message if demo config not found
  if (!demoConfig) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "monochrome.100",
        }}
      >
        <Header />
        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <DemoError
            error={i18n._(
              defineMessage({
                id: "demos.dynamic.not-found",
                message:
                  "Demo not found. The requested demo configuration does not exist.",
              })
            )}
          />
        </Container>
      </Box>
    );
  }

  const title = demoConfig.title[locale] || demoConfig.title.en;
  const description =
    demoConfig.description[locale] || demoConfig.description.en;

  // Show skeleton while loading
  if (isLoading) {
    return (
      <DemoLayout
        title={`${demoConfig.icon} ${title}`}
        description={description}
      >
        <DemoSkeleton variant="chart" chartHeight={400} />
      </DemoLayout>
    );
  }

  return (
    <DemoLayout title={`${demoConfig.icon} ${title}`} description={description}>
      <DemoErrorBoundary>
        {/* Demo Info Card */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Icon */}
              <Grid item>
                <Box
                  sx={{
                    fontSize: "3rem",
                    lineHeight: 1,
                  }}
                >
                  {demoConfig.icon}
                </Box>
              </Grid>

              {/* Title and Description */}
              <Grid item xs>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {description}
                </Typography>
              </Grid>
            </Grid>

            {/* Tags */}
            {demoConfig.tags && demoConfig.tags.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mt: 2,
                }}
              >
                {demoConfig.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Chart Type */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                {locale === "sr" ? "Tip grafikona" : "Chart type"}:
              </Typography>
              <Chip
                label={demoConfig.chartType}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "capitalize",
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Visualization Placeholder */}
        <Card
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            backgroundColor: alpha("#f8fafc", 0.5),
          }}
        >
          <CardContent
            sx={{
              p: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
            }}
          >
            <Box
              sx={{
                fontSize: "4rem",
                mb: 3,
                opacity: 0.5,
              }}
            >
              {demoConfig.icon}
            </Box>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: "center", mb: 2 }}
            >
              {locale === "sr"
                ? "Vizualizacija će biti prikazana ovde"
                : "Visualization component will render here"}
            </Typography>
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ textAlign: "center" }}
            >
              {locale === "sr"
                ? "Komponenta za vizualizaciju podataka će biti implementirana u sledećoj fazi."
                : "The data visualization component will be implemented in the next phase."}
            </Typography>
          </CardContent>
        </Card>
      </DemoErrorBoundary>
    </DemoLayout>
  );
}

/**
 * Generate static paths for all demo IDs
 */
export async function getStaticPaths() {
  const demoIds = getAllDemoIds();

  const paths = demoIds.map((id) => ({
    params: { demoId: id },
  }));

  return {
    paths,
    fallback: true, // Enable fallback for future demos
  };
}

/**
 * Get static props for a specific demo
 */
export async function getStaticProps({
  params,
}: {
  params: { demoId: string };
}) {
  const demoConfig = getDemoConfig(params.demoId);

  // Return 404 if demo doesn't exist
  if (!demoConfig) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      demoConfig,
    },
  };
}
