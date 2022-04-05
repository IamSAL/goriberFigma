import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Canvas from "./../components/Canvas";
import Controls from "./../components/Controls";
import Canvasp5 from "../components/Canvasp5";
import CanvasFabric from "./../components/CanvasFabric";
import FabricEditor from "../components/FabricEditor";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const index = () => {
  return (
    <div className="app-container">
      <Grid container spacing={0}>
        <Grid item xs={3}>
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
        <Grid item xs={9}>
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
            <FabricEditor />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default index;
