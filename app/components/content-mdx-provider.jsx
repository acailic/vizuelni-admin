import { Actions, Examples, Intro, Tutorial } from "@/homepage";
const Wrapper = ({ contentId, children, }) => {
    return contentId === "home" ? (<ContentLayout>{children}</ContentLayout>) : (<StaticContentLayout>{children}</StaticContentLayout>);
};
const defaultMDXComponents = {
    wrapper: Wrapper,
    Actions,
    Intro,
    Tutorial,
    Examples,
};
export const ContentMDXProvider = ({ children }) => {
    return (<MDXProvider components={defaultMDXComponents}>{children}</MDXProvider>);
};
