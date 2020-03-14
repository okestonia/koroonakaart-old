import React from 'react'
import Block from '../components/Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"
import StatBlock from '../components/StatBlock';




const InfectionsPerMunicipalityComponent: React.FC<any> = ({props }) => (
    <Block title="Hukkunuid" textAlign="center" 
    footer={props.latestDeath ? `Viimati surnud ${props.latestDeath} (${props.latestDeathDistrict})` : 'Ei ole surnuid'}>
    <StatBlock count={props.deathCount || 0} />
    </Block>
)

export default InfectionsPerMunicipalityComponent;
