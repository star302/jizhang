import React from 'react';
import Tab from "../../component/Tab/Tab";
import BillList from "../BillList/BillList";
import Graph from "../Graph/Graph";
import TabPane from "../../component/Tab/TabPane";
import history from "../../utils/history";
import {get} from "../../utils/request";


export default class Home extends React.Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if(localStorage.getItem("account") === null){
            history.replace("login");
        }
    }

    render() {
        return(
            <Tab activeKey="1">
                <TabPane title="账单" key="1">
                    <BillList />
                </TabPane>
                <TabPane title="图表" key="2">
                    <Graph />
                </TabPane>
            </Tab>
        )
    }

}