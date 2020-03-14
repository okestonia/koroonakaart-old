import React from 'react'
import Block from '../components/Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"
import StatBlock from '../components/StatBlock';





const InfectionsPerMunicipalityComponent: React.FC<any> = ({props }) => (
    <Block title="Kinnitatud haigusjuhtu" textAlign="center" extraInfo={`Uued nakatumised täna ${props.infectionsToday} in.`}
            footer={`Viimati nakatunud ${props.latestInfection} (${props.latestInfectionDistrict})`}>
        <StatBlock count={props.confirmedCount} helpText={`Uusi nakatunuid täna: ${props.infectionsToday} in.`} />
    </Block>
)

export default InfectionsPerMunicipalityComponent;
