import React from 'react'
import { Road } from '../../components/road/Road';

const RoadPage = () => {
  return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card'>
                    <div>Road Page</div>
                    <Road />
                </div>
            </div>
        </div>
    );
}

export default RoadPage