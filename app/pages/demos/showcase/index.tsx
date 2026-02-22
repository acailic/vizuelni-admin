/**
 * Demo Showcase Page
 *
 * A page displaying featured charts from across the demo visualizations.
 * Highlights key data visualizations from economy, transport, energy,
 * and digitalization domains.
 *
 * @route /demos/showcase
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
  alpha,
} from "@mui/material";

import { DemoLayout } from "@/components/demos/demo-layout";
import { FEATURED_CHARTS } from "@/lib/demos/config";

export default function ShowcasePage() {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  const pageTitle = i18n._(
    defineMessage({
      id: "demos.showcase.title",
      message: "Featured Charts Showcase",
    })
  );

  const pageDescription = i18n._(
    defineMessage({
      id: "demos.showcase.description",
      message:
        "A curated collection of highlight charts across economy, transport, energy, and digitalization domains.",
    })
  );

  const introText = i18n._(
    defineMessage({
      id: "demos.showcase.intro",
      message:
        "Explore key visualizations from Serbian open data. Each chart highlights important trends and insights.",
    })
  );

  return (
    <DemoLayout title={pageTitle} description={pageDescription}>
      <Box
        sx={{
          mb: 5,
          p: 4,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {introText}
        </Typography>
      </Box>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        {locale === "sr" ? "Istaknuti grafikoni" : "Featured Charts"}
      </Typography>

      <Grid container spacing={3}>
        {FEATURED_CHARTS.map((chart) => (
          <Grid item xs={12} sm={6} md={4} key={chart.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "5px",
                  background:
                    "linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%)",
                  opacity: 1,
                },
              }}
            >
              <CardContent
                sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 1.5, lineHeight: 1.3 }}
                >
                  {chart.title[locale]}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, flex: 1 }}
                >
                  {chart.description[locale]}
                </Typography>
                <Chip
                  label={chart.featuredReason[locale]}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: 3,
          background: alpha("#10b981", 0.08),
          border: "1px solid",
          borderColor: alpha("#10b981", 0.2),
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
        >
          {locale === "sr" ? "Izvor podataka" : "Data Source"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {locale === "sr"
            ? "Svi podaci prikazani na ovoj stranici dolaze sa portala otvorenih podataka Republike Srbije (data.gov.rs)."
            : "All data displayed on this page comes from the Republic of Serbia open data portal (data.gov.rs)."}
        </Typography>
      </Box>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  // Pre-build the showcase page for instant loading
  return {
    props: {},
  };
}
