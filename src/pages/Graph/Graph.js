import React from 'react'
import ReactECharts from 'echarts-for-react';
import {DatePicker} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import {get} from "../../utils/request";
import history from "../../utils/history";
import "./Graph.css"

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "1",
            date: new Date(),
            graph: "pie",
            period: "month",
        }
    }

    componentDidMount() {
        this.setMonth();
    }
    getData = () => {
        let begin = new Date(this.state.begin);
        let end = new Date(this.state.end);
        const data = {
            account: localStorage.getItem("account"),
            period: this.state.period,
            begin: begin.format("yyyy-MM-dd"),
            end: end.format("yyyy-MM-dd"),
        }
        console.log(data);
        get('getGraphDate', data).then((res) => {
            this.setState({
                sumIn: res.data.result.sumIn,
                sumOut: res.data.result.sumOut,
                outDetail: res.data.result.outDetail,
                inDetail: res.data.result.inDetail,
                inList: res.data.result.inList,
                outList: res.data.result.outList,
            })
        }).catch((err) => {
            alert(err);
        })
    }
    changeType = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
    setMonth = () => {
        let newDate = new Date();
        let nextMonth = newDate.getMonth() + 1;
        let nextMonthFirstDay = new Date(newDate.getFullYear(), nextMonth, 1);
        let oneDay = 1000 * 60 * 60 * 24;
        let from = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
        let to = new Date(nextMonthFirstDay - oneDay);
        this.setState({
            year: newDate.getFullYear(),
            month: newDate.getMonth(),
            day: newDate.getDate(),
            begin: from,
            end: to,
            from: from.format("yyyy.M.d"),
            to: to.format("M.d")
        }, () => {this.getData()});
    }
    setYear = () => {
        let newDate = new Date();
        let nextYearFirstDay = new Date(newDate.getFullYear() + 1, 0, 1);
        let from = new Date(newDate.getFullYear(), 0, 1);
        let to = new Date(nextYearFirstDay - 1000 * 60 * 60 * 24);
        this.setState({
            year: from.getFullYear(),
            begin: from,
            end: to,
            from: from.format("yyyy.M.d"),
            to: to.format("M.d")
        }, () => {this.getData()})
    }
    setWeek = () => {
        let newDate = new Date();
        let newTime = newDate.getTime();
        let day = newDate.getDay();
        let oneDay = 1000 * 60 * 60 * 24;
        let monday = newTime - (day - 1) * oneDay;
        let sunday = newTime + (7 - day) * oneDay;
        let from = new Date(monday);
        let to = new Date(sunday);
        this.setState({
            year: from.getFullYear(),
            month: from.getMonth(),
            day: from.getDate(),
            begin: from,
            end: to,
            from: from.format("yyyy.M.d"),
            to: to.format("M.d")
        }, () => {this.getData()});
    }
    changePeriod = (e) => {
        let value = e.target.value;
        if(value === "year"){
            this.setYear();
        }else if(value === "week"){
            this.setWeek();
        }else{
            this.setMonth();
        }
        this.setState({[e.target.name]: value});
    }
    goLeft = () => {
        let from, nextFirst, to;
        if(this.state.period === "year"){
            from = new Date(this.state.year - 1, 0, 1);
            nextFirst = new Date(this.state.year, 0, 1);
            to = new Date(nextFirst - 1000 * 60 * 60 * 24);
        }else if(this.state.period === "week"){
            from = new Date(this.state.year, this.state.month, this.state.day - 7);
            to = new Date(this.state.year, this.state.month, this.state.day - 1);
        }else{
            from = new Date(this.state.year, this.state.month - 1, 1);
            nextFirst = new Date(this.state.year, this.state.month, 1);
            to = new Date(nextFirst - 1000 * 60 * 60 * 24);
        }
        this.setState({
            year: from.getFullYear(),
            month: from.getMonth(),
            day: from.getDate(),
            begin: from,
            end: to,
            from: from.format("yyyy.M.d"),
            to: to.format("M.d")
        }, () => {this.getData()})
        console.log(from, to, this.state)
    }
    goRight = () => {
        let from, nextFirst, to;
        if(this.state.period === "year"){
            from = new Date(this.state.year + 1, 0, 1);
            nextFirst = new Date(this.state.year + 2, 0, 1);
            to = new Date(nextFirst - 1000 * 60 * 60 * 24);
        }else if(this.state.period === "week"){
            from = new Date(this.state.year, this.state.month, this.state.day + 7);
            to = new Date(this.state.year, this.state.month, this.state.day + 13);
        }else{
            from = new Date(this.state.year, this.state.month + 1, 1);
            nextFirst = new Date(this.state.year, this.state.month + 2, 1);
            to = new Date(nextFirst - 1000 * 60 * 60 * 24);
        }
        this.setState({
            year: from.getFullYear(),
            month: from.getMonth(),
            day: from.getDate(),
            begin: from,
            end: to,
            from: from.format("yyyy.M.d"),
            to: to.format("M.d")
        }, () => {this.getData()})
        console.log(from, to, this.state)
    }

    render() {
        const list = this.state.outList === undefined ? [] : (this.state.type === "1" ? this.state.outList : this.state.inList);
        // console.log(list)
        const pieData = this.state.outList === undefined ? [] : (this.state.type === "1" ? this.state.outDetail : this.state.inDetail)
        const optionPie = {
            tooltip: {
                trigger: "item"
            },
            series: [
                {
                    name: this.state.type === "1" ? "支出" : "收入",
                    type: "pie",
                    radius: "50%",
                    label:{
                        show: true,
                        fontSize: "14",
                    },
                    labelLine: {
                        show: false
                    },
                    data: pieData
                }
            ]
        };
        const optionPieNoDate = {
            series: [
                {
                    name: "无",
                    type: "pie",
                    radius: "50%",
                    label:{
                        show: true,
                        position: "center",
                        fontSize: "14",
                    },
                    data: [{name: "无",value: 0}]
                }
            ]
        };
        const optionList = {
            xAxis: {
                type: 'category',
                data: list.map((item) => {
                    return item.date;
                })
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    inside: true
                },
                scale: true,
                axisLabel: {
                    margin: 2,
                    formatter: function (value, index) {
                        if (value >= 10000 && value < 10000000) {
                            value = value / 10000 + "万";
                        } else if (value >= 10000000) {
                            value = value / 10000000 + "千万";
                        }
                        return value;
                    }
                },
            },
            grid: {
                containLabel: true,
                left: 35
            },
            series: [{
                data: list.map((item) => {
                    return item.amount;
                }),
                type: 'line'
            }]
        };

        return (
            <div className="graph-container">
                <div className="title">
                    <p>图表分析</p>
                </div>
                <div className="graph-head">
                    <div className="graph-head-item">
                        <select name="type" className="select-item graph-select" onChange={this.changeType}>
                            <option value="1">支出</option>
                            <option value="0">收入</option>
                        </select>
                    </div>
                    <div className="graph-head-date graph-head-item">
                        <div>
                            <button className="svg-btn" onClick={this.goLeft}>
                                <svg className="icon svg-left" aria-hidden="true">
                                    <use xlinkHref="#icon-left"/>
                                </svg>
                            </button>
                        </div>
                        <div className="graph-head-period">{this.state.from}~{this.state.to}</div>
                        <div>
                            <button className="svg-btn" onClick={this.goRight}>
                                <svg className="icon svg-right" aria-hidden="true">
                                    <use xlinkHref="#icon-right"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="graph-head-item">
                        <select name="period" className="select-item graph-select" onChange={this.changePeriod}>
                            <option value="month">月</option>
                            <option value="year">年</option>
                            <option value="week">周</option>
                        </select>
                    </div>
                    <div className="graph-head-item">
                        <select name="graph" className="select-item graph-select" onChange={this.changeType}>
                            <option value="pie">饼图</option>
                            <option value="line">折线图</option>
                        </select>
                    </div>
                </div>
                <div className="graph-sum" >总计 &yen; {this.state.type === "1" ? this.state.sumOut : this.state.sumIn}</div>
                <ReactECharts option={this.state.graph === "pie" ?  (pieData.length === 0 ? optionPieNoDate : optionPie) : optionList} notMerge={true}/>
            </div>
        )
    }
}