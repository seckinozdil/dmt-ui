import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import api from '../../services/api';

export const SingleRoadData = ({ isOpen, selectedRoadId, siteid_cellid, onHideEditModal }) => {
    const [roadData, setRoadData] = useState([]);
    const [cellData, setCellData] = useState([]);
    useEffect(() => {
        if (selectedRoadId) {
            api.get(`/road/singleData?selectedRoadId=${selectedRoadId}`).then((res) => {
                setRoadData(res.data);
            });
        }

        if (siteid_cellid) {
            api.get(`/road/getCellInfo?siteid_cellid=${siteid_cellid}`).then((res) => {
                setCellData(res.data);
            });
        }
    }, [selectedRoadId, siteid_cellid]);

    return (
        <>
        
            <Dialog header="Point Details" visible={isOpen} style={{ width: '60vw' }} modal onHide={onHideEditModal}>
                <div className="grid">
                    {/* ROAD DATA */}
                    <div className="col-12 md:col-6">
                        <div className="card">
                            <h5 className="mb-3"><strong><u>Road Data</u></strong></h5>
                            <div className="p-fluid grid">
                                <div className="field col-12">
                                    <label><strong><u>Date:</u></strong> {roadData?.date}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Route:</u></strong> {roadData?.route}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Region:</u></strong> {roadData?.region_name}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Latitude:</u></strong> {roadData?.latitude}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Longitude:</u></strong> {roadData?.longitude}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Cell ID:</u></strong> {roadData?.siteid_cellid}</label>
                                </div>
                                <div className="field col-12">
                                    <hr/>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>RSRP:</u></strong> {roadData?.rsrp}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>RSRQ:</u></strong> {roadData?.rsrq}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>AVG DL THROUGHPut ID:</u></strong> {roadData?.avg_dl_throughput}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Block/Fail:</u></strong> {roadData?.block}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CELL DATA */}
                    <div className="col-12 md:col-6">
                        <div className="card">
                            <h5 className="mb-3"><strong><u>Cell Info</u></strong></h5>
                            <div className="p-fluid grid">
                                <div className="field col-12">
                                    <label><strong><u>Cell Name:</u></strong> {cellData?.cellname}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Cell ID:</u></strong> {cellData?.cell_id}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Site Name:</u></strong> {cellData?.sitename}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Site ID:</u></strong> {cellData?.siteid}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>City:</u></strong> {cellData?.city}°</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>District:</u></strong> {cellData?.district}°</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Azimuth:</u></strong> {cellData?.azimuth}</label>
                                </div>
                                <div className="field col-12">
                                    <label><strong><u>Beamwidth:</u></strong> {cellData?.beamwidth}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {/* <Dialog header="" visible={isOpen} style={{ width: '50vw' }} modal onHide={onHideEditModal}>
                <div className='flex w-9'>
                    <div className="col-8">
                        <div className="card">
                            <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-8">
                                    <label htmlFor="route">Route: {singleData.route}</label>
                                </div>
                                <div className="field col-6 md:col-6">
                                    <label htmlFor="cell_id">Route: {singleData.siteid_cellid}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="card">
                            <div className="p-fluid formgrid grid">
                                <div className="field col-12 md:col-8">
                                    <label htmlFor="route">Route: {singleData.route}</label>
                                </div>
                                <div className="field col-6 md:col-6">
                                    <label htmlFor="cell_id">Route: {singleData.siteid_cellid}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog> */}
        </>
    );
};
