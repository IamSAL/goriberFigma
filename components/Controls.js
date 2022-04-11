import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShapePicker from "./Controls/ShapePicker";
import Scale from "./Controls/Scale";
import ActiveObject from "./Controls/ActiveObject";
import { useEditorData } from "./../common/contexts/EditorProvider";
import Layers from "./Controls/Layers";
import Fill from "./Controls/Fill";
import Export from "./Controls/Export";

const Controls = () => {
  const EditorState = useEditorData();

  return (
    <div className="controls">
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Active object</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ActiveObject EditorState={EditorState} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Scale</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Scale EditorState={EditorState} />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Fill</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Fill EditorState={EditorState} />
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <Typography>Export</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Export EditorState={EditorState} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Controls;
