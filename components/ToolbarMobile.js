import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShapePicker from "./Controls/ShapePicker";
import Scale from "./Controls/Scale";
import ActiveObject from "./Controls/ActiveObject";
import { useEditorData } from "../common/contexts/EditorProvider";
import Layers from "./Controls/Layers";
import Controls from "./Controls";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import HistoryPanel from "./Controls/HistoryPanel";
import Export from "./Controls/Export";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ToolbarMobile = () => {
  const EditorState = useEditorData();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="tool-bar">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Controls" {...a11yProps(0)} />
        <Tab label="Layers" {...a11yProps(1)} />
        <Tab label="History" {...a11yProps(2)} />
        <Tab label="Assets" {...a11yProps(3)} />
        <Tab label="Export" {...a11yProps(4)} />
      </Tabs>
      <div className="tool-bar-content">
        {value == 0 && (
          <div className="py-4">
            <Controls />
          </div>
        )}
        {value == 1 && <Layers EditorState={EditorState} />}
        {value == 2 && <HistoryPanel EditorState={EditorState} />}
        {value == 3 && (
          <div className="p-4">
            <ShapePicker />
          </div>
        )}
        {value == 4 && (
          <div className="p-4">
            <Export EditorState={EditorState} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolbarMobile;
