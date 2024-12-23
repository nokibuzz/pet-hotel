"use client";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const RangeInput = ({ 
    min,
    max,
    value,
    onChange,
    rangeElementLabel
}) => {
    return (
        <div>
            <Slider
                range
                min={min}
                max={max}
                value={value}
                onChange={onChange}
                styles={{
                    track: {
                        backgroundColor: '#ca8a04',
                        height: 8,
                    },
                    rail: {
                        backgroundColor: '#ddd',
                        height: 6,
                    },
                    handle: {
                        borderColor: '#ca8a04',
                        backgroundColor: '#ca8a04',
                        height: 20,
                        width: 20,
                    }
                }}
            />
            <div className="flex justify-between text-sm mt-2">
                <span>{rangeElementLabel}{value[0]}</span>
                <span>{rangeElementLabel}{value[1]}</span>
            </div>
      </div>
      );
};

export default RangeInput;
