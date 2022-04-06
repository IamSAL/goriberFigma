import "bootstrap/dist/css/bootstrap.min.css";
import "../asset/scss/style.scss";
import "react-toastify/dist/ReactToastify.css";
import { UiContextProvider } from "./../common/contexts/UiContextProvider";
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

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <UiContextProvider>
        <EditorProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </EditorProvider>
      </UiContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;
