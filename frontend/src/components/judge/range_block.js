import RangeInput from "./range_input"
import React, { useState } from 'react';
function RangeBlock(props) {
  return (
    <div className='range'>
        <div className='block_range'>
          <div className="name_d">
            {props.name}
          </div>
            <div className='range_block'>
                <div className='lll'>1</div>
                <div><RangeInput /></div>
                <div className='llll'>10</div>
            </div>
        </div>
    </div>
  );
}

export default RangeBlock;