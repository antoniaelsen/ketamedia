import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardProps,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import Draggable from "react-draggable";

export interface DragPanelProps extends CardProps {
  children: React.ReactNode;
  name: string;
}

export const DragPanel = (props: DragPanelProps) => {
  const { children, name, ...rest } = props;
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <Draggable defaultPosition={{ x: 0, y: 0 }} grid={[15, 15]}>
      <Card
        {...rest}
        sx={{
          display: "flex",
          justifyContent: "center",
          background: "rgba(5, 5, 5, 0.5)",
          backdropFilter: "blur(5px)",
          my: 1,
          ...rest.sx,
        }}
      >
        <Accordion
          disableGutters
          expanded={expanded}
          sx={{ background: "transparent", width: "100%" }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                onClick={() => {
                  setExpanded(!expanded);
                }}
              />
            }
          >
            <Typography>{name}</Typography>
          </AccordionSummary>
          <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
      </Card>
    </Draggable>
  );
};
