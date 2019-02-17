import React, { Component } from 'react';
import BalanceCard from './BalanceCard';
import SideBar from '../Sidebar';

class Balance extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <SideBar />
                <BalanceCard />
            </div>
         );
    }
}
 
export default Balance;