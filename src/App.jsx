import './App.scss';
import React, {useState, useEffect} from "react";
import sounds from './sounds/sounds.json';
import SoundButton from './components/SoundButton'
import SoundboardFilter from './components/SoundboardFilter'
import SoundboardFilterResetButton from './components/SoundboardFilterResetButton'
import CharactersBox from './components/CharactersBox'
import EpisodesBox from './components/EpisodesBox'
import AnchorLink from './components/AnchorLink'
import RandomButton from "./components/RandomButton";

const Soundboard = (props) => {
    const [data, setData] = useState([]);
    const [filteredSounds, setFilteredSounds] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [soundsCurrentPage, setSoundsCurrentPage] = useState(1);
    const [soundsPerPage, setSoundsPerPage] = useState(100);
    const [filterValue, setFilterValue] = useState('');
    const [isHashFirstLoaded, setIsHashFirstLoaded] = useState(false);
    const [isHashLoaded, setIsHashLoaded] = useState(false);
    const [hashValue, setHashValue] = useState('');

    function htmlDecode(input) {
        return decodeURI((input+"").normalize("NFD").replace(/\p{Diacritic}/gu, ""));
    }

    useEffect(() => {
        if(isHashFirstLoaded === false && isHashLoaded === false) {
            setIsHashFirstLoaded(true);
            setIsHashLoaded(true);
            setHashValue( htmlDecode(window.location.hash) );
            setFilterValue( htmlDecode(window.location.hash.replace('#sound-', '')) );
        }
        loadData();
        if( isHashLoaded === true && hashValue !== '') {
            setIsHashLoaded(false);
            setTimeout(() => {  handleItemsLimit( htmlDecode(window.location.hash.replace('#sound-', '')) ); }, 500);
        }
    });

    const handlePageNumberClick = (e) => {
        setSoundsCurrentPage(Number(e.target.id));
    }

    const loadData = () => {
        // Load JSON file.
        if ( data.length === 0 ) {
            let newSounds = []
            sounds.forEach( (singleDataObject, index ) => {
                singleDataObject['index'] = ((index+1)+"").padStart(5, '0')
                newSounds.push(singleDataObject)
            })
            setData(newSounds) //.slice(0).sort((a,b) => Object.values(a)[1] < Object.values(b)[1]),
            setFilteredSounds(newSounds) //.slice(0).sort((a,b) => Object.values(a)[1] < Object.values(b)[1]),
        }

        // Load Characters.
        if ( (data.length !== 0) && (characters.length === 0) ) {
            lookupCharacter();
        }
        // Load Episodes.
        if ( (data.length !== 0) && (episodes.length === 0) ) {
            lookupEpisode();
        }
    }

    const lookupCharacter = () => {
        var lookup = {};
        var items = data;
        var result = [];
        for (var item, i = 0; !!(item = items[i++]);) {
            var characters = item.character;
            characters.forEach( character => {
                if (!(character in lookup)) {
                    lookup[character] = 1;
                    result.push(character);
                }
            })
        }
        setCharacters(result.sort())
    }

    const lookupEpisode = () => {
        var lookup = {};
        var items = data;
        var result = [];
        for (var item, i = 0; !!(item = items[i++]);) {
            var episode = item.episodeName;

            if (!(episode in lookup)) {
                lookup[episode] = 1;
                result.push([item.season, item.episode, item.episodeName]);
            }
        }
        setEpisodes(result.sort())
    }

    const handleFilterValueChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        setSoundsCurrentPage(1)
        setFilterValue(value)
        handleItemsLimit(value);
    }

    const handleFilterValueReset = () => {
        setSoundsCurrentPage(1)
        setFilterValue('')
        window.location.hash = ''
        handleItemsLimit('')
    }

    const handleRandomButtonClick = () => {
        let value = data[Math.floor(Math.random() * data.length)].title;
        setSoundsCurrentPage(1)
        setFilterValue(value)
        handleItemsLimit(value);
    }

    const handleCharacterClick = (e, character) => {
        e.preventDefault();
        if (character !== filterValue) {
            setSoundsCurrentPage(1)
            setFilterValue(character)
            handleItemsLimit(character);
            window.location.hash = htmlDecode('#sound-'+character)
        }
    }

    const handleEpisodeClick = (e, episode) => {
        e.preventDefault();
        if (episode !== filterValue) {
            setSoundsCurrentPage(1)
            setFilterValue(episode)
            handleItemsLimit(episode);
            window.location.hash = htmlDecode('#sound-'+episode)
        }
    }

    const handleItemsLimit = (filterGivenValue) => {
        let prepareFilter = data
        let filteredSounds = []

        if( data.length === 0 )
        {
            filteredSounds = data;
        } else {
            prepareFilter.forEach( (singleDataObject, index ) => {
                // Check 'index'
                if (((singleDataObject.index)+"").includes(filterGivenValue)) { filteredSounds.push(singleDataObject); return; }
                // Check 'character'
                (Object.values(singleDataObject)[0]).forEach( character => {
                    if (character.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filterGivenValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return; }
                })
                // Check 'episode'
                // string 'season' + 'episode'
                let seasonEpisode = singleDataObject.season+", "+singleDataObject.episode+" - "+singleDataObject.episodeName
                if ((seasonEpisode).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filterGivenValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return; }
                // Check 'title'
                if ((Object.values(singleDataObject)[5]).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filterGivenValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return; }
            })
        }
        setFilteredSounds(filteredSounds)
    }

    // Logic for displaying sounds
    const indexOfLastSound = soundsCurrentPage * soundsPerPage;
    const indexOfFirstSound = indexOfLastSound - soundsPerPage;
    const currentSounds = filteredSounds.slice(indexOfFirstSound, indexOfLastSound);

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredSounds.length / soundsPerPage); i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <AnchorLink href="#sounds" offset={() => 200} className={'btn btn-paginator' + (number === soundsCurrentPage ? ' active' : '')}
                key={number}
                id={number}
                onClick={handlePageNumberClick}
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
                <li key={i} id={item.index}>
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

                <SoundboardFilter filterValue={filterValue} onFilterValueChange={handleFilterValueChange} />

                <div id="random" className={'btn-container'}>
                    <div>
                        <SoundboardFilterResetButton onFilterValueChange={handleFilterValueReset} />
                        <RandomButton onRandomButtonClick={handleRandomButtonClick}/>
                    </div>
                </div>

                <div className={'list'}>
                    {
                        <>
                            <CharactersBox characters={characters} filterValue={filterValue} onCharacterClick={handleCharacterClick} />
                            <EpisodesBox episodes={episodes} filterValue={filterValue} onEpisodeClick={handleEpisodeClick} />
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
                    {(filteredSounds.length !== 0) ? ((filteredSounds.length === 1) ? <h6>1 résultat</h6> : <h6>{filteredSounds.length} résultats</h6>) : ''}
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

export default Soundboard;
