import { GRAPHQL_ENDPOINT } from "@/domain/env";
import { flag } from "@/flags/flag";
// @ts-ignore - dynamic package import based on NODE_ENV
import { devtoolsExchanges } from "@/graphql/devtools";
import { createClient, cacheExchange, fetchExchange } from "urql";

export const client = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [...devtoolsExchanges, cacheExchange, fetchExchange],
  fetchOptions: {
    headers: getHeaders(),
  },
});

function getHeaders() {
  const debug = flag("debug");
  const disableCache = flag("server-side-cache.disable");

  return {
    "x-visualize-debug": debug ? "true" : "",
    "x-visualize-cache-control": disableCache ? "no-cache" : "",
  };
}
