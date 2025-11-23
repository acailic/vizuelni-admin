import { useRouter } from "next/router";

const ChartConfiguratorPage = () => {
    const router = useRouter();
    const chartId = router.query.chartId;
    return (<>
      <Head>
        {/* Disables responsive scaling for this page (other pages still work) */}
        <meta name="viewport" content="width=1280"></meta>
      </Head>
      <AppLayout editing>
        <ConfiguratorStateProvider chartId={chartId}>
          <Configurator />
          <AddNewDatasetPanel />
        </ConfiguratorStateProvider>
      </AppLayout>
    </>);
};
export default ChartConfiguratorPage;
