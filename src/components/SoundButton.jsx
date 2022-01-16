import useSound from 'use-sound';
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip';

const SoundButton = (props) => {
    let data = props.data
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [playSound, { stop }] = useSound(require('./../sounds/'+data.file), {
        id: () => data.file,
        onplay: () => setIsPlaying(true),
        onend: () => setIsPlaying(false),
    });

    const masterPlay = () => { if( isPlaying === true ) { stop(); setIsPlaying(false) } else { playSound(); window.location.hash = '#sound-'+(data.index+"").padStart(5, '0');} }
    const labelIcon = () => { return isPlaying ? 'playing' : ''; }

    const characters = () => {
        let charactersString = '';
        data.character.forEach( elem => {
            charactersString = charactersString+' — '+elem
        })
        return charactersString.slice(3)
    }

    return (
        <div>
            <a className={'btn btn-play '+ labelIcon()} role={'button'} onClick={() => masterPlay()} data-tip='' data-for={data.index}>
                <small>{characters()}</small>
                <br/>
                <span className={'strong'}>{data.title.slice(0, 110)}</span>
            </a>
            <ReactTooltip id={data.index} place="top" type="dark" effect="float" className={'react-tooltip-inner'}>
                <div >
                    {characters()}<br/>
                    {data.season}, {data.episode} — {data.episodeName}<br/>
                    {data.title}
                </div>
            </ReactTooltip>
        </div>
    );
}

export default SoundButton;
