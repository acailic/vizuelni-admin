import { Trans } from "@lingui/macro";
import { Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AnimatePresence } from "framer-motion";

import { useBrowseContext } from "@/browse/model/context";
import { SearchDatasetInput } from "@/browse/ui/search-dataset-input";
import { ContentWrapper } from "@/components/content-wrapper";
import {
  __BANNER_MARGIN_CSS_VAR,
  bannerPresenceProps,
  MotionBox,
} from "@/components/presence";
import { useResizeObserver } from "@/utils/use-resize-observer";

export const SelectDatasetBanner = ({
  dataset,
  variant,
}: {
  dataset: string | undefined;
  variant: "page" | "drawer";
}) => {
  const [ref] = useResizeObserver<HTMLDivElement>(({ height }) => {
    if (height) {
      document.documentElement.style.setProperty(
        __BANNER_MARGIN_CSS_VAR,
        `-${height}px`
      );
    }
  });
  const classes = useStyles();
  const show = !dataset && variant === "page";
  const browseState = useBrowseContext();

  return (
    <AnimatePresence>
      {show ? (
        <MotionBox key="banner" ref={ref} {...bannerPresenceProps}>
          <section className={classes.outerWrapper} role="banner">
            <ContentWrapper className={classes.innerWrapper}>
              <div className={classes.content}>
                <Typography className={classes.title} variant="h1">
                  Otvoreni podaci Republike Srbije
                </Typography>
                <Typography className={classes.description} variant="body2">
                  <Trans id="browse.datasets.description">
                    Pregledajte skupove podataka portala data.gov.rs, filtrirajte
                    po kategorijama ili organizacijama ili odmah potražite ključne
                    pojmove. Izaberite dataset da vidite detalje i napravite
                    vizualizaciju.
                  </Trans>
                </Typography>
                <SearchDatasetInput browseState={browseState} />
              </div>
            </ContentWrapper>
          </section>
        </MotionBox>
      ) : null}
    </AnimatePresence>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  outerWrapper: {
    backgroundColor: theme.palette.monochrome[100],
  },
  innerWrapper: {
    paddingTop: theme.spacing(25),
    paddingBottom: theme.spacing(25),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 940,
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 700,
  },
  description: {
    marginBottom: theme.spacing(10),
  },
}));
