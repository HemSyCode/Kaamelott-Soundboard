import React from "react";

class SoundboardFilterResetButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterValueReset = this.handleFilterValueReset.bind(this);
    }

    handleFilterValueReset() {
        this.props.onFilterValueChange()
    }

    render() {
        return (
            <>
                <button id="reset" className="btn" disabled="" onClick={this.handleFilterValueReset} >Réinitialiser</button>
            </>
        );
    }
}

export default SoundboardFilterResetButton;
