const SearchPage = () => {
    return (<Suspense fallback={<div>Loading..</div>}>
      <DebugSearch />
    </Suspense>);
};
export default SearchPage;
