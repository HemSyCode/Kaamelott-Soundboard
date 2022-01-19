import React from "react";
import {Trans} from "react-i18next";

class RandomButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleRandomButtonClick = this.handleRandomButtonClick.bind(this);
    }

    handleRandomButtonClick() {
        this.props.onRandomButtonClick()
    }

    render() {
        return (
            <>
                <button id="random-btn" className="btn" onClick={this.handleRandomButtonClick}><Trans>app_random</Trans></button>
            </>
        );
    }
}

export default RandomButton;
