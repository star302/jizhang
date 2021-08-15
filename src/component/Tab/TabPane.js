import React from 'react'

export default class TabPane extends React.Component{
    render() {
        return (
            <div>
                <div>{this.props.title}</div>
                <div>{this.props.children}</div>
            </div>
        )
    }
}