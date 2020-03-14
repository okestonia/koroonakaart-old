"""
Generate json data from input
"""

import json
import datetime

def r_split(handle):
    return handle.readline().strip().split(",")[1:]


if __name__ == "__main__":
    loc = "./municipality_total.csv"
    location_data = {}

    with open(loc) as f:
        # first line is dates
        dates = [x+".2020" for x in r_split(f)]
        # Second line is cum. infection count per day (wikipedia)
        cumulative_infections = r_split(f)
        # Total per day
        total_per_day_cumulative = r_split(f)
        # Total per day new
        total_per_day = r_split(f)
        # Get information per location
        for line in f:
            line_data = line.split(",")
            location, count = line_data[0].strip(), int(line_data[1])
            location_data[location] = int(count)
            line_info = location

    # Format of the Json we will be generating
    """
    {"location":{"Tartu", count},
     {},
    "confirmed":[{"id":count_nr, "date":"date", "healthCareDistrict": "Tallinn",
                    "infectionSourceCountry": "CHN", "infectionSource":"unkown"}]
    {"deaths":[...],}
    {"recovered":[...]}
    """
    
    # NOTE: infection source country is currently wrong.
    # As we do not have specific information, will generate based on what we have.
    confirmed = []
    counter = 0
    for day_nr, day in enumerate(dates):
        # Create cases for date
        # Iterate over counties
        # Check if info for data
        if not total_per_day[day_nr]:
            continue
        total_day = int(total_per_day[day_nr])
        # Total day ...
        date_ = datetime.datetime.strptime(day, "%d.%m.%Y").date()
        # Create case for every count. district unknown
        count = int(total_per_day[day_nr])
        for i in range(count):
                confirmed.append({
                    "id": counter,
                    "date": str(date_),
                    "healthCareDistrict": "unknown",
                    "infectionSourceCountry": "unknown",
                    "infectionSource": "unknown"
                    })
                counter += 1
       
    
    deaths = []
    recovered = [] 
    ready_dict = {
            "confirmed": confirmed,
            "recovered": recovered,
            "deaths": deaths,
            "location": location_data
            }


    with open("EstonianData.json", "w") as f:
        f.write(json.dumps(ready_dict))
