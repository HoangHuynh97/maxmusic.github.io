import React, {useState, useRef} from 'react';
import styles from './Singer.module.css';
import { FaEllipsisH, FaPlayCircle, FaChevronRight, FaHeart, FaDownload } from 'react-icons/fa';
import {useParams, useNavigate} from "react-router-dom";
import Modal_action_song from '../Modal/Modal_action_song';
import Loading from '../Loading/Loading';
import axios from 'axios'
import '../global.js'

const Singer = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [isShow, setShow] = useState(false);
    const [isNameSinger, setNameSinger] = useState('');
    const [isIMGSinger, setIMGSinger] = useState('');
    const [arrSongbySinger, setArrSongbySinger] = useState([]);
    const [arrPlaylistbySinger, setArrPlaylistbySinger] = useState([]);

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

    function showModalActionSong() {
        setShow(true);
    }

    function hiddenModalActionSong() {
        setShow(false);
    }

    function playlistPage(id) {
        navigate('/playlist/'+id);
    }

    function singerPage(id) {
        window.scrollTo(0, 0);   
        setLoading(true);
        axios({
            method: 'post',
            url: global.api + '/get_Singer',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id_singer: id
            }
        }).then(res => {

            setNameSinger(res.data.dataNameSinger);
            setIMGSinger(res.data.dataImgSinger);

            let item = [];
            for (var i = 0; i < res.data.dataSongbySinger.length; i++) {
                item.push({
                    name: res.data.dataSongbySinger[i].name,
                    id_gg: res.data.dataSongbySinger[i].id_gg,
                    image: res.data.dataSongbySinger[i].image,
                    date_create: res.data.dataSongbySinger[i].date_create,
                    id_singer: res.data.dataSongbySinger[i].id_singer,
                    text_gr_singer: res.data.dataSongbySinger[i].text_gr_singer
                });
            }
            setArrSongbySinger(item);

            let itemPlaylist = [];
            for (var i = 0; i < res.data.dataPlaylist.length; i++) {
                itemPlaylist.push({
                    id: res.data.dataPlaylist[i].id,
                    name: res.data.dataPlaylist[i].name,
                    img: res.data.dataPlaylist[i].img,
                    create_by: res.data.dataPlaylist[i].create_by
                });
            }
            setArrPlaylistbySinger(itemPlaylist);

            setTimeout(function () {      
               setLoading(false);
            }, 2000);
        });
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
        axios({
            method: 'post',
            url: global.api + '/get_Singer',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id_singer: params.id
            }
        }).then(res => {
            // console.log(res.data.dataPlaylist);
            if(!res.data.dataNameSinger) {
                navigate('/');
            }
            setNameSinger(res.data.dataNameSinger);
            setIMGSinger(res.data.dataImgSinger);

            let item = [];
            for (var i = 0; i < res.data.dataSongbySinger.length; i++) {
                item.push({
                    name: res.data.dataSongbySinger[i].name,
                    id_gg: res.data.dataSongbySinger[i].id_gg,
                    image: res.data.dataSongbySinger[i].image,
                    date_create: res.data.dataSongbySinger[i].date_create,
                    id_singer: res.data.dataSongbySinger[i].id_singer,
                    text_gr_singer: res.data.dataSongbySinger[i].text_gr_singer
                });
            }
            setArrSongbySinger(item);

            let itemPlaylist = [];
            for (var i = 0; i < res.data.dataPlaylist.length; i++) {
                itemPlaylist.push({
                    id: res.data.dataPlaylist[i].id,
                    name: res.data.dataPlaylist[i].name,
                    img: res.data.dataPlaylist[i].img,
                    create_by: res.data.dataPlaylist[i].create_by
                });
            }
            setArrPlaylistbySinger(itemPlaylist);

            setTimeout(function () {      
               setLoading(false);
            }, 2000);
        });
    }, []);
    return(
        <div className="mm_container">
            {loading ? <Loading></Loading> : ''}
            <div className={styles.mm_container_banner_singer}>
                <div className={styles.mm_img_banner_singer}>
                    <img src={isIMGSinger} alt=""/>
                </div>
                <div className="text-title-3 title_singer mginl20 color-fff">
                    {isNameSinger}
                </div>
            </div>
            <div className={`${styles.mm_new_song} ${styles.block}`}>
                <div className={`${styles.sc_container_box_list} ${styles.inblock} ${styles.w100} mginbt20`}>
                    <div className={`${styles.mm_title_list} ${styles.left}`}>
                        <h4>Bài hát nổi bật</h4>
                    </div>
                    <div className={styles.mm_see_all}>
                        <h4>TẤT CẢ</h4><FaChevronRight/>
                    </div>
                </div>
                <div className={styles.mm_container_box_song}>
                    {arrSongbySinger.map((item, index) => {
                        return (
                            <div key={index} className={styles.sc_container_box_song}>
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
                                    <div className={styles.sc_c_des_date}>
                                        <h5>{item.date_create}</h5>
                                    </div>
                                </div>
                                <div className={styles.sc_c_more_action} onMouseLeave={() => {hiddenModalActionSong()}}>
                                    <div className={styles.sc_c_more_icon} onClick={() => {showModalActionSong()}}>
                                        <FaEllipsisH/>
                                        <Modal_action_song checkShow={isShow}></Modal_action_song>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className={styles.mm_category}>
                <div className={`${styles.sc_container_box_list} ${styles.inblock} ${styles.w100}`}>
                    <div className={`${styles.mm_title_list} ${styles.left}`}>
                        <h4>Xuất hiện trong</h4>
                    </div>
                    <div className={styles.mm_see_all}>
                        <h4>TẤT CẢ</h4><FaChevronRight/>
                    </div>
                </div>
                <div className={styles.sc_container_box_list_song}>
                    {arrPlaylistbySinger.map((item, index) => {
                        return (
                            <div key={index} className={styles.sc_box_list} onClick={() => {playlistPage(item.id)}}>
                                <div className={styles.sc_container_img_list}>
                                    <div className={styles.c_img_list}>
                                        {item.img.map((item2, index2) => {
                                            return (
                                                <img key={index2} src={item2.img} className={styles.c_img_list_list} alt=""/>
                                            );
                                        })}
                                    </div>
                                    <div className={styles.c_container_img}>
                                        <div className={styles.c_content_img}>
                                            <div className={styles.c_box_icon}>
                                                <FaHeart/>
                                            </div>
                                            <div className={styles.c_icon_play} onClick={() => {playlistPage(item.id)}}>
                                                <FaPlayCircle/>
                                            </div>
                                            <div className={styles.c_box_icon}>
                                                <FaDownload/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.sc_c_des_name}>
                                    <h5>{item.name}</h5>
                                </div>
                                <div className={styles.sc_c_des_singer}>
                                    <h5>Tạo bởi {item.create_by}</h5>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.mm_category}>
                <div className={`${styles.sc_container_box_list} ${styles.inblock} ${styles.w100}`}>
                    <div className={`${styles.mm_title_list} ${styles.left}`}>
                        <h4>Music Video</h4>
                    </div>
                    <div className={styles.mm_see_all}>
                        <h4>TẤT CẢ</h4><FaChevronRight/>
                    </div>
                </div>
                <div className={styles.sc_container_box_list_song}>
                    <div className={styles.sc_box_list}>
                        <div className={styles.sc_container_img_list}>
                            <img src="/am-nhac.jpg" className={styles.c_img_list} alt=""/>
                            <div className={styles.c_container_img}>
                                <div className={styles.c_content_img}>
                                    <div className={styles.c_box_icon}>
                                        <FaHeart/>
                                    </div>
                                    <div className={styles.c_icon_play}>
                                        <FaPlayCircle/>
                                    </div>
                                    <div className={styles.c_box_icon}>
                                        <FaDownload/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sc_c_des_name}>
                            <h5>This is name</h5>
                        </div>
                        <div className={styles.sc_c_des_singer}>
                            <h5>This is content</h5>
                        </div>
                    </div>
                    <div className={styles.sc_box_list}>
                        <div className={styles.sc_container_img_list}>
                            <img src="/am-nhac.jpg" className={styles.c_img_list} alt=""/>
                            <div className={styles.c_container_img}>
                                <div className={styles.c_content_img}>
                                    <div className={styles.c_box_icon}>
                                        <FaHeart/>
                                    </div>
                                    <div className={styles.c_icon_play}>
                                        <FaPlayCircle/>
                                    </div>
                                    <div className={styles.c_box_icon}>
                                        <FaDownload/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sc_c_des_name}>
                            <h5>This is name</h5>
                        </div>
                        <div className={styles.sc_c_des_singer}>
                            <h5>This is content</h5>
                        </div>
                    </div>
                    <div className={styles.sc_box_list}>
                        <div className={styles.sc_container_img_list}>
                            <img src="/am-nhac.jpg" className={styles.c_img_list} alt=""/>
                            <div className={styles.c_container_img}>
                                <div className={styles.c_content_img}>
                                    <div className={styles.c_box_icon}>
                                        <FaHeart/>
                                    </div>
                                    <div className={styles.c_icon_play}>
                                        <FaPlayCircle/>
                                    </div>
                                    <div className={styles.c_box_icon}>
                                        <FaDownload/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sc_c_des_name}>
                            <h5>This is name</h5>
                        </div>
                        <div className={styles.sc_c_des_singer}>
                            <h5>This is content</h5>
                        </div>
                    </div>
                    <div className={styles.sc_box_list}>
                        <div className={styles.sc_container_img_list}>
                            <img src="/am-nhac.jpg" className={styles.c_img_list} alt=""/>
                            <div className={styles.c_container_img}>
                                <div className={styles.c_content_img}>
                                    <div className={styles.c_box_icon}>
                                        <FaHeart/>
                                    </div>
                                    <div className={styles.c_icon_play}>
                                        <FaPlayCircle/>
                                    </div>
                                    <div className={styles.c_box_icon}>
                                        <FaDownload/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sc_c_des_name}>
                            <h5>This is name</h5>
                        </div>
                        <div className={styles.sc_c_des_singer}>
                            <h5>This is content</h5>
                        </div>
                    </div>
                    <div className={styles.sc_box_list}>
                        <div className={styles.sc_container_img_list}>
                            <img src="/am-nhac.jpg" className={styles.c_img_list} alt=""/>
                            <div className={styles.c_container_img}>
                                <div className={styles.c_content_img}>
                                    <div className={styles.c_box_icon}>
                                        <FaHeart/>
                                    </div>
                                    <div className={styles.c_icon_play}>
                                        <FaPlayCircle/>
                                    </div>
                                    <div className={styles.c_box_icon}>
                                        <FaDownload/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.sc_c_des_name}>
                            <h5>This is name</h5>
                        </div>
                        <div className={styles.sc_c_des_singer}>
                            <h5>This is content</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Singer;