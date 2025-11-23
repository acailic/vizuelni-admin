import { usePublisher } from "@mdxeditor/gurx";

import { openLinkEditDialog$ } from "@/components/mdx-editor/link-dialog";
export const LinkDialogToggle = () => {
    const openLinkEditDialog = usePublisher(openLinkEditDialog$);
    return (<ToolbarIconButton onClick={() => {
            openLinkEditDialog();
        }}>
      <Icon name="link"/>
    </ToolbarIconButton>);
};
