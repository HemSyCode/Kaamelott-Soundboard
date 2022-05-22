import React, {useEffect} from 'react'
import ReactTooltip from 'react-tooltip'

const SoundButton = (props) => {
    let data = props.data
    const [isPlaying, setIsPlaying] = React.useState(false)
    let audio = new Audio(require('./../sounds/'+data.file))
    useEffect(() => {
        audio.addEventListener('ended', () => setIsPlaying(false))
        return () => {
            audio.removeEventListener('ended', () => setIsPlaying(false))
        }
    })

    const masterPlay = () => { if( isPlaying === true ) { /*audio.pause(); audio.currentTime = 0; setIsPlaying(false)*/ } else { audio.play(); setIsPlaying(true) } }
    const labelIcon = () => { return isPlaying ? 'playing' : '' }

    const characters = () => {
        let charactersString = ''
        data.character.forEach( elem => {
            charactersString = charactersString+' — '+elem
        })
        return charactersString.slice(3)
    }

    // SOURCE: https://stackoverflow.com/a/7467865/17875258
    function nl2br (str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
    }

    function createMarkup(str) {
        return {__html: nl2br(str, true)}
    }

    return (
        <div>
            <a className={'btn btn-play '+ labelIcon()} role={'button'} onClick={() => masterPlay()} data-tip='' data-for={data.index}>
                <small>{characters()}</small>
                <br/>
                <span className={'strong'}>{data.title.slice(0, 110)}</span>
            </a>
            <ReactTooltip id={data.index} place="top" type="dark" effect="float" className={'react-tooltip-inner'} data-html={true}>
                <div>
                    <span style={{"fontWeight": "bold"}}>{characters()}</span><br/>
                    <span style={{"fontStyle": "italic"}}>{data.season}, {data.episode} — {data.episodeName}</span><br/>
                    <br/>
                    <div dangerouslySetInnerHTML={createMarkup(data.title)} />
                </div>
            </ReactTooltip>
        </div>
    )
}

export default SoundButton
