import { t } from "@lingui/macro";

export const MoveDragButton = () => {
    return (<span title={t({ id: "Drag filters to reorganize" })} style={{ cursor: "move" }}>
      <Icon name="dragIndicator"/>
    </span>);
};
