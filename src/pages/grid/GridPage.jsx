import React from 'react'
import { Grid } from '../../components/grid/Grid';

const RoadPage = () => {
  return (
        <div className='grid'>
            <div className='col-12'>
                <div className='card' style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Grid />
                </div>
            </div>
        </div>
    );
}

export default RoadPage