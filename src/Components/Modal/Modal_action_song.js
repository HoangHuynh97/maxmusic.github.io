import React, {useState, useRef} from 'react';
import styles from './Modal_action_song.module.css';
import Modal from 'react-modal';
import { FaCompactDisc, FaEllipsisH, FaChevronCircleLeft, FaChevronRight, FaChevronCircleRight, FaHeart, FaPlayCircle, FaDownload} from 'react-icons/fa';
import axios from 'axios'
import '../global.js'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Modal_action_song = (props) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [inputIDPlaylist, setInputIDPlaylist] = useState('');
    const [arrPlaylist, setArrPlaylist] = useState([]);
    
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
        } else {
            axios({
                method: 'post',
                url: global.api + '/get_playlist_id',
                headers: {'Content-Type': 'application/json'}, 
                data: {
                    id_user: sessionStorage.getItem('id_user')
                }
            }).then(res => {
                let itemPlaylist = [];
                for (var i = 0; i < res.data.dataSongNew.length; i++) {
                    itemPlaylist.push({
                        id: res.data.dataSongNew[i].id,
                        name: res.data.dataSongNew[i].name
                    });
                }
                setArrPlaylist(itemPlaylist);
            });
            setIsOpen(true);
        }
    }

    function closeModal() {
        setIsOpen(false);
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
                withReactContent(Swal).fire({
                    title: '<strong>Bài hát đã được đưa vào danh sách yêu thích!</strong>',
                    icon: 'success',
                    showCloseButton: true,
                    focusConfirm: false,
                    confirmButtonText:'Ok!'
                });
            }
        });
    }

    function changeInput(e) {
        const val = e.target.value;
        setInputIDPlaylist(val);
    }

    function savePlaylist() {
        axios({
            method: 'post',
            url: global.api + '/add_song_playlist',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                id_song: props.isID,
                id_playlist: inputIDPlaylist
            }
        }).then(res => {
            if(res.data.message == 'success') {
                withReactContent(Swal).fire({
                    title: '<strong>Bài hát đã được đưa vào danh sách phát!</strong>',
                    icon: 'success',
                    showCloseButton: true,
                    focusConfirm: false,
                    confirmButtonText:'Ok!'
                });
            }
        });
    }

    return(
        <div className={`${styles.c_modal_action} ${styles.left} ${props.checkShow ? 'open' : ''}`}>
            <div className={styles.c_modal_menu_action} onClick={() => {openModal()}}>
                <div className={styles.c_modal_menu_icon}>
                    <FaCompactDisc/>
                </div>
                <div className={styles.c_modal_menu_title}>
                    Thêm vào danh sách phát
                </div>
            </div>
            <div className={styles.c_modal_menu_action} onClick={() => {addLike(props.isID)}}>
                <div className={styles.c_modal_menu_icon}>
                    <FaHeart/>
                </div>
                <div className={styles.c_modal_menu_title}>
                    Yêu thích
                </div>
            </div>
            <div className={styles.c_modal_menu_action}>
                <div className={styles.c_modal_menu_icon}>
                    <FaDownload/>
                </div>
                <div className={styles.c_modal_menu_title}>
                    Tải Xuống
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
                        <span>THÊM BÀI HÁT VÀO PLAYLIST</span>
                    </div>
                    <div className="modal-body">
                        <div className="box-input">
                            <label>Playlist đã tạo</label>
                            <select onChange={(e) => changeInput(e)}>
                                <option value="dont_check" selected></option>
                                {arrPlaylist.map((item, index) => {
                                    return (
                                        <option value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="btn-submit" onClick={() => savePlaylist()}>Lưu lại</div>
                        <div className="btn-close" onClick={() => closeModal()}>Đóng</div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Modal_action_song;