import { format } from 'date-fns';

export const infectionColumns = [
  {
    Header: 'Jrk',
    accessor: 'index',
    Cell: ({ cell: { value } }: any) => {
      return value
    }
  },
  {
    Header: 'Id',
    accessor: 'id',
    Cell: ({ cell }: any) => {
      return `#0${cell.value}`
    }
      
  },
  {
    Header: 'Kuupäev',
    accessor: 'date',
    minWidth: '20%',
    Cell: ({ cell: { value } }: any) => format(new Date(value), 'dd.MM.yyyy - HH:mm')
  },
  {
    Header: 'Maakond',
    accessor: 'healthCareDistrict',
  },
  {
    Header: 'Päritolumaa',
    accessor: 'infectionSourceCountry',
  },
  {
    Header: 'Nakkuse allikas',
    accessor: 'infectionSource',
    Cell: ({ cell: { value } }: any) => {
      if (value === 'unknown') {
        return 'Ei tea';
      }
      if (value === 'related to earlier') {
        return 'Seotud eelmisega'
      }
      return `#0${value}`
    }
  },
]
