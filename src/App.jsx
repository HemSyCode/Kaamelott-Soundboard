import './App.scss';
import React, {Component} from "react";
import sounds from './sounds/sounds.json';
import SoundButton from './components/SoundButton'
import SoundboardFilter from './components/SoundboardFilter'
import SoundboardFilterResetButton from './components/SoundboardFilterResetButton'
import CharactersBox from './components/CharactersBox'
import EpisodesBox from './components/EpisodesBox'
import AnchorLink from './components/AnchorLink'
import RandomButton from "./components/RandomButton";

class Soundboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            filteredSounds: [],
            characters: [],
            episodes: [],
            filterValue: this.props.filterValue,
            soundsCurrentPage: 1,
            soundsPerPage: 100
        }
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
        this.handleFilterValueReset = this.handleFilterValueReset.bind(this);
        this.handleCharacterClick = this.handleCharacterClick.bind(this);
        this.handleEpisodeClick = this.handleEpisodeClick.bind(this);
        this.handlePageNumberClick = this.handlePageNumberClick.bind(this);
        this.handleRandomButtonClick = this.handleRandomButtonClick.bind(this);
    }

    handlePageNumberClick(event) {
        this.setState({
            soundsCurrentPage: Number(event.target.id)
        });
    }

    loadData() {
        // Load JSON file.
        if ( this.state.data.length === 0 ) {
            this.setState({
                data: sounds, //.slice(0).sort((a,b) => Object.values(a)[1] < Object.values(b)[1]),
                filteredSounds: sounds, //.slice(0).sort((a,b) => Object.values(a)[1] < Object.values(b)[1]),
            })
        }

        // Load Characters.
        if ( (this.state.data.length !== 0) && (this.state.characters.length === 0) ) {
            this.lookupCharacter();
        }
        // Load Episodes.
        if ( (this.state.data.length !== 0) && (this.state.episodes.length === 0) ) {
            this.lookupEpisode();
        }
    }

    lookupCharacter() {
        var lookup = {};
        var items = this.state.data;
        var result = [];
        for (var item, i = 0; !!(item = items[i++]);) {
            var character = item.character;

            if (!(character in lookup)) {
                lookup[character] = 1;
                result.push(character);
            }
        }
        this.setState({
            characters : result.sort()
        })
    }

    lookupEpisode() {
        var lookup = {};
        var items = this.state.data;
        var result = [];
        for (var item, i = 0; !!(item = items[i++]);) {
            var episode = item.episode;

            if (!(episode in lookup)) {
                lookup[episode] = 1;
                result.push(episode);
            }
        }
        this.setState({
            episodes : result.sort()
        })
    }

    componentDidMount() {
        this.loadData()
    }

    handleFilterValueChange(e){
        e.preventDefault();
        let value = e.target.value;
        this.setState({
            soundsCurrentPage: 1,
            filterValue: value,
        });
        // Delay the loading, because setState is Async.
        setTimeout(() => {  this.handleItemsLimit(); }, 500);
    }

    handleFilterValueReset(){
        this.setState({
            soundsCurrentPage: 1,
            filterValue: '',
        });
        // Delay the loading, because setState is Async.
        setTimeout(() => {  this.handleItemsLimit(); }, 500);
    }

    handleRandomButtonClick() {
        let value = this.state.data[Math.floor(Math.random() * this.state.data.length)].title;
        this.setState({
            soundsCurrentPage: 1,
            filterValue: value
        });
        // Delay the loading, because setState is Async.
        setTimeout(() => {  this.handleItemsLimit(); }, 500);
    }

    handleCharacterClick(e, character){
        e.preventDefault();
        if (character !== this.state.filterValue) {
            this.setState({
                soundsCurrentPage: 1,
                filterValue: character,
            });
            // Delay the loading, because setState is Async.
            setTimeout(() => {  this.handleItemsLimit(); }, 500);
        }
    }

    handleEpisodeClick(e, episode){
        e.preventDefault();
        if (episode !== this.state.filterValue) {
            this.setState({
                soundsCurrentPage: 1,
                filterValue: episode,
            });
            // Delay the loading, because setState is Async.
            setTimeout(() => {  this.handleItemsLimit(); }, 500);
        }
    }

    handleItemsLimit(){
        let prepareFilter = this.state.data
        let filteredSounds = []

        if( this.state.data.length === 0 )
        {
            filteredSounds = this.state.data;
        } else {
            prepareFilter.forEach( (singleDataObject, index ) => {
                // Check 'character'
                if ((Object.values(singleDataObject)[0]).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(this.state.filterValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return; }
                // Check 'episode'
                if ((Object.values(singleDataObject)[1]).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(this.state.filterValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return; }
                // Check 'title'
                if ((Object.values(singleDataObject)[3]).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(this.state.filterValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return; }
            })
        }

        this.setState({
            filteredSounds: filteredSounds
        })
    }

    render() {
        const { soundsCurrentPage, soundsPerPage } = this.state;

        this.loadData();

        // Logic for displaying sounds
        const indexOfLastSound = soundsCurrentPage * soundsPerPage;
        const indexOfFirstSound = indexOfLastSound - soundsPerPage;
        const currentSounds = this.state.filteredSounds.slice(indexOfFirstSound, indexOfLastSound);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.state.filteredSounds.length / soundsPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <AnchorLink href="#sounds" offset={() => 200} className={'btn btn-paginator' + (number === soundsCurrentPage ? ' active' : '')}
                    key={number}
                    id={number}
                    onClick={this.handlePageNumberClick}
                >
                    {number}
                </AnchorLink>
            );
        });

        const renderSounds = (currentSounds.length === 0) ?
            <h3>Aucuns éléments.</h3>
            :
            currentSounds.map((item, i) => {
                return (
                    <li key={i} id={item.file}>
                        <SoundButton data={item} />
                    </li>
                )
            })

        return (
            <div id={'wrapper'}>
                <header className="site-header">
                    <span className={'author-link'}><a href={'http://hemsy.fr/'}>Sylvain HÉMON - HemSy.fr</a></span>
                    <h1>Kaamelott Soundboard</h1>
                </header>
                <main id={'main'} className={'site-main'} role={'main'}>

                    <SoundboardFilter {...this.state} onFilterValueChange={this.handleFilterValueChange} />

                    <div id="random" className={'btn-container'}>
                        <div>
                            <SoundboardFilterResetButton {...this.state} onFilterValueChange={this.handleFilterValueReset} />
                            <RandomButton onRandomButtonClick={this.handleRandomButtonClick}/>
                        </div>
                    </div>

                    <div className={'list'}>
                        {
                            <>
                                <CharactersBox characters={this.state.characters} filterValue={this.state.filterValue} onCharacterClick={this.handleCharacterClick} />
                                <EpisodesBox episodes={this.state.episodes} filterValue={this.state.filterValue} onEpisodeClick={this.handleEpisodeClick} />
                            </>
                        }
                    </div>

                    {
                        (pageNumbers.length >= 2)
                            ?
                                <div id="pages-top" className="paginator-container">
                                    <div className="header">
                                        <h3>Page :</h3>
                                    </div>
                                    <div className="content">
                                        {renderPageNumbers}
                                    </div>
                                </div>
                            :
                                ''
                    }

                    <div id="sounds" className={'list btn-container'}>
                        {(this.state.filteredSounds.length !== 0) ? ((this.state.filteredSounds.length === 1) ? <h6>1 résultat</h6> : <h6>{this.state.filteredSounds.length} résultats</h6>) : ''}
                        <ul>{ renderSounds }</ul>
                    </div>

                    {
                        (pageNumbers.length >= 2)
                            ?
                                <div id="pages-bottom" className="paginator-container">
                                    <div className="header">
                                        <h3>Page :</h3>
                                    </div>
                                    <div className="content">
                                        {renderPageNumbers}
                                    </div>
                                </div>
                            :
                                ''
                    }
                </main>

                <footer></footer>

            </div>
        )
    }
}

export default Soundboard;
