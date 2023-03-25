import React, {useState} from 'react';
import styles from './Menu.module.css';
import Home from '../Home/Home';
import Profile from '../Profile/Profile';
import New from '../New/New';
import Comming from '../Comming/Comming';
import Playlist from '../Playlist/Playlist';
import Singer from '../Singer/Singer';
import Login from '../Login/Login';
import Modal from 'react-modal';

import { FaBars, FaStar, FaHeadphones, FaMusic, FaIcons, FaChartLine, FaPlayCircle, FaPodcast, FaPlus} from 'react-icons/fa';
import {BrowserRouter, Routes, Route, Link, NavLink, useParams} from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import axios from 'axios'
import '../global.js'

const Menu = (props) => {
    const params = useParams();
    const [menuMobile, setMenuMobile] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [inputNamePlaylist, setInputNamePlaylist] = useState('');
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
            setIsOpen(true);
        }
    }

    function closeModal() {
        setIsOpen(false);
    }

    function changeInputName(e) {
        const val = e.target.value;
        setInputNamePlaylist(val);
    }

    function savePlaylist() {
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
                url: global.api + '/add_playlist',
                headers: {'Content-Type': 'application/json'}, 
                data: {
                    name: inputNamePlaylist,
                    id_user_create: sessionStorage.getItem("id_user")
                }
            }).then(res => {
                if(res.data.message == 'success') {
                    withReactContent(Swal).fire({
                        title: '<strong>Thêm danh sách phát thành công!</strong>',
                        icon: 'success',
                        showCloseButton: true,
                        focusConfirm: false,
                        confirmButtonText:'Ok!'
                    });
                } else {
                    withReactContent(Swal).fire({
                        title: '<strong>Hệ thống lỗi, xin thử lại sau!</strong>',
                        icon: 'error',
                        showCloseButton: true,
                        focusConfirm: false,
                        confirmButtonText:'Ok!'
                    });
                }
            });
        }
    }

    return (
        <div>
            <div className={styles.mm_show_menu_mobile} onClick={() => setMenuMobile(!menuMobile)}>
                <FaBars/>
            </div>
            <div className={`${styles.mm_container_menu} ${menuMobile ? styles.active : ''}`}>
                <div className={styles.sc_menu}>
                    <div className={styles.sc_menu_logo}>
                        <img src="/logo.png" alt=""/>
                    </div>
                    <div className={styles.sc_menu_content}>
                        <NavLink 
                            to="/"
                            className={styles.sc_box_menu}
                            style={({ isActive, isPending }) => {
                                return {
                                    background: isActive ? "#ebacff1f" : "",
                                    borderLeft: isActive ? "2px solid #d300ff" : "",
                                };
                            }}
                        >
                            <div className={styles.c_icon_menu}>
                                <FaStar/>
                            </div>
                            <div className={styles.c_title_menu}>
                                <span>Khám phá</span>
                            </div>
                        </NavLink>
                        <NavLink 
                            to="/profile"
                            className={styles.sc_box_menu}
                            style={({ isActive, isPending }) => {
                                return {
                                    background: isActive ? "#ebacff1f" : "",
                                    borderLeft: isActive ? "2px solid #d300ff" : "",
                                };
                            }}
                        >
                            <div className={styles.c_icon_menu}>
                                <FaHeadphones/>
                            </div>
                            <div className={styles.c_title_menu}>
                                <span>Cá nhân</span>
                            </div>
                        </NavLink>
                        <NavLink 
                            to="/new"
                            className={styles.sc_box_menu}
                            style={({ isActive, isPending }) => {
                                return {
                                    background: isActive ? "#ebacff1f" : "",
                                    borderLeft: isActive ? "2px solid #d300ff" : "",
                                };
                            }}
                        >
                            <div className={styles.c_icon_menu}>
                                <FaMusic/>
                            </div>
                            <div className={styles.c_title_menu}>
                                <span>Nhạc mới</span>
                            </div>
                        </NavLink>
                    </div>
                    <div className={styles.sc_menu_sub_content}>
                        <NavLink 
                            to="/category"
                            className={styles.sc_box_menu}
                            style={({ isActive, isPending }) => {
                                return {
                                    background: isActive ? "#ebacff1f" : "",
                                    borderLeft: isActive ? "2px solid #d300ff" : "",
                                };
                            }}
                        >
                            <div className={styles.c_icon_menu}>
                                <FaIcons/>
                            </div>
                            <div className={styles.c_title_menu}>
                                <span>Thể loại</span>
                            </div>
                        </NavLink>
                        <NavLink 
                            to="/maxchart"
                            className={styles.sc_box_menu}
                            style={({ isActive, isPending }) => {
                                return {
                                    background: isActive ? "#ebacff1f" : "",
                                    borderLeft: isActive ? "2px solid #d300ff" : "",
                                };
                            }}
                        >
                            <div className={styles.c_icon_menu}>
                                <FaChartLine/>
                            </div>
                            <div className={styles.c_title_menu}>
                                <span>#maxchart</span>
                            </div>
                        </NavLink>
                        <NavLink 
                            to="/mv"
                            className={styles.sc_box_menu}
                            style={({ isActive, isPending }) => {
                                return {
                                    background: isActive ? "#ebacff1f" : "",
                                    borderLeft: isActive ? "2px solid #d300ff" : "",
                                };
                            }}
                        >
                            <div className={styles.c_icon_menu}>
                                <FaPlayCircle/>
                            </div>
                            <div className={styles.c_title_menu}>
                                <span>MV</span>
                            </div>
                        </NavLink>
                        <NavLink 
                            to="/sub"
                            className={styles.sc_box_menu}
                            style={({ isActive, isPending }) => {
                                return {
                                    background: isActive ? "#ebacff1f" : "",
                                    borderLeft: isActive ? "2px solid #d300ff" : "",
                                };
                            }}
                        >
                            <div className={styles.c_icon_menu}>
                                <FaPodcast/>
                            </div>
                            <div className={styles.c_title_menu}>
                                <span>Theo dõi</span>
                            </div>
                        </NavLink>
                    </div>
                    <div className={styles.sc_button_menu} onClick={() => {openModal()}}>
                        <div className={styles.c_icon_menu}>
                            <FaPlus/>
                        </div>
                        <div className={styles.c_title_menu}>
                            <span>Tạo playlist mới</span>
                        </div>
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
                            <span>THÊM DANH SÁCH PHÁT</span>
                        </div>
                        <div className="modal-body">
                            <div className="box-input">
                                <label>Tên danh sách phát</label>
                                <input type="text" onChange={(e) => changeInputName(e)}/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="btn-submit" onClick={() => savePlaylist()}>Lưu lại</div>
                            <div className="btn-close" onClick={() => closeModal()}>Đóng</div>
                        </div>
                    </Modal>
                </div>
            </div>
                
            <Routes>
                <Route path='/' exact element={<Home/>} />
                <Route path='/profile' element={<Profile/>} />
                <Route path='/new' element={<New/>} />
                <Route path='/category' element={<Comming/>} />
                <Route path='/maxchart' element={<Comming/>} />
                <Route path='/mv' element={<Comming/>} />
                <Route path='/sub' element={<Comming/>} />
                <Route path='/playlist/:id_playlist' element={<Playlist/>} />
                <Route path='/singer/:id' element={<Singer/>} />
                <Route path='/login' element={<Login/>} />
            </Routes>
        </div>
    );
};

export default Menu;