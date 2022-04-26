import React, { Fragment, useEffect, useState } from "react";
import AppHeader from "../AppHeader";
import MobileHeader from "../MobileHeader";
import HorizontalLoader from "../HorizontalLoader";

function Layout(props) {


  return (
    <>
      <HorizontalLoader />
      <AppHeader />
      {props.children}
    </>
  );
}

export default Layout;
