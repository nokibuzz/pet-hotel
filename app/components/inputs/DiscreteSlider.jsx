"use client";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const DescreteSlider = ({ 
    values,
    value,
    onChange
}) => {

    const min = Math.min(...Object.keys(values).map(Number));
    const max = Math.max(...Object.keys(values).map(Number));

    return (
        <div>
            <Slider
                dots
                min={min}
                max={max}
                marks={values}
                step={null}
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
      </div>
      );
};

export default DescreteSlider;
