import React from 'react'
import Block from '../components/Block';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup, Grid } from '@chakra-ui/core';
import CustomizedAxisTick from "./CustomizedAxisTick"
import StatBlock from '../components/StatBlock';





const InfectionsPerMunicipalityComponent: React.FC<any> = ({props }) => (
    <Block title="Tehtud teste"
    textAlign="center">
    <StatBlock count = {853} />
    </Block>
)

export default InfectionsPerMunicipalityComponent;
