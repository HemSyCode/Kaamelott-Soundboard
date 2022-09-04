import React from "react"
import {Trans} from "react-i18next"

class EpisodesBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: (this.props.isVisible === true) ? true : false
        }
        this.handleEpisodeClick = this.handleEpisodeClick.bind(this)
        this.handleEpisodeContainerClick = this.handleEpisodeContainerClick.bind(this)
    }

    handleEpisodeClick(e, episode) {
        this.props.onEpisodeClick(e, episode)
    }

    handleEpisodeContainerClick() {
        this.props.onEpisodesBoxVisibleChange(((this.props.isVisible === true) ? false : true))
    }

    render() {
        return (
            <>
                <div className={'episodes-container'}>
                    <div className="header" onClick={() => this.handleEpisodeContainerClick()}>
                        <h3><Trans>app_episodes</Trans></h3>
                    </div>
                    <div className={'content' + (  ((this.props.isVisible === true) ? true : false)   ? ' visible' : ' hidden')}>
                        {
                            (this.props.episodes.length === 0) ?
                                <h3>Aucuns éléments.</h3>
                                :
                                this.props.episodes.map((item, i) => {
                                    return (
                                        <div key={i} className={'btn btn-episode' + (item === this.props.filterValue ? ' active' : '')} onClick={(e) => this.handleEpisodeClick(e, item[0]+", "+item[1]+" - "+item[2])}>{item[0]}, {item[1]} - {item[2]}</div>
                                    )
                                })
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default EpisodesBox
