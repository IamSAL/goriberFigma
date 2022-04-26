import "bootstrap/dist/css/bootstrap.min.css";
import "../asset/scss/index.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-contexify/dist/ReactContexify.css";
import { EditorProvider } from "../common/contexts/EditorProvider";

import Layout from "./../components/Layouts/Layout";
import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.status.danger,
  "&.Mui-checked": {
    color: theme.status.danger,
  },
}));

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#2b2b2b",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

import {Provider} from "react-redux";
import store from "../store";
function MyApp({ Component, pageProps }) {
  return (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
        <EditorProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </EditorProvider>
    </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
