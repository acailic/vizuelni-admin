
export const Tutorial = ({ headline, step1, step2, step3, }) => {
    return (<ContentWrapper sx={{ py: 20 }}>
      <div style={{ width: "100%" }}>
        <HomepageSectionTitle>{headline}</HomepageSectionTitle>
        <Flex sx={(t) => ({
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 12,
            width: "100%",
            [t.breakpoints.up("lg")]: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            },
        })}>
          <Card>
            <Step1 />
            <HomepageTutorialStep>{step1}</HomepageTutorialStep>
          </Card>
          <Card>
            <Step2 />
            <HomepageTutorialStep>{step2}</HomepageTutorialStep>
          </Card>
          <Card>
            <Step3 />
            <HomepageTutorialStep>{step3}</HomepageTutorialStep>
          </Card>
        </Flex>
      </div>
    </ContentWrapper>);
};
const HomepageTutorialStep = ({ children }) => (<Typography variant="h3" component="p" sx={{ px: 7, py: 11, fontWeight: "bold" }}>
    {children}
  </Typography>);
