import { useState, useEffect } from "react";
import { useUiState } from "../contexts/UiContextProvider";
const useSiteSetting = (props) => {
  const [UiState, setUiState] = useUiState();
  const [setting, setSetting] = useState(UiState.setting);

  useEffect(() => {
    setUiState((prev) => {
      return { ...prev, setting };
    });
    return () => {};
  }, [setUiState, setting]);

  return [setting, setSetting];
};

export default useSiteSetting;
