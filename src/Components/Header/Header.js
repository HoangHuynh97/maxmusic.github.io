import React, {useState, useRef} from 'react';
import styles from './Header.module.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FaRegCircle, FaUpload, FaMagic, FaWrench, FaUser} from 'react-icons/fa';
import axios from 'axios'
import '../global.js'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Header = (props) => {
    const [activeInput, setActiveInput] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [inputNameSong, setInputNameSong] = useState('');
    const [inputNameSinger, setInputNameSinger] = useState('');
    const [inputIDgg, setInputIDgg] = useState('');
    const [arrSongSearch, setArrSongSearch] = useState([]);
    const [arrSongMainSearch, setArrSongMainSearch] = useState([]);
    const [arrSingerSearch, setArrSingerSearch] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const wrapperRef = useRef();
    

    const navigate = useNavigate();
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            width: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(45deg, #c859ff 0%, #ffab8c 100%)',
        },
    };

    function changeInputSong(e) {
        const val = e.target.value;
        setInputNameSong(val);
    }
    function changeInputSinger(e) {
        const val = e.target.value;
        setInputNameSinger(val);
    }
    function changeInputgg(e) {
        const val = e.target.value;
        setInputIDgg(val);
    }

    function saveSong() {
        axios({
            method: 'post',
            url: global.api + '/upload_song',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                song: inputNameSong,
                singer: inputNameSinger,
                gg: inputIDgg,
            }
        }).then(res => {
            // if(res.data.message == 'success') {
            //     alert('success');
            // } else {
            //     alert('fail');
            // }
        });
    }

    function openModal() {
        if(!sessionStorage.getItem("name_user")) {
            withReactContent(Swal).fire({
                title: '<strong>Vui lòng đăng nhập để thực hiện chức năng này!</strong>',
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText:'Ok!'
            });
            return 0;
        } else if(sessionStorage.getItem("name_user") != 'Admin Hoàng') {
            withReactContent(Swal).fire({
                title: '<strong>Phân quyền Admin!</strong>',
                html: 'Tha em, hosting free thôi!!!!!!!!!!',
                icon: 'warning',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText:'Ok!'
            });
            return 0;
        } else {
            setIsOpen(true);
        }
    }

    function closeModal() {
        setIsOpen(false);
    }

    function onFocusInput() {
        setActiveInput(true);
    }
    function outFocusInput() {
        // setActiveInput(false);
    }

    function handleClickOutSide(e) {
        const { target } = e;
        if (!wrapperRef.current.contains(target)) {
            setActiveInput(false);
        }
    }

    function searchResult(evt) {
        const val = evt.target.value;
        if(val != '') {
            setIsSearch(true);
            axios({
                method: 'post',
                url: global.api + '/search_song',
                headers: {'Content-Type': 'application/json'}, 
                data: {
                    key_search: val,
                }
            }).then(res => {
                if(res.data.length == 0) {
                    let tempEmpty = [];
                    setIsSearch(false);
                    setArrSongSearch(tempEmpty);
                    setArrSongMainSearch(tempEmpty);
                } else {
                    let itemSongSearch = [];
                    for (var i = 0; i < res.data.dataSongSearch.length; i++) {
                        itemSongSearch.push({
                            name: res.data.dataSongSearch[i].name,
                            id_gg: res.data.dataSongSearch[i].id_gg,
                            image: res.data.dataSongSearch[i].image,
                            date_create: res.data.dataSongSearch[i].date_create,
                            id_singer: res.data.dataSongSearch[i].id_singer,
                            text_gr_singer: res.data.dataSongSearch[i].text_gr_singer
                        });
                    }
                    setArrSongSearch(itemSongSearch);

                    let itemSingerSearch = [];
                    for (var i = 0; i < res.data.dataSingerSearch.length; i++) {
                        itemSingerSearch.push({
                            name: res.data.dataSingerSearch[i].name,
                            id: res.data.dataSingerSearch[i].id
                        });
                    }
                    setArrSingerSearch(itemSingerSearch);

                    let itemSongMainSearch = [];
                    for (var i = 0; i < res.data.dataSongMainSearch.length; i++) {
                        itemSongMainSearch.push({
                            name: res.data.dataSongMainSearch[i].name,
                            id_gg: res.data.dataSongMainSearch[i].id_gg,
                            image: res.data.dataSongMainSearch[i].image,
                            date_create: res.data.dataSongMainSearch[i].date_create,
                            id_singer: res.data.dataSongMainSearch[i].id_singer,
                            text_gr_singer: res.data.dataSongMainSearch[i].text_gr_singer
                        });
                    }
                    setArrSongMainSearch(itemSongMainSearch);
                }
            });
        } else {
            let tempEmpty = [];
            setIsSearch(false);
            setArrSongSearch(tempEmpty);
            setArrSongMainSearch(tempEmpty);
        }
    }


    function playSongByID(id_gg, singer, nameSong, imgSong) {
        setActiveInput(false);
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

    function singerPage(id) {
        setActiveInput(false);
        navigate('/singer/'+id);
    }

    function logout() {
        sessionStorage.removeItem("id_user");
        sessionStorage.removeItem("name_user");
        navigate('/');
    }

    function login() {
        navigate('login');
    }
    React.useEffect(() => {
        window.addEventListener('click', (e) => {handleClickOutSide(e)});
        return () => {
            window.removeEventListener('click', (e) => {handleClickOutSide(e)})
        }
    });

    return (
        <div className={styles.mm_container_top}>
            <div className={styles.sc_container_search} ref={wrapperRef}>
                <div className={`${styles.sc_content_search} ${activeInput ? styles.active : ""}`}>
                    <div className={styles.b_search_icon}>
                        <FaRegCircle/>
                    </div>
                    <input
                        onChange={(evt) => {searchResult(evt)}}
                        onFocus={onFocusInput}
                        onBlur={outFocusInput}
                        type="text"
                        className={styles.sc_search_input}
                        placeholder="Tìm kiếm bài hát, nghệ sĩ..."
                    />
                </div>
                <div className={`${styles.sc_result_search} ${activeInput ? styles.active : ""}`}>
                    <div className={styles.sc_content_result_search}>
                        <div className={styles.sc_result_key}>
                            <div className={styles.sc_title_result_key}>
                                <span>Từ khóa liên quan</span>
                            </div>
                            {isSearch ? '' : <div className={styles.sc_box_result_key}>
                                                <div className={styles.sm_search_icon}>
                                                    <FaRegCircle/>
                                                </div>
                                                <div className={styles.sc_text_result_key}>
                                                    <span>Chưa có dữ liệu!</span>
                                                </div>
                                            </div>
                            }
                            {arrSongSearch.map((item, index) => {
                                return (
                                    <div key={index} className={`${styles.sc_box_result_key} ${isSearch ? '' : 'hidden'}`} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                        <div className={styles.sm_search_icon}>
                                            <FaRegCircle/>
                                        </div>
                                        <div className={styles.sc_text_result_key}>
                                            <span>{item.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {arrSingerSearch.map((item, index) => {
                                return (
                                    <div key={index} className={`${styles.sc_box_result_key} ${isSearch ? '' : 'hidden'}`} onClick={() => {singerPage(item.id)}}>
                                        <div className={styles.sm_search_icon}>
                                            <FaRegCircle/>
                                        </div>
                                        <div className={styles.sc_text_result_key}>
                                            <span>{item.name}</span>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                        <div className={styles.line}></div>
                        <div className={styles.sc_result_song}>
                            <div className={styles.sc_title_result_key}>
                                <span>Gợi ý kết quả</span>
                            </div>
                            <div className={styles.sc_box_result_song}>
                                {isSearch ? '' : <div className={styles.sc_box_result_key}>
                                                    <div className={styles.sm_search_icon}>
                                                        <FaRegCircle/>
                                                    </div>
                                                    <div className={styles.sc_text_result_key}>
                                                        <span>Chưa có dữ liệu!</span>
                                                    </div>
                                                </div>
                                }
                                {arrSongMainSearch.map((item, index) => {
                                    return (
                                        <div key={index} className={`${styles.sc_container_box_song} ${styles.search_top}`} onClick={() => {playSongByID(item.id_gg, item.text_gr_singer, item.name, item.image)}}>
                                            <div className={styles.sc_c_img}>
                                                <img src={item.image} alt=""/>
                                                <div className={`${styles.sc_c_img_bg} ${styles.hidden}`}>
                                                    <img src="/play.png" className={styles.play_icon}/>
                                                </div>
                                            </div>
                                            <div className={styles.sc_c_des}>
                                                <div className={styles.sc_c_des_name}>
                                                    <h5>{item.name}</h5>
                                                </div>
                                                <div className={styles.sc_c_des_singer}>
                                                    <h5>{item.text_gr_singer}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.sc_container_action}>
                <div className={styles.sc_box_upload} onClick={() => openModal()}>
                    <FaUpload/>
                    <span>Cập nhật ca khúc mới</span>
                </div>
                <div className={styles.sc_box_icon} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Chủ đề">
                    <FaMagic/>
                </div>
                <div className={styles.sc_box_icon} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Cài đặt">
                    <FaWrench/>
                </div>
                <div onClick={sessionStorage.getItem("name_user") ? () => logout() : () => login()} className={`${styles.sc_box_icon} ${styles.b_light}`} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Người dùng">
                    {sessionStorage.getItem("name_user") ? sessionStorage.getItem("name_user").charAt(0) : <FaUser/>}
                </div>
            </div>

            <div className="modal">
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                >
                    <div className="modal-header">
                        <span>CẬP NHẬT CA KHÚC MỚI</span>
                    </div>
                    <div className="modal-body">
                        <div className="box-input">
                            <label>Tên bài hát</label>
                            <input type="text" onChange={(e) => changeInputSong(e)}/>
                        </div>
                        <div className="box-input">
                            <label>Ca sĩ thể hiện</label>
                            <input type="text" onChange={(e) => changeInputSinger(e)}/>
                        </div>
                        <div className="box-input">
                            <label>ID Google Driver</label>
                            <input type="text" onChange={(e) => changeInputgg(e)}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="btn-submit" onClick={() => saveSong()}>Lưu lại</div>
                        <div className="btn-close" onClick={() => closeModal()}>Đóng</div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Header;