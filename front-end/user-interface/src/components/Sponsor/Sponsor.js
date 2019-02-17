import React, { Component } from 'react';
import SideBar from '../Sidebar';
import WithdrawModal from './WithdrawModal';
import DepositModal from './DepositModal';


class Sponsor extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <SideBar />
                <div className=''>
                <WithdrawModal />
                </div>
                <div className=''>
                <DepositModal />
                </div>
            </div>
         );
    }
}
 
export default Sponsor;