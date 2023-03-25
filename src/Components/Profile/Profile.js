import React, {useState, useRef} from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { FaChevronCircleLeft, FaChevronRight, FaChevronCircleRight, FaHeart, FaPlay, FaPlayCircle, FaDownload} from 'react-icons/fa';
import axios from 'axios'
import '../global.js'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Profile = (props) => {
    const navigate = useNavigate();
    const [tab, setTab] = useState(1);
    const [loading, setLoading] = useState(true);
    const [arrPlaylist, setArrPlaylist] = useState([]);
    const [arrSongLike, setArrSongLike] = useState([]);
    

    function changeTab(value) {
        setTab(value);
    }

    function singerPage(id) {
        navigate('/singer/'+id);
    }

    function playlistPage(id) {
        navigate('/playlist/'+id);
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
                setArrSongLike(arrSongLike => arrSongLike.map((item, i) =>
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
                setArrSongLike(arrSongLike => arrSongLike.map((item, i) =>
                                item.id == res.data.id ? {...item, is_like: 0} : item
                            ));
            }
        });
    }

    React.useEffect(() => {
        window.scrollTo(0, 0);
        if(sessionStorage.getItem("id_user") == null) {
            withReactContent(Swal).fire({
                title: '<strong>Vui lòng đăng nhập!</strong>',
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText:'Ok!'
            });
            navigate('/');
        } else {
            axios({
                method: 'post',
                url: global.api + '/get_DataProfile',
                headers: {'Content-Type': 'application/json'}, 
                data: {
                    id_user: sessionStorage.getItem("id_user")
                }
            }).then(res => {
                let itemPlaylist = [];
                for (var i = 0; i < res.data.dataPlaylist.length; i++) {
                    itemPlaylist.push({
                        name: res.data.dataPlaylist[i].name,
                        id: res.data.dataPlaylist[i].id,
                        img: res.data.dataPlaylist[i].img,
                        create_by: res.data.dataPlaylist[i].create_by
                    });
                }
                setArrPlaylist(itemPlaylist);

                
                let itemSongLike = [];
                for (var i = 0; i < res.data.dataSongLike.length; i++) {
                    itemSongLike.push({
                        id: res.data.dataSongLike[i].id,
                        is_like: res.data.dataSongLike[i].is_like,
                        name: res.data.dataSongLike[i].name,
                        id_gg: res.data.dataSongLike[i].id_gg,
                        image: res.data.dataSongLike[i].image,
                        date_create: res.data.dataSongLike[i].date_create,
                        id_singer: res.data.dataSongLike[i].id_singer,
                        text_gr_singer: res.data.dataSongLike[i].text_gr_singer
                    });
                }
                setArrSongLike(itemSongLike);

                setTimeout(function () {      
                   setLoading(false);
                }, 2000);
            });
        }
    }, []);

    return(
        <div className="mm_container">
            {loading ? <Loading></Loading> : ''}
            <div className={styles.mm_title_menu}>
                <span>Thư viện</span>
                <div className={styles.mm_icon_title_menu}>
                    <FaPlayCircle/>
                </div>
            </div>
            <div className={styles.mm_list_random}>
                <div className={`${styles.sc_container_box_list} ${styles.inblock} ${styles.w100}`}>
                    <div className={`${styles.mm_title_list} ${styles.left}`}>
                        <h4>Playlist</h4>
                    </div>
                    <div className={styles.mm_see_all}>
                        <h4>TẤT CẢ</h4><FaChevronRight/>
                    </div>
                </div>
                <div className={styles.sc_container_box_list_song}>
                    {arrPlaylist.map((item, index) => {
                        return (
                            <div key={index} className={styles.sc_box_list} onClick={() => {playlistPage(item.id)}}>
                                <div className={styles.sc_container_img_list}>
                                    <div className={styles.c_img_list}>
                                        {item.img.map((item2, index2) => {
                                            return (
                                                <img
                                                    key={index2}
                                                    src={item2.img}
                                                    className={styles.c_img_list_list}
                                                    alt=""
                                                />
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
            <div className={styles.mm_list_random}>
                <div className={styles.mm_tab}>
                    <div className={`${styles.c_tab_title} ${tab == 1 ? "active_tab" : ""}`} onClick={() => {changeTab(1)}}>
                        <span>BÀI HÁT</span>
                    </div>
                    <div className={`${styles.c_tab_title} ${tab == 2 ? "active_tab" : ""}`} onClick={() => {changeTab(2)}}>
                        <span>MV</span>
                    </div>
                </div>
                <div className={styles.mm_container_tab}>
                    <div className={`${styles.c_content_tab} ${tab == 1 ? "" : "hidden"}`}>
                        <div className={styles.btn_hight}>
                            YÊU THÍCH
                        </div>
                        {arrSongLike.length > 0 ? '' : <div className={styles.c_content_tab_mv}>
                                                            <img src="/empty.png" alt=""/>
                                                            <div className={styles.c_text_empty}>
                                                                Chưa có bài hát yêu thích nào trong thư viện
                                                            </div>
                                                        </div>
                        }
                            
                        <table className={`${styles.mm_table} ${arrSongLike.length > 0 ? '' : 'hidden'}`}>
                            <thead>
                                <tr>
                                    <th>BÀI HÁT</th>
                                    <th>THUỘC TÍNH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {arrSongLike.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className={styles.c_td_box_image}>
                                                    <div className={styles.sc_container_box_song}>
                                                        <div className={styles.sc_c_img}  onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                                            <img src={item.image} alt=""/>
                                                            <div className={`${styles.sc_c_img_bg} ${styles.hidden}`}>
                                                                <img src="/play.png" className={styles.play_icon}/>
                                                            </div>
                                                        </div>
                                                        <div className={styles.sc_c_des}>
                                                            <div className={styles.sc_c_des_name}  onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
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
                    <div className={`${styles.c_content_tab_mv} ${tab == 2 ? "" : "hidden"}`}>
                        <img src="/empty.png" alt=""/>
                        <div className={styles.c_text_empty}>
                            Chưa có MV nào trong thư viện
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;