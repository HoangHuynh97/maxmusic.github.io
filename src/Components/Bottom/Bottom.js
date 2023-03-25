import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Bottom.module.css';
import { FaChevronCircleLeft, FaSpinner, FaRandom, FaBackward, FaPlay, FaPause, FaForward, FaRetweet, FaHeart, FaVolumeUp, FaVolumeMute, FaBars} from 'react-icons/fa';

import axios from 'axios'
import '../global.js'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Bottom = (props) => {
    const navigate = useNavigate();
    const audioRef = useRef();
    const [isTTUrl, setTTUrl] = useState('https://docs.google.com/uc?export=download&id=');
    const [isUrl, setUrl] = useState(sessionStorage.getItem("url_song") ? sessionStorage.getItem("url_song") : global.url_song);
    const [isNameSong, setNameSong] = useState(sessionStorage.getItem("name_song") ? sessionStorage.getItem("name_song") : global.name_song);
    const [isNameSinger, setNameSinger] = useState(sessionStorage.getItem("name_singer") ? sessionStorage.getItem("name_singer") : global.name_singer);
    const [isIMGSong, setIMGSong] = useState(sessionStorage.getItem("img_song") ? sessionStorage.getItem("img_song") : global.img_song);
    const [isPlay, setPlay] = useState(false);
    const [rangerTime, setRangerTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [timeSlide, setTimeSlide] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRamdom, setRamdom] = useState(false);
    const [isRetweet, setRetweet] = useState(false);
    const [isHeart, setHeart] = useState(false);
    const [isVolume, setIsVolume] = useState(100);
    const [isShowBar, setShowBar] = useState(false);
    const [isSpiner, setIsSpiner] = useState(true);
    const [arrSongRandom, setArrSongRandom] = useState([]);
    const [arrSong, setArrSong] = useState([]);
    const wrapperRef = useRef();
    const [isMobile, setIsMobile] = useState(false);
    
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

    var widthClient = document.documentElement.clientWidth;

    React.useEffect(() => {
        setUrl(isTTUrl+isUrl);

        axios({
            method: 'post',
            url: global.api + '/get_ramdom_song',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            let itemSongHot = [];
            for (var i = 0; i < res.data.dataSongNew.length; i++) {
                itemSongHot.push({
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
            setArrSongRandom(itemSongHot);
        });

        window.addEventListener('click', (e) => {showBottomMobile(e)});
        return () => {
            window.removeEventListener('click', (e) => {showBottomMobile(e)})
        }
    }, []);

    function showBottomMobile(e) {
        if (wrapperRef.current.contains(e.target)) {
            if(widthClient < 480) {
                setIsMobile(true);
            }
        }
    }

    window.addEventListener('storage', () => {
        setIsSpiner(true);
        setUrl(isTTUrl+sessionStorage.getItem("url_song"));
        setNameSong(sessionStorage.getItem("name_song"));
        setNameSinger(sessionStorage.getItem("name_singer"));
        setIMGSong(sessionStorage.getItem("img_song"));
        audioRef.current.load();

        axios({
            method: 'post',
            url: global.api + '/check_like',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                url: sessionStorage.getItem("url_song"),
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            if(res.data.message == 'success') {
                setHeart(true);
            } else {
                setHeart(false);
            }
        });

        axios({
            method: 'post',
            url: global.api + '/get_song_by_url',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                url: sessionStorage.getItem("url_song"),
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            let itemSongHot = [];
            for (var i = 0; i < res.data.dataSongNew.length; i++) {
                itemSongHot.push({
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
            setArrSong([...arrSong, ...itemSongHot]);
        });

        handlePausePlayClick(true);
    })

    function addLike_byURL() {
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
            url: global.api + '/add_like_byURL',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                url: sessionStorage.getItem("url_song"),
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            if(res.data.message == 'success') {
                setHeart(true);
            }
        });
    }
    function delLike_byURL() {
        axios({
            method: 'post',
            url: global.api + '/del_like_byURL',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                url: sessionStorage.getItem("url_song"),
                id_user: sessionStorage.getItem('id_user')
            }
        }).then(res => {
            if(res.data.message == 'success') {
                setHeart(false);
            }
        });
    }

    function singerPage(id) {
        navigate('/singer/'+id);
    }
    // React.useEffect(() => {
    //     setUrl(isTTUrl+global.url_song);
    //     setNameSong(global.name_song);
    //     setNameSinger(global.name_singer);
    //     setIMGSong(global.img_song);
    //     audioRef.current.load();
    // },[global.url_song])

    function handlePausePlayClick(boolx) {
        if(boolx === false) {
            setDuration(Math.round(audioRef.current.duration));
            if (isPlay) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setPlay(!isPlay);
        } else {
            setDuration(Math.round(audioRef.current.duration));
            setPlay(true);
            setTimeout(function () {      
               audioRef.current.play();
            }, 500);
        }
    };

    function isCanPlay() {
        setIsSpiner(false);
    }

    function handleLoadedData() {
        setIsSpiner(true);
        const hours = Math.floor(audioRef.current.duration / 3600);
        setHours(hours);
        
        const time = audioRef.current.duration - hours * 3600;
        const minutes = Math.floor(time / 60);

        setMinutes(minutes);

        const seconds = Math.round(time - minutes * 60);
        setSeconds(seconds);
        
        setDuration(Math.round(audioRef.current.duration));
        if (isPlay) audioRef.current.play();
    }

    function handleCurrentTime() {
        const xtime = audioRef.current.currentTime;
        const xhours = Math.floor(xtime / 3600);
        const timeline = xtime - xhours * 3600;
        const xminutes = Math.floor(timeline / 60);
        const xseconds = Math.round(timeline - xminutes * 60);
        
        let strH = "";
        if(xhours != 0) {
            if(xhours < 10) {
                strH = "0"+xhours+":";
            } else {
                strH = xhours+":";
            }
        }

        let strM = "00:";
        if(xminutes != 0) {
            if(xminutes < 10) {
                strM = "0"+xminutes+":";
            } else {
                strM = xminutes+":";
            }
        }

        let strS = "00";
        if(xseconds != 0) {
            if(xseconds < 10) {
                strS = "0"+xseconds;
            } else {
                strS = xseconds;
            }
        }

        const strTime = strH+strM+strS;
        setCurrentTime(strTime);
        handleChangeTimeLine();
    }

    function handleChangeTimeLine() {
        setTimeSlide(Math.round(audioRef.current.currentTime));
    }

    function changeVolume(e) {
        const val = e.target.value;
        setIsVolume(val);

        audioRef.current.volume = isVolume/100;
    }

    return (
        <div className={styles.container_bottom}>
            <div className={`${styles.hidden_mobile} ${isMobile ? styles.active : ''}`}>
                <div className={styles.icon_hidden_mobile} onClick={() => {setIsMobile(!isMobile)}}>
                    <FaChevronCircleLeft/>
                </div>
            </div>
            <div
                className={`${styles.mm_container_bot} ${isMobile ? styles.active_mobile : ''}`}
                ref={wrapperRef}>
                <div className={styles.sc_container_left}>
                    <div className={`${styles.c_img_song} ${isPlay ? styles.active : ""}`}>
                        <img id="img_song" src={isIMGSong} alt=""/>
                    </div>
                    <div className={styles.c_content_song}>
                        <div className={styles.c_title_song}>
                            <span id="name_song">
                                {isNameSong}
                            </span>
                        </div>
                        <div className={styles.c_title_singer}>
                            <span id="name_singer">
                                {isNameSinger}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={styles.sc_container_center}>
                    <div className={styles.sc_action_music}>
                        <div className={`${styles.c_i_action_m} ${isRamdom ? styles.active_ramdom : ''}`} onClick={() => {setRamdom(!isRamdom)}}>
                            <FaRandom/>
                        </div>
                        <div className={styles.c_i_action_m}>
                            <FaBackward/>
                        </div>
                        <div className={`${styles.c_i_action_m} ${styles.play}`} onClick={() => handlePausePlayClick(false)}>
                            {isSpiner ? <FaSpinner/> : !isPlay ? <FaPlay/> : <FaPause/>}
                        </div>
                        <div className={styles.c_i_action_m}>
                            <FaForward/>
                        </div>
                        <div className={`${styles.c_i_action_m} ${isRetweet ? styles.active_retweet : ''}`} onClick={() => {setRetweet(!isRetweet)}}>
                            <FaRetweet/>
                        </div>
                    </div>
                    <div className={styles.sc_time_m}>
                        <div className={styles.sc_curent_time} id="set_time">
                            <span>{currentTime == 0 ? "00:00" : currentTime}</span>
                        </div>
                        <input id="point_timeline" className={styles.sc_time_line} type="range" min={0} max={duration} value={timeSlide} onChange={() => handleChangeTimeLine()}/>
                        <div className={styles.sc_end_time}>
                            <span>{hours == 0 ? "" : hours < 10 ? "0"+hours+":" : hours+":"}{minutes == 0 ? "" : minutes < 10 ? "0"+minutes+":" : minutes+":"}{seconds == 0 ? "" : seconds < 10 ? "0"+seconds : seconds}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.you_like}>Có thể bạn sẽ thích</div>
                <div className={styles.sc_container_right}>
                    <div
                        className={`${styles.c_icon_action} ${isHeart ? 'heart_active' : ''}`}
                        onClick={isHeart ? () => {delLike_byURL()} : () => {addLike_byURL()}}
                    >
                        <FaHeart/>
                    </div>
                    <div className={styles.c_icon_action}>
                        <span>mv</span>
                    </div>
                    <div className={styles.c_icon_action}>
                        {isVolume != 0 ? <FaVolumeUp/> : <FaVolumeMute/>}
                    </div>
                    <div className={styles.c_volume_setting} id="volume">
                        <input
                            className={styles.sc_point_volume}
                            type="range"
                            min={0}
                            max={100}
                            value={isVolume}
                            onChange={(e) => {changeVolume(e)}}
                        />
                    </div>
                    <div className={styles.line_sp}></div>
                    <div className={`${styles.c_icon_action} ${styles.action_bar}`}>
                        <div className={styles.bar_menu} onClick={() => {setShowBar(!isShowBar)}}>
                            <FaBars/>
                        </div>
                        <div className={`${styles.container_action_bar} ${isShowBar ? styles.active : ''}`}>
                            <div className={styles.text_line}>Danh sách hiện tại</div>
                            
                            {arrSong.map((item, index) => {
                                return (
                                    <div key={index} className={styles.content_action_bar}>
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
                                            <div className={styles.sc_c_action_song}>
                                                <div
                                                    className={`${styles.icon_action_song} ${item.is_like != 0 ? 'heart_active' : ''}`}
                                                >
                                                    <FaHeart/>
                                                </div>
                                                <div className={styles.icon_action_song} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                                    <FaPlay/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            
                            <div className={styles.text_line}>Có thể bạn sẽ thích</div>
                            
                            {arrSongRandom.map((item, index) => {
                                return (
                                    <div key={index} className={styles.content_action_bar}>
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
                                            <div className={styles.sc_c_action_song}>
                                                <div
                                                    className={`${styles.icon_action_song} ${item.is_like != 0 ? 'heart_active' : ''}`}
                                                >
                                                    <FaHeart/>
                                                </div>
                                                <div className={styles.icon_action_song} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                                    <FaPlay/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            
                        </div>
                    </div>
                </div>
                <audio
                    loop={isRetweet ? 'loop' : ''}
                    ref={audioRef}
                    onCanPlay={() => isCanPlay()}
                    onLoadedData={() => handleLoadedData()}
                    onTimeUpdate={() => handleCurrentTime()}
                    src={isUrl}
                />
            </div>
        </div>
    );
};

export default Bottom;