import React, { Component } from 'react';
import Go from '../../buttons/Go';
import SearchId from './Input';
import { Link } from 'react-router-dom';

class FindId extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <SearchId />
                <Link to='/dashboard'>
                <Go />
                </Link>
            </div>
         );
    }
}
 
export default FindId;