import React, { Fragment, useEffect, useState } from "react";
import {
  useUiState,
  useUiStateModifier,
} from "../../common/contexts/UiContextProvider";

import { useWindowSize } from "react-use";
import AppHeader from "../AppHeader";

function Layout(props) {
  const [UiState, setUiState] = useUiState();
  const { setsideMenuVisibility } = useUiStateModifier();
  const { width, height } = useWindowSize();

  return (
    <>
      <AppHeader />
      {props.children}
    </>
  );
}

export default Layout;
