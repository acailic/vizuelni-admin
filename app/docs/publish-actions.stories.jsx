import { useRef } from "react";

const meta = {
    title: "organisms / Publish Actions",
};
export default meta;
const PublishActionsStory = () => {
    const ref = useRef(null);
    return (<PublishActions configKey="123456789" locale="en" chartWrapperRef={ref}/>);
};
export { PublishActionsStory as PublishActions };
