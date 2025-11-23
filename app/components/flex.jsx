import { forwardRef } from "react";
export const Flex = forwardRef((props, ref) => {
    return <Box ref={ref} display="flex" {...props}/>;
});
