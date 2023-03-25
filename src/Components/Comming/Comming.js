import React from 'react';
import styles from './Comming.module.css';

class Comming extends React.Component {

    render() {
        return(
            <div className="mm_container">
                <div className={styles.coming}>
                    <img src="/soon.gif" alt=""/>
                </div>
            </div>
        );
    }
};

export default Comming;