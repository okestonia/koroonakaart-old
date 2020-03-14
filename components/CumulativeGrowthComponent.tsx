import React from 'react'
import Block from '../components/Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import { format } from 'date-fns';
import CustomizedAxisTick from "./CustomizedAxisTick"


  

const CumulativeGrowthComponent: React.FC<any> = ({props }) => (

    <Block title="Kumulatiivne areng (30 päeva)" footer="">
        <ButtonGroup spacing={0} alignSelf="center" display="flex" justifyContent="center" marginTop="-15px">
          <Button size="xs" fontFamily="'Segoe UI', 'Helvetica Neue', Helvetica, Verdana, sans-serif;" px={3} letterSpacing="1px" borderRadius="4px 0px 0px 4px" borderWidth="0px" 
            isActive={props.cumulativeChartScale === 'linear'} onClick={() => props.setCumulativeChartScale('linear')}>
            Lineaarne
          </Button>
          
          <Button size="xs" fontFamily="'Segoe UI', 'Helvetica Neue', Helvetica, Verdana, sans-serif;" px={3} letterSpacing="1px" borderRadius="0px 4px 4px 0px" borderWidth="0px" 
            isActive={props.cumulativeChartScale === 'log'}  onClick={() => props.setCumulativeChartScale('log')}>
            Logaritmiline
          </Button>
        </ButtonGroup>
          <ResponsiveContainer width={'100%'} height={380}>
            <ComposedChart
              data={props.infectionDevelopmentData30Days}
              margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
            >
              <defs>
                <linearGradient id="colorInfection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={props.colors[8]} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={props.colors[8]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={props.colors[7]} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={props.colors[7]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={props.colors[0]} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={props.colors[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis tickFormatter={d => format(new Date(d), 'd.M.')} tick={<CustomizedAxisTick isDate />} dataKey="date" domain={['dataMin', 'dataMax']} type="number" scale="time" />
              <YAxis scale={props.cumulativeChartScale} dataKey="infections" domain={['dataMin', props.dataMaxValue + 10]} unit=" in." tick={{ fontSize: 12 }} name="Tartunnat" />
              <CartesianGrid opacity={0.2} />
              <Tooltip labelFormatter={v => format(new Date(v), 'dd.MM.yyyy')} />
              <Bar fill={props.colors[1]} opacity={0.4} dataKey="infectionsDaily" name="Nakatunuid päevas" unit=" in." />
              <Area type="monotone" unit=" in." name="Nakatunud kokku" dataKey="infections" stroke={props.colors[8]} fillOpacity={1} fill="url(#colorInfection)" />
              <Area type="monotone" unit=" in." name="Taastunud kokku" dataKey="recovered" stroke={props.colors[7]} fillOpacity={1} fill="url(#colorRecovered)" />
              <Area type="monotone" unit=" in." name="Hukkunud kokku" dataKey="deaths" stroke={props.colors[0]} fillOpacity={1} fill="url(#colorDeaths)" />
              <Legend wrapperStyle={{bottom: '10px'}} />
            </ComposedChart>
          </ResponsiveContainer>
        </Block>
)

export default CumulativeGrowthComponent;