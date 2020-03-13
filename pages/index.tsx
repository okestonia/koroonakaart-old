
import { useMemo, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import { format } from 'date-fns';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup } from '@chakra-ui/core';

import Layout from '../components/Layout';
import StatBlock from '../components/StatBlock';
import Block from '../components/Block';
import Copyright from '../components/Copyright';
import Header from '../components/Header';
import NetworkGraph from '../components/NetworkGraph';
import Table from '../components/Table';
import { infectionColumns } from '../components/TableColumns';
import mock from '../utils/mock/mock.json';

import { getTimeSeriesData, getPredictionData, getTnfectionsByDistrict, getInfectionsBySourceCountry, getNetworkGraphData, colors, getInfectionsToday } from '../utils/chartDataHelper';

export interface KoronaData {
  confirmed: Confirmed[];
  recovered: Recovered[];
  deaths: any[];
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

const CustomizedAxisTick: React.FC<any> = (props) => {
  const {
    x, y, stroke, payload, isDate
  } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={14} fontSize={12} textAnchor="end" fill="#666" transform="rotate(-35)">{isDate ? format(new Date(payload.value), 'd.M.') : payload.value}</text>
    </g>
  );
}

const Index: NextPage<KoronaData> = ({ confirmed, deaths, recovered }) => {

  // Map some data for stats blocks
  const latestInfection = format(new Date(confirmed[confirmed.length - 1].date), 'd.M.yyyy - HH:mm');
  const latestInfectionDistrict = confirmed[confirmed.length - 1].healthCareDistrict;
  const latestDeath = deaths.length ? format(new Date(deaths[deaths.length - 1].date), 'd.M.yyyy') : null;
  const latestDeathDistrict = deaths.length ? deaths[deaths.length - 1].healthCareDistrict : null;
  const latestRecoveredDistrict = recovered.length ? recovered[recovered.length - 1].healthCareDistrict : null;
  const latestRecovered = recovered.length ? format(new Date(recovered[recovered.length - 1].date), 'd.M.yyyy') : null;
  const infectionsToday = getInfectionsToday(confirmed);

  const [cumulativeChartScale, setCumulativeChartScale] = useState<'linear' | 'log'>('linear')
  const [forecastChartScale, setForecaseChartScale] = useState<'linear' | 'log'>('linear')

  // Map data to show development of infections
  const { infectionDevelopmentData, infectionDevelopmentData30Days } = getTimeSeriesData(confirmed, recovered, deaths);
  const { prediction60Days, today } = getPredictionData(confirmed, deaths, recovered);
  const maxValues = infectionDevelopmentData30Days[infectionDevelopmentData30Days.length - 1];
  const dataMaxValue = Math.max(maxValues.deaths, maxValues.infections, maxValues.infections);
  const { infectionsByDistrict, infectionsByDistrictPercentage, areas } = getTnfectionsByDistrict(confirmed);
  const { infectionsBySourceCountry } = getInfectionsBySourceCountry(confirmed);
  const networkGraphData = getNetworkGraphData(confirmed);
  const reversedConfirmed = confirmed.map((i, index) => ({index: index+1, ...i})).reverse()

  return (
    <Layout>
      <Head>
        <title>Koroona viirus Eestis – nakatunud: {confirmed.length || 0} - paranenud: {recovered.length || 0} - surnud: {deaths.length || 0}</title>
        <meta name="description" content={`Koroona viirus Eestis – nakatunud: ${confirmed.length || 0} - paranenud: ${recovered.length || 0} - surnud: ${deaths.length || 0}`} />
        <meta property="og:title" content={`Koroona viirus Eestis`} />
        <meta property="og:description" content={`Hetkel nakatunud: ${confirmed.length || 0} - paranenud: ${recovered.length || 0} - surnud: ${deaths.length || 0}`} />
        <meta property="og:site_name" content="Koroona viirus Eestis" />
        <meta property="og:locale" content="ee_EE" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/corona-virus.png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1928" />
      </Head>
      <Flex alignItems="center" flexDirection="column" flex="1" width={"100%"} maxWidth="1440px" margin="auto">
        <Header />
        <Flex flexWrap="wrap" flexDirection="row" justifyContent="center" alignItems="stretch" flex="1" width={"100%"}>
          <Box width={['100%', '100%', 1 / 3, 1 / 3]} p={3}>
            <Block title="Nakatunud" textAlign="center" extraInfo={`Uusi nakatunuid täna ${infectionsToday} in`} footer={`Viimane nakatunu ${latestInfection} (${latestInfectionDistrict})`}>
              <StatBlock count={confirmed.length} helpText={`Uusi nakatunuid täna: ${infectionsToday}in`} />
            </Block>
          </Box>
          <Box width={['100%', '100%', 1 / 3, 1 / 3]} p={3}>
            <Block title="Surnud" footer={latestDeath ? `Viimane surnud ${latestDeath} (${latestDeathDistrict})` : 'Ei ole surnuid'}>
              <StatBlock count={deaths.length || 0} />
            </Block>
          </Box>
          <Box width={['100%', '100%', 1 / 3, 1 / 3]} p={3}>
            <Block title="Paranenud" footer={latestRecovered ? `Viimane paranenu ${latestRecovered} (${latestRecoveredDistrict})` : ' '}>
              <StatBlock count={recovered.length || 0} />
            </Block>
          </Box>
          
          <Box width={['100%']} p={3}>
            <Block title="Kumulatiivne areng (30 päeva)" footer="Nakatunud, paranenud ja surnud kumulatiivses skaalas viimase 30 päeva lõikes">
            <ButtonGroup spacing={0} alignSelf="center" display="flex" justifyContent="center" marginTop="-15px">
              <Button size="xs" fontFamily="Space Grotesk Regular" px={3} letterSpacing="1px" borderRadius="4px 0px 0px 4px" borderWidth="0px" isActive={cumulativeChartScale === 'linear'} onClick={() => setCumulativeChartScale('linear')}>
                Lineaarskaalas
              </Button>
              <Button size="xs" fontFamily="Space Grotesk Regular" px={3} letterSpacing="1px" borderRadius="0px 4px 4px 0px" borderWidth="0px" isActive={cumulativeChartScale === 'log'}  onClick={() => setCumulativeChartScale('log')}>
                Logaritmilises skaalas
              </Button>
            </ButtonGroup>
              <ResponsiveContainer width={'100%'} height={380}>
                <ComposedChart
                  data={infectionDevelopmentData30Days}
                  margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="colorInfection" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[8]} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={colors[8]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[7]} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={colors[7]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[0]} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis tickFormatter={d => format(new Date(d), 'd.M.')} tick={<CustomizedAxisTick isDate />} dataKey="date" domain={['dataMin', 'dataMax']} type="number" scale="time" />
                  <YAxis scale={cumulativeChartScale} dataKey="infections" domain={['dataMin', dataMaxValue + 10]} unit=" in" tick={{ fontSize: 12 }} name="Nakatunuid" />
                  <CartesianGrid opacity={0.2} />
                  <Tooltip labelFormatter={v => format(new Date(v), 'dd.MM.yyyy')} />
                  <Bar fill={colors[1]} opacity={0.4} dataKey="infectionsDaily" name="Nakatunuid päevas" unit=" in" />
                  <Area type="monotone" unit=" in" name="Nakatumisi" dataKey="infections" stroke={colors[8]} fillOpacity={1} fill="url(#colorInfection)" />
                  <Area type="monotone" unit=" in" name="Paranemisi" dataKey="recovered" stroke={colors[7]} fillOpacity={1} fill="url(#colorRecovered)" />
                  <Area type="monotone" unit=" in" name="Surmajuhtumeid" dataKey="deaths" stroke={colors[0]} fillOpacity={1} fill="url(#colorDeaths)" />
                  <Legend wrapperStyle={{bottom: '10px'}} />
                </ComposedChart>
              </ResponsiveContainer>
            </Block>
          </Box>
          {/*
          <Box width={['100%']} p={3}>
            <Block title="Tartuntojen kumulatiivinen ennustemalli" footer={`Tartuntojen kehityksen ennustemalli 60 päivää. Laskee ennustetun eksponentiaalisen kasvun käyttämällä aiemmin luotuja tietoja.  Käytetty <a style="color: #319795;" href="https://github.com/mljs/regression-exponential" target="_blank">exponential-regression</a> kirjastoa.`}>
              <ButtonGroup spacing={0} alignSelf="center" display="flex" justifyContent="center" marginTop="-15px">
                <Button size="xs" fontFamily="Space Grotesk Regular" px={3} letterSpacing="1px" borderRadius="4px 0px 0px 4px" borderWidth="0px" isActive={forecastChartScale === 'linear'} onClick={() => setForecaseChartScale('linear')}>
                  Lineaarinen
                </Button>
                <Button size="xs" fontFamily="Space Grotesk Regular" px={3} letterSpacing="1px" borderRadius="0px 4px 4px 0px" borderWidth="0px" isActive={forecastChartScale === 'log'}  onClick={() => setForecaseChartScale('log')}>
                  Logaritminen
                </Button>
              </ButtonGroup>
              <ResponsiveContainer width={'100%'} height={350}>
                <AreaChart
                    data={prediction60Days}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorInfection" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[8]} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={colors[8]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis tickFormatter={d => format(new Date(d), 'd.M.')} tick={<CustomizedAxisTick isDate />} dataKey="date" domain={['dataMin', 'dataMax']} type="number" scale="time" />
                  <YAxis scale={forecastChartScale} dataKey="infections" domain={['auto', 'auto']} unit=" kpl" tick={{ fontSize: 12 }} name="Tartunnat" />

                  <CartesianGrid opacity={0.2} />
                  <ReferenceLine
                    x={today}
                    stroke="rgba(0,0,0,.5)"
                    // @ts-ignore
                    label={{ position: 'top', value: 'Nyt', fill: 'rgba(0,0,0,0.5)', fontSize: 12 }}
                    strokeDasharray="3 3" />
                  <Tooltip labelFormatter={v => format(new Date(v), 'dd.MM.yyyy')} />
                  <Area type="monotone" name="Ennuste" unit=" kpl" dataKey="infections" stroke={colors[8]} fillOpacity={1} fill="url(#colorInfection)" />
                </AreaChart>
              </ResponsiveContainer>
            </Block>
          </Box>
           */}
          <Box width={['100%', '100%', '100%', '100%', 1 / 2]} p={3}>
            <Block title="Nakatumised maakonniti">
              <ResponsiveContainer width={'100%'} height={350}>
                <BarChart
                  data={infectionsByDistrict}
                  margin={{
                    top: 20, right: 30, left: 0, bottom: 85,
                  }}
                >
                  <XAxis interval={0} dataKey="name" tick={<CustomizedAxisTick />} />
                  <YAxis yAxisId="left" unit=" in" dataKey="infections" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="infections" name="Nakatumisi" unit=" in" yAxisId="left">
                    {
                      areas.map((area, index) => (
                        <Cell key={area} fill={colors[index % colors.length]} />
                      ))
                    }
                    <LabelList dataKey="infections" position="top" formatter={(e) => e} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Block>
          </Box>
          <Box width={['100%', '100%', '100%', '100%', 1 / 2]} p={3}>
            <Block title="Nakatumised regionaalselt koos rahvaarvuga">
              <ResponsiveContainer width={'100%'} height={350}>
                <BarChart
                  data={infectionsByDistrictPercentage}
                  margin={{
                    top: 20, right: 30, left: 0, bottom: 85,
                  }}
                >
                  <XAxis interval={0} dataKey="name" tick={<CustomizedAxisTick />} />
                  <YAxis unit=" %" dataKey="perDistrict" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="perDistrict" name="% piirkonna elanikest" unit=" %">
                    {
                      areas.map((area, index) => (
                        <Cell key={area} fill={colors[index % colors.length]} />
                      ))
                    }
                    <LabelList dataKey="perDistict" position="top" formatter={(e) => e} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Block>
          </Box>
          {/* <Box width={['100%', '100%', '100%', '100%', 1/2]} p={3}>
            <Block title="Nakatumised" footer="footer info">
              <Table height={350} data={reversedConfirmed} columns={useMemo(() => infectionColumns, [])} />
            </Block>
          </Box> */}
          {/* <Box width={['100%']} p={3}>
            <Block title="Nakatumise võrgustik" footer="The figure shows the infections as a network. The number is the serial number of the infection. If the direct vector is not known, the link will be linked to the country of origin. Infections for which the direct cause or country of origin is not known are excluded. Infections marked in Finland are most likely to be linked to other infection networks. The color of the cell indicates the country where the infection is likely to have occurred.">
              <NetworkGraph data={networkGraphData} />
            </Block>
          </Box> */}
        </Flex>

        <Copyright />
      </Flex>
    </Layout>
  );
}

Index.getInitialProps = async function () {
  const res = await fetch('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData');
  const data = await res.json();

  return data;
};

export default Index;