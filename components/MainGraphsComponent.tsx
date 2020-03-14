import React from 'react'
import { useMemo, useState } from 'react';
import StatBlock from '../components/StatBlock';
import Block from '../components/Block';
import Copyright from '../components/Copyright';
import Header from '../components/Header';
import NetworkGraph from '../components/NetworkGraph';
import Table from '../components/Table';
import { Area, AreaChart, ReferenceLine, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell, LabelList, Legend } from 'recharts';
import { Flex, Box, Button, ButtonGroup } from '@chakra-ui/core';
import { format } from 'date-fns';
import { Grid } from "@chakra-ui/core";
import { infectionColumns } from '../components/TableColumns';
import CumulativeGrowthComponent from "./CumulativeGrowthComponent"
import InfectionsPerMuncipalityComponent from "./InfectionsPerMunicipalityComponent"
import CustomizedAxisTick from "./CustomizedAxisTick"
import InfectedCountComponent from "./InfectedCountComponent";
import DeathCountComponent from "./DeathCountComponent";
import RecoveredCountComponent from "./RecoveredCountComponent";
import TestedCountComponent from "./TestedCountComponent";
import MapComponent from "./MapComponent";



const MainGraphsComponent: React.FC<any> = ({props }) => (

    <Flex alignItems="center" flexDirection="column" flex="1" width={"100%"} maxWidth="1440px" margin="auto">

    <Header />
    {
        /*
            Counts of infected, dead and recovered.
        */
    }
  <Flex flexWrap="wrap" flexDirection="row" justifyContent="center" alignItems="stretch" flex="1" width={"100%"}>

    <Box width={"25%"} p={3}>
        <InfectedCountComponent props={props}/>

    </Box>
    <Box width={"25%"} p={3}>
        <DeathCountComponent props={props}/>
    </Box>

    <Box width={"25%"}  p={3}>
        <RecoveredCountComponent props={props}/>
    </Box>

    <Box width={"25%"}  p={3}>
        <TestedCountComponent props={props}/>
    </Box>

    </Flex>
    <Flex flexWrap="wrap" flexDirection="row" justifyContent="center" alignItems="stretch" flex="1" width={"100%"}>

        {/*
            Cumulative growth component
        */}
      <Box width={['50%']} p={3}>
        <CumulativeGrowthComponent props={props} />
      </Box>

        {/*
            Infections per municipality component

        */}
      <Box width={['50%']} p={3}>
        <InfectionsPerMuncipalityComponent props={props} />
      </Box>


    </Flex>
    <Flex flexWrap="wrap" flexDirection="row" justifyContent="center" alignItems="stretch" flex="1" width={"100%"}>
        <MapComponent props={props}/>
    </Flex>

    <Copyright />
  </Flex>
)


export default MainGraphsComponent
