import { format, sub, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import groupBy from 'lodash.groupby'
import sortBy from 'lodash.sortby'
import ExponentialRegression from 'ml-regression-exponential'
import { Confirmed, Recovered, Deaths } from '../pages';

// Map data to show development of infections
export const colors = [
  '#003f5c',
  '#2fab8e',
  '#665191',
  '#a05195',
  '#d45087',
  '#f95d6a',
  '#ff7c43',
  '#ffa600',
  '#ee2320',
];

export const healtCareDistricts = [
  { name: 'Harjumaa', people: 598059 },
  { name: 'Tartumaa', people: 152977 },
  { name: 'Ida-Virumaa', people: 136240 },
  { name: 'Lääne-Virumaa', people: 59325 },
  { name: 'Pärnumaa', people: 85938 },
  { name: 'Viljandimaa', people: 46371 },
  { name: 'Raplamaa', people: 33311 },
  { name: 'Võrumaa', people: 35782 },
  { name: 'Saaremaa', people: 33108 },
  { name: 'Jõgevamaa', people: 28734 },
  { name: 'Järvamaa', people: 30286 },
  { name: 'Valgamaa', people: 28370 },
  { name: 'Põlvamaa', people: 25006 },
  { name: 'Läänemaa', people: 20507 },
  { name: 'Hiiumaa', people: 9387 },
  { name: 'Tallinn', people: 434562 },
  { name: 'Tartu', people: 96974 },
  { name: 'Pärnu', people: 50643 },
  { name: 'Narva', people: 55249 },
];

const peopleTotal = healtCareDistricts.reduce((acc, curr) => curr.people + acc, 0);

interface InfectionDevelopmentDataItem {
  date: number;
  infections: number;
  deaths: number;
  recovered: number;
  infectionsDaily: number;
};

interface InfectionDevelopment60DaysDataItem {
  date: number;
  infections: number | null;
};

interface InfectionDevelopmentDataObj {
  prediction60Days: InfectionDevelopment60DaysDataItem[];
  today: number;
}


/**
 * Data extraction for growth chart.
 * @param confirmed 
 * @param recovered 
 * @param deaths 
 */
export const getTimeSeriesData = (confirmed: Confirmed[], recovered: Recovered[], deaths: Deaths[]): {
  infectionDevelopmentData: InfectionDevelopmentDataItem[]
  infectionDevelopmentData30Days: InfectionDevelopmentDataItem[]
} => {

  const sortedData = sortBy(confirmed, 'date').map(item => ({ ...item, dateString: format(new Date(item.date), 'yyyy-MM-dd') }));
  const sortedDataRecoverd = sortBy(recovered, 'date').map(item => ({ ...item, dateString: format(new Date(item.date), 'yyyy-MM-dd') }));
  const sortedDataDeaths = sortBy(deaths, 'date').map(item => ({ ...item, dateString: format(new Date(item.date), 'yyyy-MM-dd') }));

  // Get maximum date
  const end_date = new Date(sortedData[sortedData.length - 1].date)

  const max_dates = [sortedData[sortedData.length-1], sortedDataRecoverd[sortedDataRecoverd.length-1], sortedDataDeaths[sortedDataDeaths.length-1]];
  const maximumDates=max_dates.sort().filter(elm=>elm);
  const maximumDate = maximumDates[maximumDates.length - 1].dateString;
  const daysIntervalSinceFirstInfection = eachDayOfInterval({ start: new Date(sortedData[0].date), end: new Date(maximumDate) });

  const infectionDevelopmentData: InfectionDevelopmentDataItem[] = []
  daysIntervalSinceFirstInfection.reduce((acc, curr) => {
    const items = sortedData.filter(item => isSameDay(new Date(item.date), curr));
    const itemsRecovered = sortedDataRecoverd.filter(item => isSameDay(new Date(item.date), curr));
    const itemsDeaths = sortedDataDeaths.filter(item => isSameDay(new Date(item.date), curr));
    acc.deaths = acc.deaths + itemsDeaths.length;
    acc.infections = acc.infections + items.length;
    acc.recovered = acc.recovered + itemsRecovered.length;
    
    infectionDevelopmentData.push({date: curr.getTime(), infectionsDaily: items.length,...acc})

    return acc
  }, {infections: 0, deaths: 0, recovered: 0})

  const thirtyDaysAgo = sub(new Date(), { days: 30 });
  const infectionDevelopmentData30Days = infectionDevelopmentData.filter(item => item.date > thirtyDaysAgo.getTime());


  return {
    infectionDevelopmentData,
    infectionDevelopmentData30Days,
  };

}

export const getPredictionData = (confirmed: Confirmed[], deaths: Deaths[], recovered: Recovered[]): InfectionDevelopmentDataObj => {

  const currentData30Days = getTimeSeriesData(confirmed, recovered, deaths).infectionDevelopmentData30Days

  const indexes = currentData30Days.map((d,i) => i + 1);
  const infections = currentData30Days.map(d => d.infections);

  const x = indexes
  const y = infections

  const regression = new ExponentialRegression(x, y);

  const prediction60Days = Array.from(new Array(60)).map((x,i) => {
    const date = new Date(currentData30Days[0].date)

    date.setDate(date.getDate() + i)
    return {date: date.getTime(), infections: Math.round(regression.predict(i)) === 0 ? null : Math.round(regression.predict(i))}
  })

  return { prediction60Days, today: prediction60Days[29].date }

}



export const getInfectionsByDistrictNew = (location: any) => {

  const infectionsByDistrict = Object.entries(location).map((value) => ({
    name: value[0],
    infections: value[1],
    // @ts-ignore
    people: Math.round(healtCareDistricts.find(i => i.name === value[0])?.people / peopleTotal * 100)
  }))

  /**
   const infectionsByDistrictPercentage = Object.entries(groupedData).map((value) => ({
    name: value[0],
    infections: Math.round(value[1] / confirmed.length * 100),
    // @ts-ignore
    people: Math.round(healtCareDistricts.find(i => i.name === value[0])?.people / peopleTotal * 100),
    // @ts-ignore
    perDistrict: Math.round(value[1] / healtCareDistricts.find(i => i.name === value[0])?.people * 100 * 10000) / 10000,
  }))
  */

  const areas = Object.entries(location).map((value) => (value[0]));
  return {
    infectionsByDistrict,
    //infectionsByDistrictPercentage,
    areas
  };
}

export const getInfectionsByDistrict = (confirmed: Confirmed[]) => {
  const groupedData = groupBy(confirmed, 'healthCareDistrict');

  const infectionsByDistrict = Object.entries(groupedData).map((value) => ({
    name: value[0],
    infections: value[1].length,
    // @ts-ignore
    people: Math.round(healtCareDistricts.find(i => i.name === value[0])?.people / peopleTotal * 100)
  }))

  const infectionsByDistrictPercentage = Object.entries(groupedData).map((value) => ({
    name: value[0],
    infections: Math.round(value[1].length / confirmed.length * 100),
    // @ts-ignore
    people: Math.round(healtCareDistricts.find(i => i.name === value[0])?.people / peopleTotal * 100),
    // @ts-ignore
    perDistrict: Math.round(value[1].length / healtCareDistricts.find(i => i.name === value[0])?.people * 100 * 10000) / 10000,
  }))

  const areas = Object.entries(groupedData).map((value) => (value[0]));
  return {
    infectionsByDistrict,
    infectionsByDistrictPercentage,
    areas
  };
}

export const getInfectionsBySourceCountry = (confirmed: Confirmed[]) => {
  const groupedData = groupBy(confirmed, 'infectionSourceCountry');

  const infectionsBySourceCountry = Object.entries(groupedData).map((value) => ({
    name: value[0] === 'null' ? 'Ei tiedossa' : value[0],
    infections: value[1].length
  }))

  const areas = Object.entries(groupedData).map((value) => (value[0]));
  return {
    infectionsBySourceCountry,
    areas
  };
}

const getGroup = (infection: Confirmed, confirmed: Confirmed[]): string | null => {
  if (typeof infection.infectionSource === 'number') {
    const item = confirmed.find(i => Number(i.id) === infection.infectionSource);
    if (item) {
      if (typeof item.infectionSource === 'number') {
        return getGroup(item, confirmed);
      }
      if (item.infectionSourceCountry) {
        return item.infectionSourceCountry;
      }
      return null;
    }
  }
  return infection.infectionSourceCountry;
}

export const getInfectionsToday = (confirmed: Confirmed[]) => {
  const infectionsToday = confirmed.filter(infection => isToday(new Date(infection.date)));
  return infectionsToday.length || 0;
}

/**
 * Find last day we have information for, get how many infections confirmed on that day.
 * @param confirmed cases json in a list
 */
export const getLastInfectionDayData = (confirmed: Confirmed[]) => {
  // Find maximum date out of all infections
  //console.log(confirmed);
  let maximumDate=sortBy(confirmed, 'date').map(item => ({ ...item, dateString: format(new Date(item.date), 'yyyy-MM-dd') }))[confirmed.length - 1].dateString;
  // Filter out cases where it is the final day with information
  console.log(maximumDate);
  const lastInfections = confirmed.filter(infection => isSameDay(new Date(infection.date), new Date(maximumDate)));

  return {
    infections: lastInfections.length || 0,
    date: maximumDate
  }
}


export const getNetworkGraphData = (confirmed: Confirmed[]) => {

  const infectionSources = Array.from(new Set(confirmed.filter(i => typeof i.infectionSource === 'number').map(inf => inf.infectionSource)));

  const uniqueCountries = Array.from(new Set(confirmed.filter(i => !!i.infectionSourceCountry).map(inff => inff.infectionSourceCountry)));

  const allNodes = confirmed.map((infection, index) => ({
    index: index + 1,
    ...infection,
    id: Number(infection.id),
    label: `#0${index + 1}`,
    // group: getGroup(infection, confirmed),
    color: `${colors[uniqueCountries.indexOf(infection.infectionSourceCountry)]}`,
  }));
  const nodes = allNodes.filter(i => infectionSources.includes(i.id) || typeof i.infectionSource === 'number');
  // @ts-ignore
  const edges = allNodes.map(i => ({
    from: typeof i.infectionSource === 'number' ? i.infectionSource : i.infectionSourceCountry,
    to: i.id,
  }));
  const filteredNodes = allNodes.filter(i => !!i.infectionSourceCountry || typeof i.infectionSource === 'number');
  // @ts-ignore
  uniqueCountries.map((country, index) => filteredNodes.push({ id: country, label: country, color: `${colors[uniqueCountries.indexOf(country)]}` }))
  return {
    nodes: filteredNodes,
    edges
  };
}
