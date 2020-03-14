import React from 'react'
import Block from './Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"
import StatBlock from './StatBlock';





const InfectionsPerMunicipalityComponent: React.FC<any> = ({props }) => (
    <Block title="Taastunud" 
    textAlign="center" footer={props.latestRecovered ? `Viimati taastunud ${props.latestRecovered} (${props.latestRecoveredDistrict})` : ' '}>
    <StatBlock count={props.recoveredCount || 0} />
    </Block>
)

export default InfectionsPerMunicipalityComponent;