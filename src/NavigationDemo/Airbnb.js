import React from 'react';
import {render} from 'react-dom';
import './Airbnb.css'
import Airbnblog from './Airbnb.svg'
class Airbnb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '1000'
        };
    }

    render() {
        return (
            <div className='header'>
                <img src={Airbnblog} alt="logo"/>
                <div className="right">
                    <div className='title'>成为房东</div>
                    <div className='title'>故事</div>
                    <div className='title'>帮助</div>
                    <div className='title'>注册</div>
                    <div className='title'>登录</div>
                </div>
            </div>
        )
    }
}

export default Airbnb