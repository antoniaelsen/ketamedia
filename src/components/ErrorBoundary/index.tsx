import { Stack, Typography } from "@mui/material";
import React from "react";

export interface ErrorBoundaryProps {
  children?: React.ReactNode | React.ReactNode[];
  fallback: React.ReactNode;
}

export const ErrorText = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <Stack
      sx={{
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h2">{title}</Typography>
      {subtitle && <Typography variant="subtitle2">{subtitle}</Typography>}
    </Stack>
  );
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
