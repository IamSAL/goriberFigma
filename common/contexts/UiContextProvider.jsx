import { useRouter } from "next/router";
import { createContext, useState, useEffect, useContext } from "react";
import { checkPlatformWebAuthnSupport } from "../helpers";

export const UiContext = createContext();
export const defaultUiState = {
  setting: {},
  headerVisibility: true,
  footerVisibility: true,
  sideMenuVisibility: false,
  webAuthnSupport: false,
};

export const UiContextProvider = ({ children }) => {
  const [UiState, setUiState] = useState(defaultUiState);

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
    checkPlatformWebAuthnSupport().then((available) => {
      if (available) {
        setUiState((prev) => {
          return { ...prev, webAuthnSupport: true };
        });
      }
    });
    if (localStorage.getItem(`UiData`)) {
      setUiState(JSON.parse(localStorage.getItem(`UiData`)));
    }
    return () => {};
  }, []);

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

  return {
    setFullScreenMenuOpen,
    setHeaderFooterVisibility,
    setsideMenuVisibility,
  };
};
