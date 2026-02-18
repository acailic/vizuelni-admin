// app/components/demos/showcase-card.tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { Icon } from "@/icons";

type ShowcaseCardProps = {
  title: string;
  description: string;
  demoUrl: string;
  embedUrl: string;
  shareUrl: string;
  onEmbed: () => void;
  onShare: () => void;
  thumbnail?: string;
};

export const ShowcaseCard = ({
  title,
  description,
  demoUrl,
  onEmbed,
  onShare,
  thumbnail,
}: ShowcaseCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Preview area */}
      <Box
        sx={{
          height: 200,
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!thumbnail && (
          <Icon name="chartBar" size={48} sx={{ color: "grey.400" }} />
        )}
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {description}
        </Typography>

        {/* Action buttons */}
        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Icon name="embed" size={16} />}
            onClick={onEmbed}
            sx={{ textTransform: "none" }}
          >
            Embed
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Icon name="share" size={16} />}
            onClick={onShare}
            sx={{ textTransform: "none" }}
          >
            Share
          </Button>
          <Button
            size="small"
            variant="contained"
            component={Link}
            href={demoUrl}
            sx={{ textTransform: "none", ml: "auto" }}
          >
            View
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
