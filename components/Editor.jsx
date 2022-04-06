import * as React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Controls from "./Controls";
import Toolbar from "./Toolbar";
import FabricEditor from "./FabricEditor";

const Editor = () => {
  return (
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
          <Toolbar />
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
  );
};

export default Editor;
