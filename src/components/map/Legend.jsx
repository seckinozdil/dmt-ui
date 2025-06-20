// Legend.jsx
import React from 'react';
import {KPI_COLORS} from '../../helpers/map'

// export const KPI_COLORS = {
//     rsrp: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'],
//     // rsrp: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00'],
//     rsrq: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'],
//     avg_dl_throughput: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000'],
//     block: ['#00FF00', '#FFFF00', '#FFA500', '#FF0000']
// };

const KPI_LABELS = {
    rsrp: ['≥ -75', '-75 to -100', '-100 to -120', '< -120'],
    rsrq: ['≥ -8', '-8 to -14', '-14 to -18', '< -18'],
    avg_dl_throughput: ['≥ 50000', '10000–50000', '5000–10000', '< 5000'],
    block: ['0', '1–2', '2–4', '> 4']
};

const legendStyle = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 6px rgba(0,0,0,0.3)',
    zIndex: 9999,
    fontSize: '12px',
    maxHeight: '90%', // 🔄 Eğer liste çok uzunsa scroll olur
    overflowY: 'auto' // 🔄 Uzunluk aşarsa bile kesilmesin
};

export const RoadMapLegend = ({ selectedKPI }) => {
    const colors = KPI_COLORS[selectedKPI] || [];
    const labels = KPI_LABELS[selectedKPI] || [];

    return (
        <div style={legendStyle}>
            {/* <div><strong>{selectedKPI} Scale</strong></div> */}
            {colors.map((color, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                    <div
                        style={{
                            width: 20,
                            height: 10,
                            backgroundColor: color,
                            marginRight: 6
                        }}
                    ></div>
                    <span style={{ color: 'black' }}>{labels[idx]}</span>
                </div>
            ))}
        </div>
    );
};

export const GridMapLegend = ({ min = 0, max = 100, gradient = [], height = 200, width = 20 }) => {
    const steps = gradient.length;
    const stepValue = (max - min) / (steps - 1);
    const labels = Array.from({ length: steps }, (_, i) => (min + i * stepValue).toFixed(1)).reverse();
    // console.log('labels', labels);

    return (
        <div style={{
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '6px',
            boxShadow: '0 0 6px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px'
        }}>
            <div style={{
                height: `${height}px`,
                width: `${width}px`,
                background: `linear-gradient(to top, ${gradient.join(',')})`
            }} />
            <div style={{
                height: `${height}px`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                {labels.map((label, idx) => (
                    <div key={idx} style={{color: 'black'}}>{label}</div>
                ))}
            </div>
        </div>
    );
};