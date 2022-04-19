import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShapePicker from "./Controls/ShapePicker";
import Scale from "./Controls/Scale";
import DrawingBrushControl from "./Controls/DrawingBrushControl";
import { useEditorData } from "./../common/contexts/EditorProvider";
import Layers from "./Controls/Layers";
import Fill from "./Controls/Fill";
import Export from "./Controls/Export";

const ToolControls = () => {
  const EditorState = useEditorData();

  return (
    <>
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Drawing Brush</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{padding:"0px"}}>
          <DrawingBrushControl EditorState={EditorState} />
        </AccordionDetails>
      </Accordion>
      
      

      
    </>
  );
};

export default ToolControls;
