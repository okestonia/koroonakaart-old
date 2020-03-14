import React from 'react'
import Block from '../components/Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"
import StatBlock from '../components/StatBlock';




const DeathCountComponent: React.FC<any> = ({props }) => (
    <Block title="Hukkunud" textAlign="center"
    extraInfo={props.latestDeath ? `Viimati hukkunud ${props.latestDeath} (${props.latestDeathDistrict})` : ''}>
    <StatBlock count={props.deathCount || 0} helpText={props.latestDeath ? `Viimati hukkunud ${props.latestDeath} (${props.latestDeathDistrict})` : ''}  />
    </Block>
)

export default DeathCountComponent;