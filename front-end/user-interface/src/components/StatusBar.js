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
          theme={{
            error: {
              symbol: this.state.percent + "%",
              trailColor: "pink",
              color: "red"
            },
            default: {
              symbol: this.state.percent + "%",
              trailColor: "lightblue",
              color: "blue"
            },
            active: {
              symbol: this.state.percent + "%",
              trailColor: "yellow",
              color: "orange"
            },
            success: {
              symbol: this.state.percent + "%",
              trailColor: "lime",
              color: "green"
            }
          }}
        />
            </div>
         );
    }
}
 
export default StatusBar;