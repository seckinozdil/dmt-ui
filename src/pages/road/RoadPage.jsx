import React from 'react'
import { Road } from '../../components/road/Road';

const RoadPage = () => {
  return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card' style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Road />
                </div>
            </div>
        </div>
    );
}

export default RoadPage