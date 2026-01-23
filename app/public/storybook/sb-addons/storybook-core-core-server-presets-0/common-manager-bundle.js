try {
  (() => {
    var h = __STORYBOOK_API__,
      {
        ActiveTabs: b,
        Consumer: g,
        ManagerContext: y,
        Provider: P,
        RequestResponseError: R,
        addons: i,
        combineParameters: v,
        controlOrMetaKey: I,
        controlOrMetaSymbol: L,
        eventMatchesShortcut: A,
        eventToShortcut: f,
        experimental_MockUniversalStore: B,
        experimental_UniversalStore: U,
        experimental_requestResponse: C,
        experimental_useUniversalStore: x,
        isMacLike: M,
        isShortcutTaken: N,
        keyToSymbol: k,
        merge: Y,
        mockChannel: K,
        optionOrAltSymbol: w,
        shortcutMatchesShortcut: G,
        shortcutToHumanString: X,
        types: D,
        useAddonState: H,
        useArgTypes: V,
        useArgs: q,
        useChannel: F,
        useGlobalTypes: j,
        useGlobals: z,
        useParameter: J,
        useSharedState: Q,
        useStoryPrepared: W,
        useStorybookApi: Z,
        useStorybookState: $,
      } = __STORYBOOK_API__;
    var _ = (() => {
        let e;
        return (
          typeof window < "u"
            ? (e = window)
            : typeof globalThis < "u"
              ? (e = globalThis)
              : typeof window < "u"
                ? (e = window)
                : typeof self < "u"
                  ? (e = self)
                  : (e = {}),
          e
        );
      })(),
      c = "tag-filters",
      S = "static-filter";
    i.register(c, (e) => {
      let n = Object.entries(_.TAGS_OPTIONS ?? {}).reduce((t, r) => {
        let [o, u] = r;
        return (u.excludeFromSidebar && (t[o] = !0), t);
      }, {});
      e.experimental_setFilter(S, (t) => {
        let r = t.tags ?? [];
        return (
          (r.includes("dev") || t.type === "docs") &&
          r.filter((o) => n[o]).length === 0
        );
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e
  );
}
