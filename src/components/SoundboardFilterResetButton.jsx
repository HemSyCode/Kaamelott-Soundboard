import React from "react"
import {Trans} from "react-i18next"

class SoundboardFilterResetButton extends React.Component {
    constructor(props) {
        super(props)
        this.handleFilterValueReset = this.handleFilterValueReset.bind(this)
    }

    handleFilterValueReset() {
        this.props.onFilterValueChange()
    }

    render() {
        return (
            <>
                <button id="reset" className="btn" disabled="" onClick={this.handleFilterValueReset} ><Trans>app_reset</Trans></button>
            </>
        )
    }
}

export default SoundboardFilterResetButton
