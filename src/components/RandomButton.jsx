import React from "react";

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
                <button id="random-btn" className="btn" onClick={this.handleRandomButtonClick}>Aléatoire</button>
            </>
        );
    }
}

export default RandomButton;
