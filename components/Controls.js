import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShapePicker from "./Controls/ShapePicker";
import Scale from "./Controls/Scale";

const Controls = () => {
  return (
    <div className="controls">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Pick a shape</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ShapePicker />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Scale</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Scale />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Controls;
