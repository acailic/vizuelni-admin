import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import { showcaseDigitalSkills, showcaseEnergyMix, showcaseRegionalGrowth, showcaseRidershipTrend, } from "@/data/demo-showcase";
export default function DemoShowcasePage() {
    const { i18n } = useLingui();
    const msg = (id, message) => i18n._(defineMessage({
        id,
        message,
    }));
    const text = {
        title: msg("demos.showcase.title", "Demo Showcase Visualizations"),
        description: msg("demos.showcase.description", "A quick look at multiple chart types using representative datasets."),
        hero: msg("demos.showcase.hero", "A bundle of high-signal indicators across economy, mobility, energy, and digitalization."),
        cta: msg("demos.showcase.cta", "Browse all demo pages"),
        economyTitle: msg("demos.showcase.economy.title", "Regional GDP Growth"),
        economyDesc: msg("demos.showcase.economy.description", "Year-over-year GDP growth by region."),
        transportTitle: msg("demos.showcase.transport.title", "Public Transport Momentum"),
        transportDesc: msg("demos.showcase.transport.description", "Trips in millions – COVID dip in 2020, then a steady recovery."),
        energyTitle: msg("demos.showcase.energy.title", "Energy Mix Snapshot"),
        energyDesc: msg("demos.showcase.energy.description", "Share of electricity generation by source."),
        digitalTitle: msg("demos.showcase.digital.title", "Digital Skills Gap"),
        digitalDesc: msg("demos.showcase.digital.description", "Share of population with at least basic digital skills."),
        datasetTitle: msg("demos.showcase.dataset.title", "Showcase indicators"),
        datasetOrganization: msg("demos.showcase.dataset.organization", "Sample dataset"),
        chips: {
            economy: msg("demos.showcase.chip.economy", "Economic pulse"),
            mobility: msg("demos.showcase.chip.mobility", "Mobility"),
            energy: msg("demos.showcase.chip.energy", "Energy"),
            digital: msg("demos.showcase.chip.digital", "Digital"),
        },
        heroCards: [
            {
                label: msg("demos.showcase.hero.stat1.label", "GDP YoY: +4.3%"),
                hint: msg("demos.showcase.hero.stat1.hint", "Belgrade leads"),
            },
            {
                label: msg("demos.showcase.hero.stat2.label", "Trips 2023: 171M"),
                hint: msg("demos.showcase.hero.stat2.hint", "Steady recovery"),
            },
            {
                label: msg("demos.showcase.hero.stat3.label", "Coal share: 64%"),
                hint: msg("demos.showcase.hero.stat3.hint", "Needs diversification"),
            },
        ],
    };
    return (<DemoLayout title={text.title} description={text.description} datasetInfo={{
            title: text.datasetTitle,
            organization: text.datasetOrganization,
            updatedAt: "2024-12-31",
        }}>
      <Card sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #22d3ee 100%)",
            color: "white",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.4)",
        }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
              {text.hero}
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
              <Chip label={text.chips.economy} color="primary"/>
              <Chip label={text.chips.mobility} sx={{ background: "rgba(255,255,255,0.15)", color: "white" }}/>
              <Chip label={text.chips.energy} sx={{ background: "rgba(255,255,255,0.15)", color: "white" }}/>
              <Chip label={text.chips.digital} sx={{ background: "rgba(255,255,255,0.15)", color: "white" }}/>
            </Stack>
            <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 640 }}>
              {msg("demos.showcase.hero.body", "A visually coherent set of charts spotlighting momentum, drops, source mix, and the skills gap.")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              {text.heroCards.map((item, idx) => (<Grid item xs={6} sm={4} md={12} key={idx}>
                  <Card elevation={0} sx={{
                height: "100%",
                p: 2,
                background: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
            }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {item.hint}
                    </Typography>
                  </Card>
                </Grid>))}
            </Grid>
          </Grid>
        </Grid>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.economyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.economyDesc}
              </Typography>
              <Box sx={{ overflowX: "auto", pb: 1 }}>
                <ColumnChart data={showcaseRegionalGrowth} xKey="region" yKey="growth" width={760} height={360} xLabel={msg("demos.showcase.economy.xlabel", "Region")} yLabel={msg("demos.showcase.economy.ylabel", "Growth (%)")}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.transportTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.transportDesc}
              </Typography>
              <Box sx={{ overflowX: "auto", pb: 1 }}>
                <LineChart data={showcaseRidershipTrend} xKey="year" yKey="trips" width={760} height={360} xLabel={msg("demos.showcase.transport.xlabel", "Year")} yLabel={msg("demos.showcase.transport.ylabel", "Million trips")} color="#0ea5e9"/>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.energyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.energyDesc}
              </Typography>
              <Box sx={{ overflowX: "auto", pb: 1 }}>
                <PieChart data={showcaseEnergyMix} labelKey="source" valueKey="share" width={540} height={420}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 14px 40px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.digitalTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.digitalDesc}
              </Typography>
              <Box sx={{ overflowX: "auto", pb: 1 }}>
                <ColumnChart data={showcaseDigitalSkills} xKey="segment" yKey="share" width={760} height={360} xLabel={msg("demos.showcase.digital.xlabel", "Segment")} yLabel={msg("demos.showcase.digital.ylabel", "Share (%)")} colors={["#22c55e"]}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{
            mt: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(105deg, rgba(14,165,233,0.1), rgba(34,197,94,0.08))",
        }}>
        <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2} justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {msg("demos.showcase.cta.title", "Want more?")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {msg("demos.showcase.cta.body", "Visit the full gallery for more categories and live data pulls.")}
            </Typography>
          </Box>
          <Box component="a" href="/demos" style={{
            textDecoration: "none",
            padding: "10px 16px",
            borderRadius: "12px",
            border: "1px solid #0ea5e9",
            color: "#0e7490",
            fontWeight: 600,
        }}>
            {text.cta}
          </Box>
        </Stack>
      </Card>
    </DemoLayout>);
}
export async function getStaticProps() {
    return {
        props: {},
    };
}
