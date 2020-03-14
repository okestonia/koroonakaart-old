import React from 'react'
import Block from './Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"
import StatBlock from './StatBlock';





const RecoveredCountComponent: React.FC<any> = ({props }) => (
    <Block title="Taastunud" 
        textAlign="center" 
        extraInfo={props.latestRecovered ? `Viimati taastunud ${props.latestRecovered}` : '' } >
        <StatBlock count={props.recoveredCount || 0} helpText={props.latestRecovered ? `Viimati taastunud ${props.latestRecovered}` : '' } />
    </Block>
)

export default RecoveredCountComponent;