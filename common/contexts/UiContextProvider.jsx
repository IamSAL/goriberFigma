import { useRouter } from "next/router";
import { createContext, useState, useEffect, useContext } from "react";
import { checkPlatformWebAuthnSupport } from "../helpers";
import { useWindowSize } from "react-use";
export const UiContext = createContext();
export const defaultUiState = {
  setting: {},
  headerVisibility: true,
  footerVisibility: true,
  sideMenuVisibility: false,
  webAuthnSupport: false,
  loading: false,
  isMobile:false,
  contextMenu: {
    show: false,
    type: "editor",
    position: { x: 0, y: 0 },
  },
};

export const UiContextProvider = ({ children }) => {
  const [UiState, setUiState] = useState(defaultUiState);
  const { width, height } = useWindowSize();
  const router = useRouter();
  const onRouteChangeDone = (url, { shallow }) => {
    setUiState((prev) => {
      return { ...prev, sideMenuVisibility: false };
    });
  };
  const onRouteChangeStart = (url, { shallow }) => {};

  const onRouteChangeError = (err, url, { shallow }) => {
    if (err.cancelled) {
    }
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", onRouteChangeDone);
    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeError", onRouteChangeError);
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeDone);
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeError", onRouteChangeError);
    };
  }, [router]);

  useEffect(() => {

    if (localStorage.getItem(`UiData`)) {
      setUiState(JSON.parse(localStorage.getItem(`UiData`)));
    }
    return () => {};
  }, []);

  useEffect(() => {

      setUiState((prev) => {
        return { ...prev, isMobile: width<=950 };
      });
 
   
    return () => {};
  }, [width]);

  return (
    <UiContext.Provider value={[UiState, setUiState]}>
      {children}
    </UiContext.Provider>
  );
};

export const useUiState = () => {
  const [UiState, setUiState] = useContext(UiContext);
  return [UiState, setUiState];
};

export const IsWebAuthnSupported = () => {
  const [UiState, setUiState] = useContext(UiContext);
  return UiState.webAuthnSupport;
};
export const useUiStateModifier = () => {
  const [UiState, setUiState] = useContext(UiContext);

  const setFullScreenMenuOpen = (show) => {
    setUiState((prev) => {
      return { ...prev, fullScreenMenuOpen: show };
    });
  };
  const setHeaderFooterVisibility = (isVisibleHeader, isVisibleFooter) => {
    setUiState((prev) => {
      return {
        ...prev,
        headerVisibility: isVisibleHeader,
        footerVisibility: isVisibleFooter,
      };
    });
  };

  const setsideMenuVisibility = (isVisible) => {
    setUiState((prev) => {
      return {
        ...prev,
        sideMenuVisibility: isVisible,
      };
    });
  };

  const setContextMenu = (show, type = "editor", position = { x: 0, y: 0 }) => {
    setUiState((prev) => {
      return {
        ...prev,
        contextMenu: {
          show: show,
          type: type,
          position: { x: position.x, y: position.y },
        },
      };
    });
  };

  return {
    setFullScreenMenuOpen,
    setHeaderFooterVisibility,
    setsideMenuVisibility,
    setContextMenu,
  };
};
