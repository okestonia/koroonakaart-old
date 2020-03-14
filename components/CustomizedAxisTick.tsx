import React from "react";
import { format } from 'date-fns';


const CustomizedAxisTick: React.FC<any> = (props) => {
    const {
      x, y, stroke, payload, isDate
    } = props;
  
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={14} fontSize={12} textAnchor="end" fill="#666" transform="rotate(-35)">{isDate ? format(new Date(payload.value), 'd.M.') : payload.value}</text>
      </g>
    );
  }
  


export default CustomizedAxisTick