import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Image_slide from './Image_slide';
import Singer_slide from './Singer_slide';
import Loading from '../Loading/Loading';
import Modal_action_song from '../Modal/Modal_action_song';
import { FaCompactDisc, FaEllipsisH, FaChevronCircleLeft, FaChevronRight, FaChevronCircleRight, FaHeart, FaPlayCircle, FaDownload} from 'react-icons/fa';
import axios from 'axios'
import '../global.js'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Home = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isShow, setShow] = useState(false);
    const [timeline, setTimeline] = useState(5);
    const counterRef = useRef(5);
    const [arrSongNew, setArrSongNew] = useState([]);
    const [arrPlaylist, setArrPlaylist] = useState([]);
    const [arrSongHot, setArrSongHot] = useState([]);
    const [arrSlide, setArrSlide] = useState([
        {id: 1, img: '/banner-template.jpg', url: '/playlist/3'},
        {id: 2, img: '/banner-template2.jpg', url: '/playlist/4'},
        {id: 3, img: '/banner-template3.jpg', url: '/playlist/5'},
        {id: 4, img: '/banner-template4.jpg', url: '/playlist/6'},
        {id: 5, img: '/banner-template5.jpg', url: '/playlist/7'},
    ]);
    const [arrSinger, setArrSinger] = useState([]);

    function checkTime(t) {
        if(t == 0) {
            nextSlideBanner(arrSlide);
            nextSlideSinger(arrSinger);
        }
    }
    function nextSlideBanner(value) {
        let arrTemp = value.shift();
        value.push(arrTemp);
        setArrSlide(value);
        setTimeline(5);
    }

    function nextSlideSinger (value) {
        let arrTemp = value.shift();
        value.push(arrTemp);
        setArrSinger(value);
        setTimeline(5);
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

    function showModalActionSong() {
        setShow(true);
    }

    function hiddenModalActionSong() {
        setShow(false);
    }

    function newPage() {
        navigate('/new');
    }

    function singerPage(id) {
        navigate('/singer/'+id);
    }

    function playlistPage(id) {
        navigate('/playlist/'+id);
    }

    function addLike(id) {
        if(!sessionStorage.getItem('id_user')) {
            withReactContent(Swal).fire({
                title: '<strong>Vui lòng đăng nhập để thực hiện chức năng này!</strong>',
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText:'Ok!'
            });
        }
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
                setArrSongHot(arrSongHot => arrSongHot.map((item, i) =>
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
                setArrSongHot(arrSongHot => arrSongHot.map((item, i) =>
                                item.id == res.data.id ? {...item, is_like: 0} : item
                            ));
            }
        });
    }
    // prevSlideBanner(value) {
    //     let arrTemp = value.pop();
    //     value.unshift(arrTemp);
    //     this.setState({
    //         arrSlide: value
    //     });
    //     this.setState({
    //         time: 5
    //     });
    // }
    React.useEffect(() => {
        counterRef.current = timeline;
    })

    React.useEffect(() => {
        checkTime(timeline);
    },[timeline])

    React.useEffect(() => {
        window.scrollTo(0, 0);
        const automaticInterval = window.setInterval(
            () => {
                setTimeline(counterRef.current - 1);
            },1000
        );

        axios({
            method: 'post',
            url: global.api + '/get_DataSong',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            let itemSongNew = [];
            for (var i = 0; i < res.data.dataSongNew.length; i++) {
                itemSongNew.push({
                    id: res.data.dataSongNew[i].id,
                    name: res.data.dataSongNew[i].name,
                    id_gg: res.data.dataSongNew[i].id_gg,
                    image: res.data.dataSongNew[i].image,
                    date_create: res.data.dataSongNew[i].date_create,
                    id_singer: res.data.dataSongNew[i].id_singer,
                    text_gr_singer: res.data.dataSongNew[i].text_gr_singer
                });
            }
            setArrSongNew(itemSongNew);

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

            let itemSongHot = [];
            for (var i = 0; i < res.data.dataSongHot.length; i++) {
                itemSongHot.push({
                    id: res.data.dataSongHot[i].id,
                    is_like: res.data.dataSongHot[i].is_like,
                    name: res.data.dataSongHot[i].name,
                    id_gg: res.data.dataSongHot[i].id_gg,
                    image: res.data.dataSongHot[i].image,
                    date_create: res.data.dataSongHot[i].date_create,
                    id_singer: res.data.dataSongHot[i].id_singer,
                    text_gr_singer: res.data.dataSongHot[i].text_gr_singer
                });
            }
            setArrSongHot(itemSongHot);

            let itemSingerHot = [];
            for (var i = 0; i < res.data.dataSinger_hot.length; i++) {
                itemSingerHot.push({
                    name: res.data.dataSinger_hot[i].name,
                    img: res.data.dataSinger_hot[i].img,
                    id: res.data.dataSinger_hot[i].id
                });
            }
            setArrSinger(itemSingerHot);

            setTimeout(function () {      
               setLoading(false);
            }, 2000);
        });

        return () => {
            window.clearInterval(automaticInterval);
        };
    }, []);

    return(
        <div className="mm_container">
            {loading ? <Loading></Loading> : ''}
            <div className={styles.mm_slide}>
                <div className={styles.mm_move_left}>
                    <FaChevronCircleLeft/>
                </div>
                <div className={styles.c_box_slide} id="slide_banner">
                    {arrSlide.map((item, index) => {
                        return (
                            <Image_slide key={item.id} src={item.img} isURL={item.url}></Image_slide>
                        );
                    })}
                </div>
                <div className={styles.mm_move_right} onClick={() => {nextSlideBanner(arrSlide)}}>
                    <FaChevronCircleRight/>
                </div>
            </div>
            <div className={`${styles.mm_new_song} ${styles.block}`}>
                <div className={styles.mm_title_list}>
                    <h4>Mới Phát Hành</h4>
                </div>
                <div className={`${styles.mm_block} ${styles.block} ${styles.inblock}`}>
                    <div className={`${styles.mm_category_block} ${styles.inblock}`}>
                        <div className={styles.mm_button_category}>
                            <h4>TẤT CẢ</h4>
                        </div>
                        <div className={styles.mm_button_category}>
                            <h4>VIỆT NAM</h4>
                        </div>
                        <div className={styles.mm_button_category}>
                            <h4>QUỐC TẾ</h4>
                        </div>
                    </div>
                    <div className={styles.mm_see_all} onClick={() => {newPage()}}>
                        <h4>TẤT CẢ</h4><FaChevronRight/>
                    </div>
                </div>
                <div className={styles.mm_container_box_song}>
                    {arrSongNew.map((item, index) => {
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
                                        <Modal_action_song checkShow={isShow} isID={item.id}></Modal_action_song>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.mm_list_random}>
                <div className={`${styles.sc_container_box_list} ${styles.inblock} ${styles.w100}`}>
                    <div className={`${styles.mm_title_list} ${styles.left}`}>
                        <h4>Playlist Thịnh Hành</h4>
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
            <div className={styles.mm_trend}>
                <div className={`${styles.sc_container_box_list} ${styles.inblock} ${styles.w100}`}>
                    <div className={`${styles.mm_title_list} ${styles.left}`}>
                        <h4>Bài Hát Thịnh Hành</h4>
                    </div>
                    <div className={styles.mm_see_all}>
                        <h4>TẤT CẢ</h4><FaChevronRight/>
                    </div>
                </div>
                <div className={styles.sc_container_box_list_song}>
                    {arrSongHot.map((item, index) => {
                        return (
                            <div key={index} className={styles.sc_box_list}>
                                <div className={styles.sc_container_img_list}>
                                    <img src={item.image} className={styles.c_img_list} alt=""/>
                                    <div className={styles.c_container_img}>
                                        <div className={styles.c_content_img}>
                                            <div
                                                className={`${styles.c_box_icon} ${item.is_like != 0 ? 'heart_active' : ''}`}
                                                onClick={item.is_like != 0 ? () => {delLike(item.id)} : () => {addLike(item.id)}}
                                            >
                                                <FaHeart/>
                                            </div>
                                            <div className={styles.c_icon_play} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
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
                                    {item.id_singer.map((item2, index2) => {
                                        return (
                                            <a key={index2} className="sc_text_link">{item2.name} <span className="nohover_singer">{item.id_singer.length > 1 && item.id_singer.length - 1 > index2 ? ' x ' : ''}</span></a>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={styles.mm_singer}>
                <div className={`${styles.sc_container_box_list} ${styles.inblock} ${styles.w100}`}>
                    <div className={`${styles.mm_title_list} ${styles.left}`}>
                        <h4>Nghệ sĩ nổi bật</h4>
                    </div>
                    <div className={styles.mm_see_all}>
                        <h4>TẤT CẢ</h4><FaChevronRight/>
                    </div>
                </div>
                <div className={styles.sc_singer_slide}>
                    <div className={styles.sc_container_box_singer}>
                        <div className={styles.mm_move_left}>
                            <FaChevronCircleLeft/>
                        </div>
                        <div className={styles.c_box_slide_singer}>
                            {arrSinger.map((item, index) => {
                                return (
                                    <Singer_slide key={item.id} src={item.img} idSinger={item.id}></Singer_slide>
                                );
                            })}
                        </div>
                        <div className={styles.mm_move_right} onClick={() => {nextSlideSinger(arrSinger)}}>
                            <FaChevronCircleRight/>
                        </div>
                    </div>
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

export default Home;