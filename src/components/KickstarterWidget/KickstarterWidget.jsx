import { motion } from "framer-motion";
import "./KickstarterWidget.css";
import { useEffect, useState } from "react";
import { div, h1 } from "framer-motion/client";

const KickstarterWidget = () => {
    
    
    return(
        <div className="kickstarter-widget"> {/*Still working on it*/}
            <iframe src="https://www.kickstarter.com/projects/132225890/immpression-presents-the-digital-gallery-movement/widget/card.html?v=2" width="520" height="540" frameborder="0" scrolling="no"></iframe>
        </div>
    );
};

export default KickstarterWidget;