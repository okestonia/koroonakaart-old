"""
Generate json data from input
"""

import json
import datetime

def r_split(handle):
    return handle.readline().strip().split(",")[1:]


if __name__ == "__main__":
    loc = "./gfile2.csv"
    location_data = {}



    with open(loc) as f:
        # first line is dates
        dates = [x+".2020" for x in r_split(f)]
        # Second line is cum. infection count per day (wikipedia)
        cumulative_infections_wiki = r_split(f)
        # cumulative from backtracking
        cumulative_infections_bt = r_split(f)
        # Total per day
        total_per_day = r_split(f)
        # Tallinn/Harjumaa
        location_data["Tallinn/Harjumaa"] = r_split(f)
        # Tartu
        location_data["Tartu"] = r_split(f)
        # Võru
        location_data["Voru"] = r_split(f)
        # Saaremaa
        location_data["Saaremaa"] = r_split(f)
        # Johvi
        location_data["Johvi"] = r_split(f)
        # Unknown
        #location_data["Unknown"] = r_split(f)
        # Imported
        imported = r_split(f)
        tests = r_split(f)
        
    max_inf = max(int(x) if x != "" else 0 for x in cumulative_infections_wiki)

    # Format of the Json we will be generating
    """
    {"confirmed":[{"id":count_nr, "date":"date", "healthCareDistrict": "Tallinn",
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
        counted_for = 0
        date_ = datetime.datetime.strptime(day, "%d.%m.%Y").date()
        for location, counts in location_data.items():
            count = int(counts[day_nr]) if counts[day_nr] != "" else 0
            for i in range(count):
                # Add hack to account for overflow... Remove some
                if counted_for == total_day:
                    break
                # Imported vs non-importe
                confirmed.append({
                    "id": counter,
                    "date": str(date_),
                    "healthCareDistrict": location,
                # Assumption that all spreading is done within country now.
                    "infectionSourceCountry": "Est",
                    "infectionSource": "unknown"
                    })
                counter += 1
                counted_for += 1
        
        # What we dont know..
        left = total_day - counted_for
        for i in range(left):
            confirmed.append({
                "id": counter,
                "date": str(date_),
                "healthCareDistrict": "unknown",
                "infectionSourceCountry": "Est",
                "infectionSource": "unknown"
                })
            counter += 1
    # No deaths, no recovered

    print(len(confirmed))
    assert(len(confirmed) == max_inf)
    deaths = []
    recovered = []
   
    ready_dict = {
            "confirmed": confirmed,
            "recovered": recovered,
            "deaths": deaths
            }


    with open("EstonianData.json", "w") as f:
        f.write(json.dumps(ready_dict))
