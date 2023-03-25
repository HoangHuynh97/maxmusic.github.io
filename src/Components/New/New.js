import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import styles from './New.module.css';
import { FaChevronCircleLeft, FaChevronRight, FaChevronCircleRight, FaHeart, FaPlay, FaPlayCircle, FaDownload} from 'react-icons/fa';

import axios from 'axios'
import '../global.js'

const New = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isStart, setIsStart] = useState(0);
    const [arrSong, setArrSong] = useState([]);

    function singerPage(id) {
        navigate('/singer/'+id);
    }

    function playSongByID(id_gg, singer, nameSong, imgSong) {
        if(sessionStorage.getItem("url_song") != '') {
            sessionStorage.removeItem("url_song");
            sessionStorage.removeItem("name_singer");
            sessionStorage.removeItem("name_song");
            sessionStorage.removeItem("img_song");
        }

        sessionStorage.setItem("url_song", id_gg);
        sessionStorage.setItem("name_singer", singer);
        sessionStorage.setItem("name_song", nameSong);
        sessionStorage.setItem("img_song", imgSong);
        window.dispatchEvent(new Event("storage"));
    }

    function addLike(id) {
        axios({
            method: 'post',
            url: global.api + '/add_like',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id: id,
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            if(res.data.message == 'success') {
                setArrSong(arrSong => arrSong.map((item, i) =>
                                item.id == res.data.id ? {...item, is_like: res.data.id} : item
                            ));
            }
        });
    }
    function delLike(id) {
        axios({
            method: 'post',
            url: global.api + '/del_like',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id: id,
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            if(res.data.message == 'success') {
                setArrSong(arrSong => arrSong.map((item, i) =>
                                item.id == res.data.id ? {...item, is_like: 0} : item
                            ));
            }
        });
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
        axios({
            method: 'post',
            url: global.api + '/get_DataNew',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id_user: sessionStorage.getItem('id_user'),
                isStart: isStart,
                loadMore: 20
            }
        }).then(res => {
            let itemSong = [];
            for (var i = 0; i < res.data.dataSongNew.length; i++) {
                itemSong.push({
                    id: res.data.dataSongNew[i].id,
                    is_like: res.data.dataSongNew[i].is_like,
                    name: res.data.dataSongNew[i].name,
                    id_gg: res.data.dataSongNew[i].id_gg,
                    image: res.data.dataSongNew[i].image,
                    date_create: res.data.dataSongNew[i].date_create,
                    id_singer: res.data.dataSongNew[i].id_singer,
                    text_gr_singer: res.data.dataSongNew[i].text_gr_singer
                });
            }
            setArrSong(itemSong);
            setIsStart(isStart+20);

            setTimeout(function () {
               setLoading(false);
            }, 2000);
        });
    }, []);

    window.onscroll = function(ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            axios({
                method: 'post',
                url: global.api + '/get_DataNew',
                headers: {'Content-Type': 'application/json'}, 
                data: {
                    id_user: sessionStorage.getItem('id_user'),
                    isStart: isStart,
                    loadMore: 20
                }
            }).then(res => {
                if(res.data.dataSongNew) {
                    let itemSong = [];
                    for (var i = 0; i < res.data.dataSongNew.length; i++) {
                        itemSong.push({
                            id: res.data.dataSongNew[i].id,
                            is_like: res.data.dataSongNew[i].is_like,
                            name: res.data.dataSongNew[i].name,
                            id_gg: res.data.dataSongNew[i].id_gg,
                            image: res.data.dataSongNew[i].image,
                            date_create: res.data.dataSongNew[i].date_create,
                            id_singer: res.data.dataSongNew[i].id_singer,
                            text_gr_singer: res.data.dataSongNew[i].text_gr_singer
                        });
                    }
                    setArrSong([...arrSong, ...itemSong]);
                    setIsStart(isStart+20);
                }
            });
        }
    };

    return(
        <div className="mm_container">
            {loading ? <Loading></Loading> : ''}
            <div className={styles.mm_title_menu}>
                <span>Nhạc mới</span>
                <div className={styles.mm_icon_title_menu}>
                    <FaPlayCircle/>
                </div>
            </div>
            <div className={styles.mm_list_random}>
                <div className={styles.mm_container_tab}>
                    <table className={styles.mm_table}>
                        <tbody>
                            {arrSong.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <div
                                                className={`${styles.number_song} ${
                                                    index == 0 ? ''
                                                    : index == 1 ? styles.number_tow
                                                    : index == 2 ? styles.number_three
                                                    : styles.number_out
                                                }`}
                                            >
                                                <span>{index+1}</span>
                                            </div>
                                        </td>   
                                        <td>
                                            <div className={styles.c_td_box_image}>
                                                <div className={styles.sc_container_box_song}>
                                                    <div className={styles.sc_c_img} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                                        <img src={item.image} alt=""/>
                                                        <div className={`${styles.sc_c_img_bg} ${styles.hidden}`}>
                                                            <img src="/play.png" className={styles.play_icon}/>
                                                        </div>
                                                    </div>
                                                    <div className={styles.sc_c_des}>
                                                        <div className={styles.sc_c_des_name} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                                            <h5>{item.name}</h5>
                                                        </div>
                                                        <div className={styles.sc_c_des_singer}>
                                                            {item.id_singer.map((item2, index2) => {
                                                                return (
                                                                    <a key={index2} className="sc_text_link" onClick={() => {singerPage(item2.id)}}>
                                                                        {item2.name}
                                                                        <span className="nohover_singer">
                                                                            {item.id_singer.length > 1 && item.id_singer.length - 1 > index2 ? ' x ' : ''}
                                                                        </span>
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.sc_option_table}>
                                                <div
                                                    className={`${styles.sc_icon_table} ${item.is_like != 0 ? 'heart_active' : ''}`}
                                                    onClick={item.is_like != 0 ? () => {delLike(item.id)} : () => {addLike(item.id)}}
                                                >
                                                    <FaHeart/>
                                                </div>
                                                <div className={styles.sc_icon_table}>
                                                    <FaDownload/>
                                                </div>
                                                <div className={styles.sc_icon_table} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                                    <FaPlay/>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default New;