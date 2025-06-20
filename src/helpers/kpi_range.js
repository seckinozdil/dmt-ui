export const KPI_RANGES = {
    rsrp: {
        min: -140,
        max: -70,
        gradient: [
            '#E30000', // koyu kırmızı
            '#E13900',
            '#FF7300',
            '#FFAA00',
            '#DFE300',
            '#AAD500',
            '#71B800',
            '#008000' // yeşil
        ]
    },
    rsrq: {
        min: -25,
        max: 0,
        gradient: [
            '#E30000',
            '#FFAA00',
            '#DFE300',
            '#71B800',
            '#008000'
        ]
    },
    rssinr: {
        min: -5,
        max: 20,
        gradient: [
            '#a50026',
            '#ea593a',
            '#fdbf6f',
            '#ffec00',
            '#b7e075',
            '#4db15d',
            '#006837'
        ]
    },
    block: {
        min: 0,
        max: 5,
        gradient: [
            '#008000',
            '#DFE300',
            '#FF7300',
            '#E30000'
        ]
    },
    dl_throughput: {
        min: 0,
        max: 10000,
        gradient: [
            '#E30000',
            '#FFAA00',
            '#DFE300',
            '#71B800',
            '#008000'
        ]
    },
    ul_throughput_mb: {
        min: 0,
        max: 10000,
        gradient: [
            '#E30000',
            '#FFAA00',
            '#DFE300',
            '#71B800',
            '#008000'
        ]
    }
};
