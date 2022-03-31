import React from "react";
import SvgAtomSvgrepoCom from "../svgs/AtomSvgrepoCom";
import SvgBerryCookingFood3SvgrepoCom from "../svgs/BerryCookingFood3SvgrepoCom";
import SvgBounceSvgrepoCom from "../svgs/BounceSvgrepoCom";
import SvgCreepSvgrepoCom from "../svgs/CreepSvgrepoCom";
import SvgLeafYellowAutumnSvgrepoCom from "../svgs/LeafYellowAutumnSvgrepoCom";
import SvgWeathercockSvgrepoCom from "../svgs/WeathercockSvgrepoCom";
import Grid from "@mui/material/Grid";

const ShapePicker = () => {
  return (
    <Grid container spacing={2} className="tool-icon-container">
      <Grid item xs={4}>
        <div className="tool-icon">
          <SvgBounceSvgrepoCom />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="tool-icon">
          <SvgBerryCookingFood3SvgrepoCom />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="tool-icon">
          <SvgBounceSvgrepoCom />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="tool-icon">
          <SvgCreepSvgrepoCom />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="tool-icon">
          <SvgWeathercockSvgrepoCom />
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className="tool-icon">
          <SvgCreepSvgrepoCom />
        </div>
      </Grid>
    </Grid>
  );
};

export default ShapePicker;
