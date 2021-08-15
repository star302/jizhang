import React from 'react';
import {post} from "../../utils/request";
import history from "../../utils/history";
import "./Login.css"

export default class Login extends React.Component{
    constructor() {
        super();
        this.state = {
            account: "",
            login: false,
        }
    }
    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    onChangeAccount = (e) => {
        let value = e.target.value;
        const reg = /^\d*?$/;
        if ((reg.test(value) && value.length < 20) || value === '') {
            this.setState({
                account: value
            })
        }
    }
    onSubmit = (e) => {
        this.setState({login: true});
        let data = {
            account: this.state.account,
            password: this.state.password
        }
        post("login", data).then((res) => {
            console.log(res.data)
            if(res.data.code === 200){
                history.push({
                    pathname: "home",
                });
                localStorage.setItem("account", this.state.account);
            }else{
                alert("账号或密码错误！");
            }
        }).catch((err) => {
            alert(err);
        }).finally(() =>{
            this.setState({
                login: false
            })
        })
        // alert("登录成功")
        e.preventDefault();
    }

    onClick = (e) => {
    }
    render() {
        return(
            <div className="login-container">
                <div className="title">
                    <p>登录/注册</p>
                </div>
                <form className="login-form-container" onSubmit={this.onSubmit}>
                    <div className="login-form-input-container">
                        <label className="login-form-input-item login-form-input-account">
                            <svg className="icon svg-account" aria-hidden="true">
                                <use xlinkHref="#icon-account" />
                            </svg>
                            <input className="login-form-input" name="account" value={this.state.account} required placeholder="请输入账号(6-20个字符)" minLength={6} onChange={this.onChangeAccount}/>
                        </label>
                        <label className="login-form-input-item">
                            <svg className="icon svg-password" aria-hidden="true">
                                <use xlinkHref="#icon-password" />
                            </svg>
                            <input className="login-form-input" name="password" required type="password" placeholder="请输入密码(6-20个字符)" minLength={6} maxLength={20} onChange={this.onChange}/>
                        </label>
                    </div>
                    {this.state.login === true ?
                        <button className="login-form-btn" disabled={true}>登录中...</button> :
                        <button className="login-form-btn" type="submit" onClick={this.onClick}>登录/注册</button>
                    }
                </form>
            </div>
        )
    }
}