import React, {useEffect, useRef, useState} from 'react'
import ReactTooltip from 'react-tooltip'

const SoundButton = (props) => {
    let data = props.data
    let autoPlayVal = (props.autoPlay === true)

    const [isPlaying, setIsPlaying] = useState(false)
    const [isPlayed, setIsPlayed] = useState(false)
    const audioPlayer = useRef();
    const [currentTime, setCurrentTime] = useState(0);
    const [seekValue, setSeekValue] = useState(0);
    const [bufferedValue, setBufferedValue] = useState(0);
    const [tooltip, showTooltip] = useState(true);

    const play = () => { audioPlayer.current.play(); setIsPlaying(true) }
    const pause = () => { audioPlayer.current.pause(); setIsPlaying(false) }
    const stop = () => { audioPlayer.current.pause(); audioPlayer.current.currentTime = 0; setIsPlaying(false); }
    const setSpeed = (speed) => { audioPlayer.current.playbackRate = speed }
    const canPlay = () => {  }
    const onPlaying = () => { setCurrentTime(audioPlayer.current.currentTime); setSeekValue( (audioPlayer.current.currentTime / audioPlayer.current.duration) * 100 ); setBufferedValue( (audioPlayer.current.buffered.end(audioPlayer.current.buffered.length - 1) / audioPlayer.current.duration) * 100 ) }
    const masterPlay = () => { if( isPlaying === true ) { pause() } else { play() } }
    const autoPlayAction = () => { if( (isPlaying === false) && autoPlayVal === true && (isPlayed === false) ) { masterPlay(); } else {  } }
    const labelIcon = () => { return isPlaying ? 'playing' : '' }

    useEffect(() => {
        audioPlayer.current.addEventListener('ended', () => { setIsPlaying(false); setSeekValue(0); setIsPlayed(true) })
        // return () => { audioPlayer.current.removeEventListener('ended', () => { setIsPlaying(false); setSeekValue(0) }) }
    })

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
            { autoPlayAction() }
            <span className={'btn-info'} data-tip='' data-for={'tooltip-'+((data.id+"").padStart(5, "0"))}
                  onMouseEnter={() => showTooltip(true)}
                  onMouseLeave={() => {
                      showTooltip(false);
                      setTimeout(() => showTooltip(true), 50);
                  }} />
            <a className={'btn btn-play '+ labelIcon()} role={'button'} onClick={() => masterPlay()} style={{"background": "linear-gradient(to right, #017F66 "+seekValue+"%, #18ae90 0%)"}}>
                <small>{characters()}</small>
                {/*<input type="range" min="0" max="100" step="1" value={seekValue} onChange={(e) => { const seekto = audioPlayer.current.duration * (+e.target.value / 100); audioPlayer.current.currentTime = seekto; setSeekValue(e.target.value); }}/>*/}
                <br/>
                <span className={'strong'}>{data.title.slice(0, 110)}</span>
            </a>
            <div className="audio-buffer" style={{"background": "linear-gradient(to right, #017F66 " + bufferedValue + "%, #18ae90 0%)"}}/>
            <audio id={'audio-'+((data.id+"").padStart(5, "0"))} ref={audioPlayer} onTimeUpdate={onPlaying} onCanPlay={canPlay} onDurationChange={() => {setSeekValue(0); setBufferedValue(0); stop(); setIsPlayed(false)}} src={require('./../sounds/' + data.file)}>Your browser does not support the <code>audio</code> element.</audio>
            {
                /*
                * FIX UNTIL THE PACKAGE IS UPDATED.
                * SOURCE: https://github.com/wwayne/react-tooltip/issues/769
                */
                tooltip
                &&
                <ReactTooltip id={'tooltip-'+((data.id+"").padStart(5, "0"))} place="top" type="dark" effect="float" className={'react-tooltip-inner'} data-html={true}>
                    <div>
                        <span style={{"fontWeight": "bold"}}>{characters()}</span><br/>
                        <span style={{"fontStyle": "italic"}}>{data.season}, {data.episode} — {data.episodeName}</span><br/>
                        <br/>
                        <div dangerouslySetInnerHTML={createMarkup(data.title)} />
                    </div>
                </ReactTooltip>
            }
        </div>
    )
}

export default SoundButton
