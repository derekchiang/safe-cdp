import React from 'react';
import Dashboard from '../components/Dashboard';
import Sponsor from '../components/Sponsor/Sponsor';
import FindId from '../components/Auth/FindId';
import Balance from '../components/Balance/Balance';
import { Route, Switch, Redirect } from 'react-router-dom';


class UserAccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                
                    <Route exact path='/'  render={props => <FindId  {...props} />} />
                    <Route path='/dashboard'  render={props => < Dashboard {...props} />} />
                    <Route path='/sponsor'  render={props => < Sponsor {...props} />} />
                    <Route path='/balance'  render={props => < Balance {...props} />} />
                

            </div>
         );
    }
}
 
export default UserAccess;