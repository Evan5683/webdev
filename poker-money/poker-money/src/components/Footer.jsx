import React from "react";

function Footer() {
    const date = new Date();
    const currentTime = date.getFullYear();
    let footer = "copyright " + currentTime;


    return (
        <footer>
            <p className="footer">
                {footer}
            </p>
        </footer>
    );

}

export default Footer;