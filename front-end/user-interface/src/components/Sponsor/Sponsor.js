import React, { Component } from 'react';
import SideBar from '../Sidebar';
import WithdrawModal from './WithdrawModal';
import DepositModal from './DepositModal';
import SponsorCard from './SponsorCard.js';

class Sponsor extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {
        return (
            <div>
                <SideBar />
                <SponsorCard />
                <div>
                <WithdrawModal />
                </div>
                <div>
                <DepositModal />
                </div>
            </div>
         );
    }
}

export default Sponsor;
