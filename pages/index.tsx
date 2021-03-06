
import { useMemo, useState } from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import { format } from 'date-fns';
import Layout from '../components/Layout';

import MetaComponent from "../components/MetaComponent";
import MainGraphsComponent from "../components/MainGraphsComponent";
// import * as fs from "fs";



import { getTimeSeriesData, getInfectionsByDistrictNew, getPredictionData, getInfectionsBySourceCountry, getNetworkGraphData, colors, getLastInfectionDayData } from '../utils/chartDataHelper';

export interface KoronaData {
  confirmed: Confirmed[];
  recovered: Recovered[];
  deaths: any[];
  location: any;
}

export interface Confirmed {
  id: string;
  date: Date;
  healthCareDistrict: string;
  infectionSource: InfectionSourceEnum | number;
  infectionSourceCountry: string | null;
}

export interface Deaths {
  id: string;
  date: Date;
  healthCareDistrict: string;
}

export interface Recovered {
  id: number;
  date: Date;
  healthCareDistrict: string;
}

export enum InfectionSourceEnum {
  RelatedToEarlier = "related to earlier",
  Unknown = "unknown",
}


const Index: NextPage<KoronaData> = ({ confirmed, deaths, recovered, location }) => {

  // Map some data for stats blocks
  const latestInfection = format(new Date(confirmed[confirmed.length - 1].date), 'd.M.yyyy - HH:mm');
  const latestInfectionDistrict = confirmed[confirmed.length - 1].healthCareDistrict;
  const latestDeath = deaths.length ? format(new Date(deaths[deaths.length - 1].date), 'd.M.yyyy') : null;
  const latestDeathDistrict = deaths.length ? deaths[deaths.length - 1].healthCareDistrict : null;
  const latestRecoveredDistrict = recovered.length ? recovered[recovered.length - 1].healthCareDistrict : null;
  const latestRecovered = recovered.length ? format(new Date(recovered[recovered.length - 1].date), 'd.M.yyyy') : null;
  const lastInfectionsData = getLastInfectionDayData(confirmed);

  const [cumulativeChartScale, setCumulativeChartScale] = useState<'linear' | 'log'>('linear')
  const [forecastChartScale, setForecaseChartScale] = useState<'linear' | 'log'>('linear')

  // Map data to show development of infections
  const { infectionDevelopmentData, infectionDevelopmentData30Days } = getTimeSeriesData(confirmed, recovered, deaths);
  const { prediction60Days, today } = getPredictionData(confirmed, deaths, recovered);
  const maxValues = infectionDevelopmentData30Days[infectionDevelopmentData30Days.length - 1];
  const dataMaxValue = Math.max(maxValues.deaths, maxValues.infections, maxValues.infections);
  

  // Get infections by district
  /**
   * Data format for infectionsByDistrict is [{name: "tartu", infections: 55, people: 100000}]
   */

  //console.log(location);

  const { infectionsByDistrict, areas } = getInfectionsByDistrictNew(location);
  const { infectionsBySourceCountry } = getInfectionsBySourceCountry(confirmed);
  const networkGraphData = getNetworkGraphData(confirmed);
  const reversedConfirmed = confirmed.map((i, index) => ({index: index+1, ...i})).reverse()

  // console.log(infectionsByDistrict);
  // console.log(areas)

  const props = {
    infectionDevelopmentData30Days: infectionDevelopmentData,
    dataMaxValue: dataMaxValue,
    infectionsByDistrict: infectionsByDistrict, 
    infectionsBySourceCountry: infectionsBySourceCountry,
    networkGraphData: networkGraphData,
    reversedConfirmed: reversedConfirmed,
    lastInfectionsData: lastInfectionsData, 
    latestInfection: latestInfection,
    latestDeath: latestDeath,
    latestRecovered: latestRecovered,
    confirmedCount: confirmed.length,
    recoveredCount: recovered.length,
    deathCount: deaths.length,
    cumulativeChartScale: cumulativeChartScale,
    setCumulativeChartScale: setCumulativeChartScale,
    colors: colors,
    areas: areas,

  }
  return (
    <Layout>
      <MetaComponent confirmedCount={confirmed.length || 0} recoveredCount={recovered.length || 0} deathCount={deaths.length || 0}/>
      <MainGraphsComponent props={props}/>
    </Layout>
  );
}


/** Data loader */
Index.getInitialProps = async function () {

  /** Where to load data from */
  const res = await fetch('http://localhost:3000/EstonianData.json');
  const data = await res.json();
  return data;
};

export default Index;
