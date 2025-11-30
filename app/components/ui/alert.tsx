import { Alert as MuiAlert, AlertProps as MuiAlertProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

export interface AlertProps extends Omit<MuiAlertProps, "variant"> {
  variant?: "default" | "destructive" | "warning";
  className?: string;
}

const StyledAlert = styled(MuiAlert, {
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant?: string }>(({ theme, variant }) => ({
  ...(variant === "destructive" && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    "& .MuiAlert-icon": {
      color: theme.palette.error.main,
    },
  }),
  ...(variant === "warning" && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.contrastText,
    "& .MuiAlert-icon": {
      color: theme.palette.warning.main,
    },
  }),
}));

export const Alert: React.FC<AlertProps> = ({
  variant = "default",
  children,
  className,
  severity = "info",
  ...props
}) => {
  const mappedSeverity = variant === "destructive" ? "error" :
                       variant === "warning" ? "warning" :
                       severity;

  return (
    <StyledAlert
      variant={variant}
      severity={mappedSeverity}
      className={className}
      {...props}
    >
      {children}
    </StyledAlert>
  );
};