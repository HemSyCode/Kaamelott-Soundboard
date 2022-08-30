import './App.scss'
import React, {useState, useEffect} from "react"
import sounds from './sounds/sounds.json'
import { Trans } from 'react-i18next'
import SoundButton from './components/SoundButton'
import SoundboardFilter from './components/SoundboardFilter'
import SoundboardFilterResetButton from './components/SoundboardFilterResetButton'
import CharactersBox from './components/CharactersBox'
import EpisodesBox from './components/EpisodesBox'
import AnchorLink from './components/AnchorLink'
import RandomButton from "./components/RandomButton"
import LocaleSelectorButton from "./components/LocaleSelectorButton"

const Soundboard = (props) => {
    const [data, setData] = useState([])
    const [filteredSounds, setFilteredSounds] = useState([])
    const [characters, setCharacters] = useState([])
    const [episodes, setEpisodes] = useState([])
    const [soundsCurrentPage, setSoundsCurrentPage] = useState(1)
    const [soundsPerPage, setSoundsPerPage] = useState(100)
    const [filterValue, setFilterValue] = useState('')
    const [isHashFirstLoaded, setIsHashFirstLoaded] = useState(false)
    const [isHashLoaded, setIsHashLoaded] = useState(false)
    const [hashValue, setHashValue] = useState('')
    const [empty, setEmpty] = useState(Math.random())

    function htmlDecode(input) {
        return decodeURI((input+"").normalize("NFD").replace(/\p{Diacritic}/gu, ""))
    }

    // Force a render with a simulated state change
    const rerender = () => { setEmpty(Math.random()) }

    useEffect(() => {
        if(isHashFirstLoaded === false && isHashLoaded === false) {
            setIsHashFirstLoaded(true)
            setIsHashLoaded(true)
            setHashValue( htmlDecode(window.location.hash) )
            setFilterValue( htmlDecode(window.location.hash.replace('#sound-', '')) )
        }
        loadData()
        if( isHashLoaded === true && hashValue !== '') {
            setIsHashLoaded(false)
            setTimeout(() => {  handleFilterChange( htmlDecode(window.location.hash.replace('#sound-', '')) ); }, 500);
        }
    })

    const handlePageNumberClick = (e) => {
        setSoundsCurrentPage(Number(e.target.id))
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
            lookupCharacter()
        }
        // Load Episodes.
        if ( (data.length !== 0) && (episodes.length === 0) ) {
            lookupEpisode()
        }
    }

    const lookupCharacter = () => {
        var lookup = {}
        var items = data
        var result = []
        for (var item, i = 0; !!(item = items[i++]);) {
            var characters = item.character
            characters.forEach( character => {
                if (!(character in lookup)) {
                    lookup[character] = 1
                    result.push(character)
                }
            })
        }
        setCharacters(result.sort())
    }

    const lookupEpisode = () => {
        var lookup = {}
        var items = data
        var result = []
        for (var item, i = 0; !!(item = items[i++]);) {
            var episode = item.episodeName

            if (!(episode in lookup)) {
                lookup[episode] = 1
                result.push([item.season, item.episode, item.episodeName])
            }
        }
        setEpisodes(result.sort())
    }

    const handleFilterValueChange = (e) => {
        e.preventDefault()
        let value = e.target.value
        setSoundsCurrentPage(1)
        setFilterValue(value)
        window.location.replace(htmlDecode('#sound-'+value))
        handleFilterChange(value)
    }

    const handleFilterValueReset = () => {
        setSoundsCurrentPage(1)
        setFilterValue('')
        window.location.hash = ''
        handleFilterChange('')
    }

    const handleRandomButtonClick = () => {
        let value = data[Math.floor(Math.random() * data.length)].title
        setSoundsCurrentPage(1)
        setFilterValue(value)
        handleFilterChange(value)
    }

    const handleCharacterClick = (e, character) => {
        e.preventDefault()
        if (character !== filterValue) {
            setSoundsCurrentPage(1)
            setFilterValue(character)
            handleFilterChange(character)
            window.location.hash = htmlDecode('#sound-'+character)
        }
    }

    const handleEpisodeClick = (e, episode) => {
        e.preventDefault()
        if (episode !== filterValue) {
            setSoundsCurrentPage(1)
            setFilterValue(episode)
            handleFilterChange(episode)
            window.location.hash = htmlDecode('#sound-'+episode)
        }
    }

    const handleFilterChange = (filterGivenValue) => {
        let prepareFilter = data
        let filteredSounds = []

        filterGivenValue = filterGivenValue.trim()

        if( data.length === 0 )
        {
            filteredSounds = data
        } else {
            prepareFilter.forEach( (singleDataObject, index ) => {
                // Check 'index'.
                if (((singleDataObject.index)+"").includes(filterGivenValue)) { filteredSounds.push(singleDataObject); return }
                // Check 'character'.
                (Object.values(singleDataObject)[0]).forEach( character => {
                    if (character.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filterGivenValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return }
                })
                // Check 'episode'.
                // string 'season' + 'episode'.
                let seasonEpisode = singleDataObject.season+", "+singleDataObject.episode+" - "+singleDataObject.episodeName
                if ((seasonEpisode).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filterGivenValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return }
                // Check 'title'.
                if ((Object.values(singleDataObject)[5]).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").includes(filterGivenValue.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""))) { filteredSounds.push(singleDataObject); return }
            })
        }
        // Remove duplicates values.
        const newFilteredSounds = [...new Set(filteredSounds)]
        setFilteredSounds(newFilteredSounds)
    }

    // Logic for displaying sounds.
    const indexOfLastSound = soundsCurrentPage * soundsPerPage
    const indexOfFirstSound = indexOfLastSound - soundsPerPage
    const currentSounds = filteredSounds.slice(indexOfFirstSound, indexOfLastSound)

    // Logic for displaying page numbers.
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(filteredSounds.length / soundsPerPage); i++) {
        pageNumbers.push(i)
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
        )
    })

    // Logic for displaying sounds.
    const renderSounds = (currentSounds.length === 0)
        ?
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
                <div className={"header-container"}>
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <span className={'author-link'}>
                                <a href={'https://hemsy.fr/'} title={'Sylvain HÉMON - HemSy.fr'}><img src={require('./img/hemsyLogo_white-vector.svg').default} alt={'HemSy.fr'} width={'100px'}/></a>
                            </span>
                        </div>
                        <div className="col-12 col-md-4">
                            <span className={"title"}>Kaamelott Soundboard</span>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="home-page-local-lang">
                                <LocaleSelectorButton locale={'fr'} localeIcon={'fr'} localeName={'Français'} onLocaleSelectorButtonClick={() => {rerender()}}/>
                                <LocaleSelectorButton locale={'en'} localeIcon={'gb'} localeName={'English'} onLocaleSelectorButtonClick={() => {rerender()}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main id={'main'} className={'site-main'} role={'main'}>
                <SoundboardFilter filterValue={filterValue} onFilterValueChange={handleFilterValueChange} />
                <div id="random" className={'btn-container'}>
                    <div>
                        <SoundboardFilterResetButton onFilterValueChange={handleFilterValueReset} />
                        <RandomButton onRandomButtonClick={handleRandomButtonClick} />
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
                                    <h3><Trans>app_page</Trans></h3>
                                </div>
                                <div className="content">
                                    {renderPageNumbers}
                                </div>
                            </div>
                        :
                            ''
                }
                <div id="sounds" className={'list btn-container'}>
                    {(filteredSounds.length !== 0) ? ((filteredSounds.length === 1) ? <h6>1 <Trans>app_result</Trans></h6> : <h6>{filteredSounds.length} <Trans>app_results</Trans></h6>) : ''}
                    <ul>{ renderSounds }</ul>
                </div>
                {
                    (pageNumbers.length >= 2)
                        ?
                            <div id="pages-bottom" className="paginator-container">
                                <div className="header">
                                    <h3><Trans>app_page</Trans></h3>
                                </div>
                                <div className="content">
                                    {renderPageNumbers}
                                </div>
                            </div>
                        :
                            ''
                }
            </main>

            <footer>
                <a href={'https://github.com/HemSyCode/Kaamelott-Soundboard'} target={'_blank'} style={{'marginRight': '50px'}}><img src={require('./img/github.svg').default} alt={'GitHub'} height={'40px'} width={'40px'}/></a>
                <a href={'https://hemsy.fr/'}><img src={require('./img/hemsyLogoSquareIcon_white-vector.svg').default} alt={'HemSy.fr'} height={'40px'} width={'40px'}/></a>
            </footer>

        </div>
    )
}

export default Soundboard
