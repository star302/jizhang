import React from 'react';
import {get} from "../../utils/request";
import './BillList.css';
import history from '../../utils/history'
import {DatePicker} from "antd-mobile";
import Empty from "../../component/Empty/Empty";


export default class BillList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            billList: [],
            date: new Date(),
        }
    }
    componentDidMount() {
        const data = {
            account: localStorage.getItem("account"),
            year: this.state.date.getFullYear(),
            month: this.state.date.getMonth() + 1,
        }
        get("getBillList", data).then((res) => {
            console.log(res, data);
            this.setState({
                billList: res.data.result.billList,
                sumIn: res.data.result.sumIn,
                sumOut: res.data.result.sumOut,
            })
        }).catch((err) => {
            alert(err);
        })
    }
    changeDate = (date) => {
        this.setState({date: date}, () => {this.componentDidMount()})
    }
    add = () => {
        history.push({
            pathname: 'add',
            mode: "add",
        });
    }
    edit = (item) => {
        history.push({
            pathname: 'add',
            mode: "edit",
            state: {
                item: item
            }
        });
    }
    render() {
        const listItem = this.state.billList.map((oneDay, index) => {
            return (
                <div className="list-container" key={index}>
                    <div className="list-date">
                        <p>{oneDay.date}</p>
                    </div>
                    <ul>
                        {oneDay.bills.map((item, index) => {
                            return (
                                <div className="list-item" key={index} onClick={() => this.edit(item)}>
                                    <div className="list-item-info">
                                        <p>{item.category}</p>
                                        <p className="list-item-info-remark">{item.remark}</p>
                                    </div>
                                    <div className="list-item-amount">
                                        <p>{item.type === 1 ? <span  style={{color: "green"}}>-{item.amount}</span> :
                                            <span style={{color: "red"}}>+{item.amount}</span>}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            )
        });

        return(
            <div className="bill-list-container">
                <div className="title">
                    <p>我的账单</p>
                </div>
                <div className="info-sum">
                    <div className="info-sum-time">
                        <DatePicker
                            mode="month"
                            value={this.state.date}
                            onChange={this.changeDate}
                        >
                            <div className="date-picker">
                                {this.state.date.getFullYear()}-{this.state.date.getMonth() + 1}
                                <div className="date-picker-svg">
                                    <svg className="icon svg-more" aria-hidden="true">
                                        <use xlinkHref="#icon-more" />
                                    </svg>
                                </div>
                            </div>
                        </DatePicker>
                    </div>
                    <div className="info-sum-amount">
                        <p style={{marginRight:"10px"}}>
                           <span>总支出&yen; </span>{this.state.sumOut}
                        </p>
                        <p style={{marginRight:"10px"}}>
                            <span>总收入&yen; </span>{this.state.sumIn}
                        </p>
                    </div>
                </div>
                {listItem.length === 0 ? <Empty /> :
                    <div className="info-list">
                        <ul>{listItem}</ul>
                    </div>}
                <div >
                    <button className="add-btn" onClick={this.add}>记一笔</button>
                </div>
            </div>
        )
    }
}