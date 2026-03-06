/**
 * Chart Preview Modal Component
 *
 * Modal with mini chart preview, description, and CTA button.
 */

import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { DEMO_CONFIGS } from "@/lib/demos/config";

import { CATEGORY_GRADIENTS } from "../_constants/gradients";

interface ChartPreviewModalProps {
  open: boolean;
  onClose: () => void;
  chart: {
    id: string;
    demoId: string;
    title: { sr: string; en: string };
    description: { sr: string; en: string };
    featuredReason: { sr: string; en: string };
  } | null;
}

const TOPIC_ROUTE_IDS = new Set([
  "economy",
  "health",
  "education",
  "demographics",
  "environment",
  "transport",
]);

const getChartDestination = (demoId: string) =>
  TOPIC_ROUTE_IDS.has(demoId) ? `/topics/${demoId}` : `/demos/${demoId}`;

export function ChartPreviewModal({
  open,
  onClose,
  chart,
}: ChartPreviewModalProps) {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  if (!chart) return null;

  const demoConfig = DEMO_CONFIGS[chart.demoId];
  const icon = demoConfig?.icon || "📊";
  const gradient =
    CATEGORY_GRADIENTS[chart.demoId] || CATEGORY_GRADIENTS.demographics;

  const viewDemoText = i18n._(
    defineMessage({
      id: "demos.showcase.modal.viewDemo",
      message: "View Full Demo",
    })
  );

  const closeText = i18n._(
    defineMessage({
      id: "demos.showcase.modal.close",
      message: "Close",
    })
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1,
        }}
      >
        <Box sx={{ fontSize: "1.5rem" }}>{icon}</Box>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {chart.title[locale]}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Preview area with gradient placeholder */}
        <Box
          sx={{
            height: 200,
            background: gradient,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              fontSize: "4rem",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {chart.description[locale]}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {demoConfig?.description[locale]}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          {closeText}
        </Button>
        <Button
          component={Link}
          href={getChartDestination(chart.demoId)}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            background: gradient,
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          {viewDemoText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
