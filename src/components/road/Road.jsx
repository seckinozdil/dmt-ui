import { useState, useEffect } from 'react';
import RoadMapView from '../map/MapView';
import api from '../../services/api';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ToggleButton } from 'primereact/togglebutton';

export const Road = () => {
    const [routeNames, setRouteNames] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState();
    const [roadData, setRoadData] = useState([]);
    const [selectedKpi, setSelectedKpi] = useState([]);
    const [appliedKpi, setAppliedKpi] = useState(null);
    const [showCells, setShowCells] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        api.get('/road/routeNames').then((res) => {
            setRouteNames(res.data);
        });
    }, []);

    const getRoadData = (e) => {
        e.preventDefault();
        setAppliedKpi(selectedKpi);
        if (selectedRoute) {
            api.get(`/road?routeName=${selectedRoute}`).then((res) => {
                setRoadData(res.data);
            });
        }
    };

    const kpiName = ['rsrp', 'rsrq', 'avg_dl_throughput', 'block'];
    const fillRoutes = routeNames?.map((e) => ({ name: e, value: e }));
    const fillKpiNames = kpiName?.map((e) => ({ name: e.toUpperCase(), value: e }));

    return (
        <>
            <div style={{ display: 'flex' }}>
                <div style={{ padding: '10px' }}>
                    <Dropdown id="routeNameDropdown" value={selectedRoute} onChange={(e) => setSelectedRoute(e.value)} options={fillRoutes} optionLabel="name" placeholder="Select Route" />
                    <Dropdown id="routeNameDropdown" value={selectedKpi} onChange={(e) => setSelectedKpi(e.value)} options={fillKpiNames} optionLabel="name" placeholder="Select Kpi" className="ml-3" />
                    <ToggleButton onLabel="Show Cells" offLabel="Don't Show Cells" onIcon="pi pi-check" offIcon="pi pi-times" checked={showCells} onChange={(e) => setShowCells(e.value)} className="ml-3" />
                    <Button icon="pi pi-search" onClick={getRoadData} label={'Search Road Data'} className="ml-3" />
                </div>
            </div>
            <RoadMapView roadData={roadData} selectedKpi={appliedKpi} showCells={showCells} />
        </>
    );
};
