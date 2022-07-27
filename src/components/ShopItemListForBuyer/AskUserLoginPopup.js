import appStringConstants from "../../constants/appStringConstants";
import Button from "../AppCompLibrary/Button";
import React from "react";

export default ({ onOkClick }) => <div className="shop-user-login-popup">
    <div className="shop-user-login-body">
        {appStringConstants.userNotLoginAlertPopupDesc}
    </div>
    <div className="shop-item-quantity-button">
        <Button onClick={onOkClick}
                title={appStringConstants.okButtonTitle}/>
    </div>
</div>;
