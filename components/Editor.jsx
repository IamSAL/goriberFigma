import * as React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Controls from "./Controls";
import Toolsbar from "./Toolbar";
import FabricEditor from "./FabricEditor";
import CanvasMenu from "./CanvasMenu";
import LayerItemMenu from "./LayerItemMenu";
import ContextMenus from "./ContextMenus";
import { useWindowSize } from "react-use";
import EditorTools from "./EditorTools";
import OptionTools from "./OptionTools";

const Editor = () => {
  const { width, height } = useWindowSize();
  return (
    <>
      {width > 950 ? (
        <Grid container spacing={0}>
          <Grid item xs={2}>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: "100vh",
                },
              }}
            >
              <Toolsbar />
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper
              variant="outlined"
              id="canvas_wrapper"
              sx={{
                display: "flex",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: "100vh",
                  margin: "0",
                },
              }}
            >
              <FabricEditor />
              <ContextMenus />
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: "100vh",
                },
              }}
            >
              <Controls />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={12} className="mobile_top_toolbar">
            <Toolbar disableGutters>
            <OptionTools />
            </Toolbar>
          </Grid>
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              id="canvas_wrapper"
              sx={{
                display: "flex",
                "& > :not(style)": {
                  m: 1,
                  width: "100%",
                  height: "100vh",
                  margin: "0",
                },
              }}
            >
              <FabricEditor />
              <ContextMenus />
            </Paper>
          </Grid>
          <Grid item xs={12} className="mobile_bottom_toolbar">
            <Toolbar disableGutters>
           
              <EditorTools />
            </Toolbar>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Editor;
