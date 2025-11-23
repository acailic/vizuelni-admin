export const Intro = ({ title, teaser, buttonLabel, }) => {
    return (<Box sx={{ backgroundColor: "background.paper" }}>
      <ContentWrapper sx={{ py: 20 }}>
        <div>
          <Title>{title}</Title>
          <Teaser>{teaser}</Teaser>
          <NextLink href="/browse" passHref legacyBehavior>
            <Button variant="outlined" endIcon={<Icon name="arrowRight"/>}>
              {buttonLabel}
            </Button>
          </NextLink>
        </div>
      </ContentWrapper>
    </Box>);
};
const Title = ({ children }) => (<Typography variant="h2" component="h1" sx={{ mb: 10, fontWeight: 700, textWrap: "balance" }}>
    {children}
  </Typography>);
const Teaser = ({ children }) => (<Box sx={{ mb: 8 }}>
    <Typography>{children}</Typography>
  </Box>);
