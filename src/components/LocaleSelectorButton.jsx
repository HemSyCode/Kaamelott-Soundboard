import React from "react"
import i18n from "../translations/i18n"

class LocaleSelectorButton extends React.Component {
    constructor(props) {
        super(props)
    }

    changeLang(languageCode) {
        document.documentElement.setAttribute("lang", languageCode)
        i18n.changeLanguage(languageCode)
        this.setState({ state: this.state })
        this.props.onLocaleSelectorButtonClick()
    }

    render() {
        let isActive = (document.documentElement.getAttribute('lang') === this.props.locale) ? ' active' : ''
        return (
            <>
                <a className={"dropdown-item"+isActive} onClick={ () => {this.changeLang(this.props.locale)} }>
                    <i className={"flag-icon flag-icon-"+this.props.localeIcon+" mr-2"} />
                    &nbsp;&nbsp;
                    {this.props.localeName}
                </a>
            </>
        )
    }
}

export default LocaleSelectorButton
