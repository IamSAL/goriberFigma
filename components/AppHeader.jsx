import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import EditorTools from "./EditorTools.jsx";
import OptionTools from "./OptionTools";
import { useWindowSize } from "react-use";
import MobileHeader from "./MobileHeader.jsx";
import { useDispatch } from 'react-redux';
import { UiControllerActionType } from './../store/slices/UiControllerSlice';
const pages = ["Account", "Dashboard", "Logout"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const AppHeader = () => {
  const { width, height } = useWindowSize();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const dispatch= useDispatch();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" id="app_header">
      {width > 950 ? (
        <Container maxWidth="xxl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: "flex" }}
            >
              <span className="text-muted"> Goriber</span> FIGMA
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <EditorTools />
            </Box>
            <Box sx={{ flexGrow: 1, display: "flex" }}>
             
              
            </Box>
         

            <Box sx={{ flexGrow: 0 }}>
              <OptionTools />
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Semy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                 <MenuItem onClick={()=>{
                    dispatch(UiControllerActionType.show())
                    setAnchorElUser(null);
                      
                 }}>
                    <Typography textAlign="center">Settings</Typography>
                  </MenuItem>
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      ) : (
        <MobileHeader />
      )}
    </AppBar>
  );
};
export default AppHeader;
