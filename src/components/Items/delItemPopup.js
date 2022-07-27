import React from "react";

import './index.css';
import appStringConstants from "../../constants/appStringConstants";

export const DelItemPopup = _ => <div className="del-item-popup-text">
    {appStringConstants.delItemPopupContent}
</div>;