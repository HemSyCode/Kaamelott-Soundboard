import React from "react"
import {Trans} from "react-i18next"

class CharactersBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: true
        }
        this.handleCharacterClick = this.handleCharacterClick.bind(this)
        this.handleCharacterContainerClick = this.handleCharacterContainerClick.bind(this)
    }

    handleCharacterClick(e, character) {
        this.props.onCharacterClick(e, character)
    }

    handleCharacterContainerClick() {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    render() {
        return (
            <>
                <div className={'characters-container'}>
                    <div className="header" onClick={() => this.handleCharacterContainerClick()}>
                        <h3><Trans>app_personnages</Trans></h3>
                    </div>
                    <div className={'content' + (this.state.isVisible ? ' visible' : ' hidden')}>
                        {
                            (this.props.characters.length === 0) ?
                                <h3>Aucuns éléments.</h3>
                                :
                                this.props.characters.map((item, i) => {
                                    return (
                                        <div key={i} className={'btn btn-character' + (item === this.props.filterValue ? ' active' : '')} onClick={(e) => this.handleCharacterClick(e, item)}>{item}</div>
                                    )
                                })
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default CharactersBox
