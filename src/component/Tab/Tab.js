import React from "react"
import "./Tab.css"

export default class Tab extends React.Component{
    constructor() {
        super();
        this.state = {
            activeKey: "1",
        }
    }
    renderHeader = () => {
        return React.Children.map( this.props.children , (element,index) => {
            const activeStyle = element.key === this.state.activeKey ? "activeTitle" : null;
            return (
                <div
                    onClick={() => {
                        this.setState({
                            activeKey: element.key
                        })
                    }}
                    className={activeStyle == null ? "not-active" : "is-active"}
                >
            {element.props.title}
          </div>
            )
        })
    }

    renderContent = () => {
        return React.Children.map( this.props.children , (element,index) => {
            if (element.key === this.state.activeKey) {
                return (<div>{element.props.children}</div>)
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="title-container">{this.renderHeader()}</div>
                <div className="content-container">{this.renderContent()}</div>
            </div>
        )
    }
}
