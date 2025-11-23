import { useRouter } from "next/router";

export function DatasetBrowser() {
    const router = useRouter();
    const hideHeader = router.query.odsiframe === "true";
    return (<AppLayout hideHeader={hideHeader}>
      <ConfiguratorStateProvider chartId="new" allowDefaultRedirect={false}>
        <SelectDatasetStep variant="page"/>
      </ConfiguratorStateProvider>
    </AppLayout>);
}
export default DatasetBrowser;
