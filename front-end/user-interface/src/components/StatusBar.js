import React, { Component } from 'react';
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

class StatusBar extends Component {
    state = { 
        percent:""
     }
    render() { 
        return ( 
            <div>
                <Progress
          // 
          percent={45}
        />
            </div>
         );
    }
}
 
export default StatusBar;