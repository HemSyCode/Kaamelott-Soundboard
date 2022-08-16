import React from "react"
import {Trans} from "react-i18next";
import * as i18n from "i18next";

class SoundboardFilter extends React.Component {
    constructor(props) {
        super(props)
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this)
    }

    handleFilterValueChange(e) {
        this.props.onFilterValueChange(e)
    }

    render() {
        const {filterValue} = this.props
        const soundFilterText = i18n.t("app_filter_sounds")
        const exampleShortFormText = i18n.t("app_example_short_form")
        return (
            <div id="filter">
                <form>
                    <input id={'filter-field'} name="limit" type="text" size="50" onChange={this.handleFilterValueChange} value={filterValue} placeholder={soundFilterText + "   -   "+exampleShortFormText+"Karadoc"}/>
                </form>
            </div>
        )
    }
}

export default SoundboardFilter
