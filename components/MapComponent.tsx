import React from 'react'
import Block from '../components/Block';
import d3 from 'd3';
import d3ScaleChromatic from 'd3-scale-chromatic';
import topojson from 'topojson';




const MapComponent: React.FC<any> = ({props }) => (
    <Block title="Map"
    textAlign="center">
        <svg className="map" width="600" height="500"></svg>
        <div id="credits">
            <p>Map goes here</p>
            <p>Source:<br />
            Administrative and settlement data: <a href="https://github.com/buildig/EHAK">Estonian Land Board</a>, version 20180901</p>
        </div>

    </Block>
)

export default MapComponent;
