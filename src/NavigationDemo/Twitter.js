import React from 'react';
import {render} from 'react-dom';
import './Twitter.css'
import Airbnblog from './Airbnb.svg'
class Twitter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '1000'
        };
    }

    render() {
        return (
            <div className='theader'>
                <div className="tleft">
                    <div className='ttitle'>成为房东</div>
                    <div className='ttitle'>故事</div>
                    <div className='ttitle'>帮助</div>
                    <div className='ttitle'>注册</div>
                    <div className='ttitle'>登录</div>
                </div>
                <div className="tcenter">
                    <img src={Airbnblog} alt="logo"/>
                </div>
                <div className="tright">
                    <div className='ttitle'>成为房东</div>
                    <div className='ttitle'>故事</div>
                    <div className='ttitle'>帮助</div>
                    <div className='ttitle'>注册</div>
                    <div className='ttitle'>登录</div>
                </div>
            </div>
        )
    }
}

export default Twitter