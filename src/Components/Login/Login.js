import React from 'react';
import './Login.css';
import { FaStar, FaGoogle, FaFacebookF, FaIcons, FaLock, FaPlayCircle, FaUser, FaPlus} from 'react-icons/fa';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import '../global.js'

class Login extends React.Component {

    state = {
        isLogin: false,
        inputUser: "",
        inputPw: "",
    };

    updateInputUser(evt) {
        const val = evt.target.value;
        this.setState({
          inputUser: val
        });
    }

    updateInputPw(evt) {
        const val = evt.target.value;
        this.setState({
          inputPw: val
        });
    }

    login() {
        axios({
            method: 'post',
            url: global.api + '/api_login',
            headers: {'Content-Type': 'application/json'}, 
            data: {
                inputUser: this.state.inputUser,
                inputPw: this.state.inputPw,
            }
        }).then(res => {
            if(res.data.message == 'fail') {
                withReactContent(Swal).fire({
                    title: '<strong>Vui lòng kiểm tra lại Username/Password</strong>',
                    icon: 'error',
                    html:'Bạn có thể dùng thử tài khoản: test-test',
                    showCloseButton: true,
                    focusConfirm: false,
                    confirmButtonText:'Ok!',
                    confirmButtonAriaLabel: 'Thumbs up, great!'
                })
            } else {
                sessionStorage.setItem("id_user", res.data.id_user);
                sessionStorage.setItem("name_user", res.data.name_user);
                window.location.replace(global.homepage);
            }
        });   
    }

    handleKeyDown = (event) => {
        if(event.key === 'Enter') {
            this.login();
        }
    };

    render() {
        const MySwal = withReactContent(Swal);

        function getTestUser() {
            MySwal.fire({
                title: '<strong>TÀI KHOẢN DÙNG THỬ</strong>',
                icon: 'info',
                html:'Username: test || Pass: test',
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText:'<i class="fa fa-thumbs-up"></i> Great!',
                confirmButtonAriaLabel: 'Thumbs up, great!',
                cancelButtonAriaLabel: 'Thumbs down'
            })
        }

        return(
            <div className="m-container-login">
                <div className="sc-box-bg"></div>
                <div className="sc-box-bg"></div>
                <div className="sc-box-bg"></div>
                <div className="sc-container-form">
                    <div className="sc-title-form">
                        <span>Login</span>
                    </div>
                    <div className="sc-text-form">
                        <span>Username</span>
                    </div>
                    <div className="sc-content-input">
                        <FaUser/>
                        <input type="text" className="sc-login-input" placeholder="Username" value={this.state.inputUser} onChange={evt => this.updateInputUser(evt)} onKeyDown={evt => this.handleKeyDown(evt)}/>
                    </div>
                    <div className="sc-text-form">
                        <span>Password</span>
                    </div>
                    <div className="sc-content-input">
                        <FaLock/>
                        <input type="password" className="sc-login-input" placeholder="Password" value={this.state.inputPw} onChange={evt => this.updateInputPw(evt)} onKeyDown={evt => this.handleKeyDown(evt)}/>
                    </div>
                    <div className="sc-forgot-password">
                        <span>Forgot password?</span>
                    </div>
                    <div className="sc-btn-login" onClick={() => this.login()}>
                        <span>Login</span>
                    </div>
                    <div className="sc-login-more">
                        <span>Or Sign Up Using</span>
                    </div>
                    <div className="sc-box-brands">
                        <div className="sc-icon-brands" onClick={() => getTestUser()}>
                            <FaFacebookF/>
                        </div>
                        <div className="sc-icon-brands" onClick={() => getTestUser()}>
                            <FaGoogle/>
                        </div>
                    </div>
                    <div className="sc-login-more">
                        <span>Or Sign Up Using</span>
                    </div>
                    <div className="sc-sign-up" onClick={() => getTestUser()}>
                        <span>SIGN UP >>></span>
                    </div>
                </div>
            </div>
        );
    }
};

export default Login;