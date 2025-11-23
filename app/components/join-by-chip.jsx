import { chipClasses } from "@mui/material";

export const JoinByChip = ({ children, ...props }) => {
    return (<Chip {...props} label={<>
          <SvgIcJoint />
          {props.label}
        </>} sx={{
            background: (theme) => theme.palette.warning.light,
            padding: "2px 6px",
            minHeight: "auto",
            height: 20,
            borderRadius: 2,
            gap: "4px",
            [`& .${chipClasses.label}`]: {
                padding: 0,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
            },
        }}/>);
};
