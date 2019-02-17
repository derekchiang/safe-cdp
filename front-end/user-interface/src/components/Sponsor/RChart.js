import React, { Component } from 'react';
import LineChart from 'react-linechart';
 
export default class RChart extends Component {
    render() {
        const data = [
            {									
                color: "steelblue", 
                points: [{x: 1, y: 2}, {x: 3, y: 5}, {x: 7, y: 9}] 
            }
        ];
        return (
            <div>
                <div className="App">
                    <h1>Return on Investment</h1>
                    <LineChart 
                        width={600}
                        height={400}
                        data={data}
                        hidelines={false}
                        xLabel="Time"
                        yLabel="ROI"
                    />
                </div>				
            </div>
        );
    }
}