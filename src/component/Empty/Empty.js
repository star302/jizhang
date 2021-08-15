import React from 'react';
import './Empty.css';

export default class Empty extends React.Component{
    render() {
        return(
            <div className="empty-container">
                <svg className="icon svg-empty" aria-hidden="true">
                    <use xlinkHref="#icon-empty" />
                </svg>
                <p style={{color: "#2065ff"}}>没有记录，快去记一笔吧！</p>
            </div>
        )
    }
}