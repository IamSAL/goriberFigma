import * as React from "react";
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import("../components/Editor"), {
  ssr: false
})



const index = () => {
  return (
    <>
      <Editor />
      </>
  );
};

export default index;
