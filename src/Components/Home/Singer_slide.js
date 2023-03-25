import React from 'react';
import styles from './Singer_slide.module.css';
import { useNavigate } from 'react-router-dom';

const Singer_slide = (props) => {
    const navigate = useNavigate();

    function singerPage(id) {
        navigate('/singer/'+id);
    }

    return(
        <div className={styles.sc_banner_slide_singer} onClick={() => {singerPage(props.idSinger)}}>
            <img src={props.src} alt=""/>
        </div>
    );
};

export default Singer_slide;