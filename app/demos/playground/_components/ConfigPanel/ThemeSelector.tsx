// app/pages/demos/playground/_components/ConfigPanel/ThemeSelector.tsx
import { Box, Typography, Tooltip } from "@mui/material";

import { THEME_PRESETS } from "../../_constants";

interface ThemeSelectorProps {
  value: string;
  onChange: (themeId: string) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Theme
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {THEME_PRESETS.map((theme) => (
          <Tooltip key={theme.id} title={theme.name} arrow>
            <Box
              onClick={() => onChange(theme.id)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: theme.primary,
                cursor: "pointer",
                border:
                  value === theme.id
                    ? "3px solid black"
                    : "2px solid transparent",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
