import React from 'react';
import Dashboard from '../components/Dashboard';
import Sponsor from '../components/Sponsor';
import { Route, Switch, Redirect } from 'react-router-dom';
import SideBar from '../components/Sidebar';

class UserAccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                
                    <Route path='/borrow'  render={props => < Dashboard {...props} />} />
                    <Route path='/sponsor'  render={props => < Sponsor {...props} />} />
                
            </div>
         );
    }
}
 
export default UserAccess;