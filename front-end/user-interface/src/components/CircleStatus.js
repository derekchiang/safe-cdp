import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

class CircleStatus extends Component {
    state = { 
        percent:""
     }
    render() { 
        return ( 
            <div className="circle-status">
                <Progress
                type="circle"
                strokewidth={1}
                percent={33}
                />
                
            </div>
         );
    }
}
 
export default CircleStatus;