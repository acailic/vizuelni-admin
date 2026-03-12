try {
  (() => {
    var O = __STORYBOOK_API__,
      {
        ActiveTabs: T,
        Consumer: d,
        ManagerContext: h,
        Provider: v,
        RequestResponseError: y,
        addons: a,
        combineParameters: R,
        controlOrMetaKey: A,
        controlOrMetaSymbol: I,
        eventMatchesShortcut: b,
        eventToShortcut: P,
        experimental_MockUniversalStore: U,
        experimental_UniversalStore: g,
        experimental_requestResponse: k,
        experimental_useUniversalStore: C,
        isMacLike: N,
        isShortcutTaken: x,
        keyToSymbol: B,
        merge: M,
        mockChannel: D,
        optionOrAltSymbol: L,
        shortcutMatchesShortcut: V,
        shortcutToHumanString: G,
        types: K,
        useAddonState: f,
        useArgTypes: q,
        useArgs: H,
        useChannel: Y,
        useGlobalTypes: $,
        useGlobals: Q,
        useParameter: X,
        useSharedState: z,
        useStoryPrepared: j,
        useStorybookApi: w,
        useStorybookState: F,
      } = __STORYBOOK_API__;
    var e = "storybook/links",
      n = {
        NAVIGATE: `${e}/navigate`,
        REQUEST: `${e}/request`,
        RECEIVE: `${e}/receive`,
      };
    a.register(e, (t) => {
      t.on(n.REQUEST, ({ kind: i, name: u }) => {
        let l = t.storyId(i, u);
        t.emit(n.RECEIVE, l);
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e
  );
}
