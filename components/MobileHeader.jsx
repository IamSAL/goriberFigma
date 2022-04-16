import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MobileToolBar from "./MobileToolBar";

const pages = ["Account", "Dashboard", "Logout"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const MobileHeader = () => {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <Container maxWidth="xxl" >
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100vw",
        }}
      >
        <div style={{ width: "20%" }}>
          <IconButton size="large" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </div>
        <div id="mobile_logo" style={{ width: "60%",display:"flex",justifyContent:"center" }}>
          <Typography variant="h6" component="div">
            <span className="text-muted"> Goriber</span> FIGMA
          </Typography>
        </div>
        <div style={{ width: "20%" }}>
         
        </div>
      </Toolbar>
      <MobileToolBar open={open} toggleDrawer={toggleDrawer} />
    </Container>
  );
};
export default MobileHeader;
