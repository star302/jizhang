import React from 'react'
import {post} from '../../utils/request.js'
import history from '../../utils/history'
import './AddOne.css'
import {DatePicker, Modal} from "antd-mobile";

const alert = Modal.alert;

export default class AddOne extends React.Component{
    constructor(props) {
        super(props);
        this.mode = this.props.location.mode === "edit" ;
        if(this.mode){
            this.item = this.props.location.state.item;
        }
        console.log(this.mode);
        this.state = {
            type: "1",
            amount: 0,
            date: new Date(),
            category: "美食",
            remark: "",
            status: false,
            show: false,
        }
    }

    componentDidMount = () => {
        console.log(this.props.location);
        if(localStorage.getItem("account") === null){
            history.replace("login");
        }
        if(this.mode){
            this.setState({
                type: this.item.type.toString(),
                amount: this.item.amount,
                date: new Date(this.item.date),
                category: this.state.category,
                remark: this.state.remark,
            })
        }
    }
    back(){
        history.goBack();
    }
    change = e =>{
        this.setState({[e.target.name]: e.target.value});
    }
    changeNum = e =>{
        let value = e.target.value;
        // 如果第一位是0，第二位不是点，就用数字把点替换掉
        let len1 = value.substr(0, 1);
        let len2 = value.substr(1, 1);
        if (value.length > 1 && len1 === 0 && len2 !== ".") {
            value = value.substr(1, 1);
        }
        value = value.replace(/[^\d.]/g,"");
        value = value.replace(/\.{2,}/g,".");
        // value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
        if (value.indexOf(".") < 0 && value !== "") {
            value = parseFloat(value);
        }
        this.setState({[e.target.name]: value});
    }
    changeType = e =>{
        this.setState({
            [e.target.name]: e.target.value,
            category: this.state.type === "1" ? "工资" : "美食"
        });
    }
    changeDate = (date) => {
        this.setState({date: date});
    }
    save = () =>{
        this.setState({
            status: true
        })
        let data = {
            account: localStorage.getItem("account"),
            amount: this.state.amount,
            category: this.state.category,
            type: this.state.type,
            date: this.state.date,
            remark: this.state.remark,
        }
        console.log("save", data);
        post('insertToBill', data).then( (res) => {
            console.log(res);
            history.goBack();
        }).catch((err) => {

        }).finally(() =>{
            this.setState({
                status: false
            })
        })
    }
    update = () =>{
        this.setState({
            status: true
        })
        let data = {
            account: localStorage.getItem("account"),
            id: this.item.id,
            amount: this.state.amount,
            category: this.state.category,
            type: this.state.type,
            date: this.state.date,
            remark: this.state.remark,
        }
        console.log("update", data);
        post('updateBill', data).then( (res) => {
            console.log(res);
            history.goBack();
        }).catch((err) => {

        }).finally(() =>{
            this.setState({
                status: false
            })
        })
    }
    delete = () =>{
        let data = {
            account: localStorage.getItem("account"),
            id: this.item.id,
        }
        console.log(data);
        post('deleteBill', data).then( (res) => {
            console.log(res);
            history.goBack();
        }).catch((err) => {

        })

    }
    render() {
        return(
            <div className="add-one-container">
                <div className="add-title">
                    <button className="back-btn" onClick={this.back}>
                        <svg className="icon svg-back" aria-hidden="true">
                            <use xlinkHref="#icon-back" />
                        </svg>
                    </button>
                    <div>{this.mode ? "修改" : "记一笔"}</div>
                </div>
                <div className="add-detail">
                    <div className="add-detail-item">
                        <div className="add-detail-item-label">
                            <svg className="icon svg-money" aria-hidden="true">
                                <use xlinkHref="#icon-money" />
                            </svg>
                            <span>
                                <select name="type" className="select-item" onChange={this.changeType} value={this.state.type}>
                                    <option value="1">支出</option>
                                    <option value="0">收入</option>
                                </select>
                            </span>
                        </div>
                        <div className="add-detail-item-input">
                            <input name="amount" className={this.state.type === "1" ? "add-input-out" : "add-input-in"} required value={this.state.amount}
                                   onChange={this.changeNum} placeholder="0.00" maxLength={12}/>
                        </div>
                    </div>
                    <div className="add-detail-item">
                        <div className="add-detail-item-label">
                            <svg className="icon svg-category" aria-hidden="true">
                                <use xlinkHref="#icon-category" />
                            </svg>
                            <span>类别</span>
                        </div>
                        <div className="add-detail-item-input">
                            {this.state.type === "1" ?
                                <select name="category" className="select-item add-select" onChange={this.change} value={this.state.category}>
                                    <option value="美食">美食</option>
                                    <option value="转账">转账</option>
                                    <option value="饮料">饮料</option>
                                    <option value="服饰">服饰</option>
                                    <option value="交通">交通</option>
                                    <option value="其他">其他</option>
                                </select> :
                                <select name="category" className="select-item add-select" onChange={this.change} value={this.state.category}>
                                    <option value="工资">工资</option>
                                    <option value="转账">转账</option>
                                    <option value="其他">其他</option>
                                </select>
                            }
                        </div>
                    </div>
                    <div className="add-detail-item">
                        <div className="add-detail-item-label">
                            <svg className="icon svg-date" aria-hidden="true">
                                <use xlinkHref="#icon-date" />
                            </svg>
                            <span>时间</span>
                        </div>
                        <div className="add-detail-item-input">
                            <DatePicker
                                mode="date"
                                value={this.state.date}
                                onChange={this.changeDate}
                            >
                                <div className="date-picker">
                                    {this.state.date.getFullYear()}-{this.state.date.getMonth() + 1}-{this.state.date.getDate()}
                                    <div className="date-picker-svg">
                                        <svg className="icon svg-more" aria-hidden="true">
                                            <use xlinkHref="#icon-more" />
                                        </svg>
                                    </div>
                                </div>
                            </DatePicker>
                        </div>
                    </div>
                    <div className="add-detail-item">
                        <div className="add-detail-item-label">
                            <svg className="icon svg-remark" aria-hidden="true">
                                <use xlinkHref="#icon-remark" />
                            </svg>
                            <span>备注</span>
                        </div>
                        <div className="add-detail-item-input">
                            <input className="add-input" name="remark" onChange={this.change} placeholder="···"/>
                        </div>
                    </div>
                    <div className="add-detail-save">
                        <button className="add-detail-btn" disabled={this.state.status} onClick={this.mode ? this.update : this.save}>保存</button>
                        {this.mode ?
                            <button className="add-detail-btn del-btn" onClick={() =>
                                alert('删除提示', '是否删除该记录？', [
                                    {text: '取消', onPress: () => console.log('cancel')},
                                    {text: '删除', onPress: () => this.delete()},
                                ])
                            }>删除</button> : null
                        }
                    </div>
                </div>

            </div>
        )
    }
}