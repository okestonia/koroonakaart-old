import React, {useState, useEffect, Component} from 'react'
import Block from '../components/Block';
import d3 from 'd3';
import d3ScaleChromatic from 'd3-scale-chromatic';
import topojson from 'topojson';






/**
 * 

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!token) {
        getToken();
    }
  }, []);

  const getToken = async () => {
    const headers = {
      Authorization: authProps.idToken // using Cognito authorizer
    };
    const response = await axios.post(
      "https://MY_ENDPOINT.execute-api.us-east-1.amazonaws.com/v1/",
      API_GATEWAY_POST_PAYLOAD_TEMPLATE,
      { headers }
    );
    const data = await response.json();
    setToken(data.access_token);
  };

  return (
    ... rest of the functional component's code
  );

 */

/*
  const res = await fetch('http://localhost:3000/EstonianData.json');
  const data = await res.json();
  return data;




*/

interface Props {}

interface State {
  countiesData: object;
  countryData: object;
  municipalitiesData: object;
  loading: boolean;
};


class MapComponent extends Component<Props, State> {
    state: State = {
        countiesData: {},
        countryData: {},
        municipalitiesData: {},
        loading: true,
    }

    getMapData = async() => {
        let res = await fetch('http://localhost:3000/data/topojson/counties.json');
        const countiesData = await res.json();

        res = await fetch('http://localhost:3000/data/topojson/estonia.json');
        const countryData = await res.json();

        res = await fetch('http://localhost:3000/data/topojson/municipalities.json');
        const municipalitiesData = await res.json();


        this.setState({
            countiesData: countiesData,
            countryData: countryData,
            municipalitiesData: municipalitiesData,
            loading: false
        })


    }

    componentDidMount() {
        this.getMapData();
    }
    render() {
        return !this.state.loading ? (
            <Block title="Map"
            textAlign="center">
                <svg className="map" width="600" height="500"></svg>
                <div id="credits">
        <h3>{Object.keys(this.state.countiesData)}</h3>
        {
            console.log(this.state.countiesData)
        }
        {
            console.log(this.state.countryData)
        }
        {
            console.log(this.state.municipalitiesData)
        }
                    <p>Map goes here</p>
                    <p>Source:<br />
                    Administrative and settlement data: <a href="https://github.com/buildig/EHAK">Estonian Land Board</a>, version 20180901</p>
                </div> 
        
            </Block>
        ): "Laadin kaarti...";
    }
    
}
    
  

export default MapComponent;
