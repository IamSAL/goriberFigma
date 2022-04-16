import React, { Fragment, useEffect, useState } from "react";
import {
  useUiState,
  useUiStateModifier,
} from "../../common/contexts/UiContextProvider";

import AppHeader from "../AppHeader";
import MobileHeader from "../MobileHeader";
import HorizontalLoader from "../HorizontalLoader";

function Layout(props) {
  const [UiState, setUiState] = useUiState();
  const { setsideMenuVisibility } = useUiStateModifier();

  return (
    <>
      <HorizontalLoader />
      <AppHeader />

      {props.children}
    </>
  );
}

export default Layout;
