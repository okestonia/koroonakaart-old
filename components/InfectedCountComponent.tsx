import React from 'react'
import Block from '../components/Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"
import StatBlock from '../components/StatBlock';





const InfectedCountComponent: React.FC<any> = ({props }) => (
    <Block title="Kinnitatud haigusjuhud" textAlign="center" extraInfo={`Viimased nakatumised ${props.lastInfectionsData.infections} in. (${props.lastInfectionsData.date})`} 
            /* footer={`Viimati nakatunud ${props.latestInfection} (${props.latestInfectionDistrict})` }*/ >
        <StatBlock count={props.confirmedCount} helpText={`Viimased nakatumised ${props.lastInfectionsData.infections} in. (${props.lastInfectionsData.date})`} />
    </Block>
)

export default InfectedCountComponent;
