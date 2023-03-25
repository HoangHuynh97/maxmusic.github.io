import React, {useState, useRef} from 'react';
import styles from './Playlist.module.css';
import { FaHeart, FaPlay, FaPlayCircle, FaDownload} from 'react-icons/fa';
import {useParams, useNavigate} from "react-router-dom";
import Modal_action_song from '../Modal/Modal_action_song';
import Loading from '../Loading/Loading';
import axios from 'axios'
import '../global.js'


const Playlist = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isNamePlaylist, setNamePlaylist] = useState('');
    const [isNameCreateBy, setNameCreateBy] = useState('');
    const [isArrIMG, setArrIMG] = useState([]);
    const [isArrSongbyPlaylist, setArrSongbyPlaylist] = useState([]);
    
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

    React.useEffect(() => {
        window.scrollTo(0, 0);
        axios({
            method: 'post',
            url: global.api + '/get_Playlist',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id_playlist: params.id_playlist
            }
        }).then(res => {
            if(!res.data || res.data.length == 0) {
                navigate('/');
            }
            setNamePlaylist(res.data.dataPlaylist.name);
            setNameCreateBy(res.data.dataPlaylist.create_by);
            setArrIMG(res.data.dataPlaylist.img);

            let item = [];
            for (var i = 0; i < res.data.dataSongbyPlaylist.length; i++) {
                item.push({
                    name: res.data.dataSongbyPlaylist[i].name,
                    id_gg: res.data.dataSongbyPlaylist[i].id_gg,
                    image: res.data.dataSongbyPlaylist[i].image,
                    date_create: res.data.dataSongbyPlaylist[i].date_create,
                    id_singer: res.data.dataSongbyPlaylist[i].id_singer,
                    text_gr_singer: res.data.dataSongbyPlaylist[i].text_gr_singer
                });
            }
            setArrSongbyPlaylist(item);

            setTimeout(function () {      
               setLoading(false);
            }, 2000);
        });
    }, []);

    return(
        <div className="mm_container">
            {loading ? <Loading></Loading> : ''}
            <div className={styles.c_container_playlist}>
                <div className={styles.c_container_playlist_banner}>
                    <div className={styles.c_img_list}>
                        {isArrIMG.map((item, index) => {
                            return (
                                <img key={index} src={item.img} className={styles.c_img_list_list} alt=""/>
                            );
                        })}
                    </div>
                    <div className="text-title-15 color-fff nowrap text-center">
                        {isNamePlaylist}
                    </div>
                    <div>
                        <span className="text-title-1 color-797">Được tạo bởi </span>
                        <span className="text-title-1 color-fff">{isNameCreateBy}</span>
                    </div>
                    <div className="btn-icon-play">
                        <FaPlay/> <span>PHÁT NGẪU NHIÊN</span>
                    </div>
                </div>
                <div className={styles.c_container_playlist_song}>
                    <table className={styles.mm_table}>
                        <thead>
                            <tr>
                                <th>BÀI HÁT</th>
                                <th>THUỘC TÍNH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isArrSongbyPlaylist.length > 0 ? '' :
                                <tr>
                                    <td colSpan="2">
                                        <div className="c_content_tab_mv">
                                            <img src="/empty.png" alt=""/>
                                            <div className="c_text_empty">
                                                Chưa có bài hát nào trong thư viện
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {isArrSongbyPlaylist.map((item, index) => {
                                return (
                                    <tr key={index}>
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
                                                        <div className={`${styles.sc_c_des_singer} mginbt5`}>
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
                                                <div className={styles.sc_icon_table}>
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Playlist;