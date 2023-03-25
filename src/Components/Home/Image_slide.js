import React from 'react';
import styles from './Image_slide.module.css';
import { useNavigate } from 'react-router-dom';

const Image_slide = (props) => {
    const navigate = useNavigate();

    function playlistPage(url) {
        navigate(url);
    }

    return(
        <div className={styles.sc_banner_slide} onClick={() => {playlistPage(props.isURL)}}>
            <img src={props.src} alt=""/>
        </div>
    );
};

export default Image_slide;