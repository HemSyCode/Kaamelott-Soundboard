import useSound from 'use-sound';
import React from "react";
import ReactTooltip from 'react-tooltip';

const SoundButton = (data) => {
    data = data.data
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [playSound, { stop }] = useSound(require('./../sounds/'+data.file), {
        id: () => data.file,
        onplay: () => setIsPlaying(true),
        onend: () => setIsPlaying(false),
    });

    const masterPlay = () => { if( isPlaying === true ) { stop(); setIsPlaying(false) } else { playSound(); } }
    const labelIcon = () => {
        return isPlaying ? '' : 'playing';
    }

    return (
        <div>
            <a className={'btn btn-play '+ labelIcon()} role={'button'} onClick={() => masterPlay()} data-tip='' data-for={data.file}>
                <small>{data.character}</small>
                <br/>
                <span className={'strong'}>{data.title.slice(0, 110)}</span>
            </a>
            <ReactTooltip id={data.file} place="top" type="dark" effect="float" className={'react-tooltip-inner'}>
                <div >
                    {data.character}<br/>
                    {data.episode}<br/>
                    {data.title}
                </div>
            </ReactTooltip>
        </div>
    );
}

export default SoundButton;
