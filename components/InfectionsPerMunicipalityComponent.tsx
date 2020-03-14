import React from 'react'
import Block from '../components/Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"





const InfectionsPerMunicipalityComponent: React.FC<any> = ({props }) => (

        <Block title="Nakatunuid maakonniti" /*footer="alltekst" */>
        <ResponsiveContainer width={'100%'} height={350}>
          <BarChart
            data={props.infectionsByDistrict}
            margin={{
              top: 20, right: 30, left: 0, bottom: 85,
            }}
          >
            <XAxis interval={0} dataKey="name" tick={<CustomizedAxisTick />} />
            <YAxis yAxisId="left" unit=" in." dataKey="infections" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="infections" name="Nakatunuid" unit=" in." yAxisId="left">
              {
                props.areas.map((area: string, index: number) => (
                  <Cell key={area} fill={props.colors[index % props.colors.length]} />
                ))
              }
              <LabelList dataKey="infections" position="top" formatter={(e) => e} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Block>
)

export default InfectionsPerMunicipalityComponent;