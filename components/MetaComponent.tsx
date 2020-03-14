import React from 'react'
import Head from 'next/head';


interface MetaProps {
    confirmedCount: number,
    recoveredCount: number,
    deathCount: number;
  }

const MetaComponent: React.FC<MetaProps> = ({ confirmedCount, recoveredCount, deathCount }) => (
    <Head>
        <title>Koroonakaart - Nakatunud: {confirmedCount|| 0} -
            taastunud: {recoveredCount || 0} - surnud: {deathCount || 0}</title>
        <meta name="description" content={`Koroona viirus Eestis - Nakatunud: ${confirmedCount || 0} - taastunud: ${recoveredCount || 0} - hukkunud: ${deathCount || 0}`} />
        <meta property="og:title" content={`Eesti koroonakaart`} />
        <meta property="og:description" content={`Koroona viirus Eestis - Nakatunud: ${confirmedCount || 0} - taastunud: ${recoveredCount || 0} - hukkunud: ${deathCount || 0}`} />
        <meta property="og:site_name" content="Koroonakaart" />
        <meta property="og:locale" content="et_ET" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/corona-virus.png" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1928" />
        <meta property="og:url" content="http://koroonakaart.ee/" />
    </Head>
)


export default MetaComponent
