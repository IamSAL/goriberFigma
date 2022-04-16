import * as React from "react";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false,
});
const index = () => {
  return (
    <div className="app-container">
      <Editor />
    </div>
  );
};

export default index;
