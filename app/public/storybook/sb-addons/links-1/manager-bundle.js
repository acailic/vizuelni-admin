try {
  (() => {
    var O = __STORYBOOK_API__,
      {
        ActiveTabs: p,
        Consumer: R,
        ManagerContext: d,
        Provider: I,
        RequestResponseError: h,
        addons: a,
        combineParameters: v,
        controlOrMetaKey: A,
        controlOrMetaSymbol: P,
        eventMatchesShortcut: y,
        eventToShortcut: L,
        experimental_MockUniversalStore: U,
        experimental_UniversalStore: C,
        experimental_requestResponse: b,
        experimental_useUniversalStore: B,
        isMacLike: g,
        isShortcutTaken: N,
        keyToSymbol: k,
        merge: M,
        mockChannel: x,
        optionOrAltSymbol: Y,
        shortcutMatchesShortcut: D,
        shortcutToHumanString: K,
        types: V,
        useAddonState: G,
        useArgTypes: X,
        useArgs: f,
        useChannel: q,
        useGlobalTypes: H,
        useGlobals: $,
        useParameter: Q,
        useSharedState: w,
        useStoryPrepared: z,
        useStorybookApi: j,
        useStorybookState: F,
      } = __STORYBOOK_API__;
    var e = "storybook/links",
      n = {
        NAVIGATE: `${e}/navigate`,
        REQUEST: `${e}/request`,
        RECEIVE: `${e}/receive`,
      };
    a.register(e, (t) => {
      t.on(n.REQUEST, ({ kind: _, name: i }) => {
        let E = t.storyId(_, i);
        t.emit(n.RECEIVE, E);
      });
    });
  })();
} catch (e) {
  console.error(
    "[Storybook] One of your manager-entries failed: " + import.meta.url,
    e
  );
}
