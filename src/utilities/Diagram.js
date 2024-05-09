// Code to set up simple view for diagram/comparison
import React from "react";


import Mermaid from "../utilities/Mermaid";

const Diagram = ({mermaid}) => {
  return (
    <div className="view"
         style={{height:"100%", width:"100%"}} >
      <Mermaid id="mermaid" chart={mermaid}
                            width="100%"
                            height="100%"/>
    </div>
  );
};

export default Diagram;
