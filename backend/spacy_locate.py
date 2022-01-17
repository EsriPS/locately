"""
Dependencies:

conda install -c conda-forge spacy
python -m spacy download en_core_web_lg
pip install -U srsly
pip install geopy

"""

import json
import spacy
import pandas as pd
import geopy 
import matplotlib.pyplot as plt
import requests
from bs4 import BeautifulSoup #Parses HTML content
from geopy.extra.rate_limiter import RateLimiter
import json



url = "https://www.cnn.com/travel/article/experts-guide-to-great-american-road-trips/index.html"
data = requests.get(url)

#Parse out HTML tags and clean up newlines
soup = BeautifulSoup(data.content, 'html.parser')
text = soup.get_text()
text = text.strip().replace("\n", " ").replace("\r", " ")

# load the spacy model
nlp = spacy.load("en_core_web_lg")

# process the text
doc = nlp(text)

tokens = []

tokens.extend([[ent.text, ent.start, ent.end, ent.label_, spacy.explain(ent.label_)] for ent in doc.ents ])
df_all = pd.DataFrame(tokens, columns=['Location', 'start','end', 'label', 'meaning'])


# Just the locations

loc_codes = ['GPE', 'LOC']

df_places = df_all.loc[df_all['label'].isin(loc_codes)]

locator = geopy.geocoders.Nominatim(user_agent='mygeocoder')
geocode = RateLimiter(locator.geocode, min_delay_seconds=1)

locations = [ locator.geocode(loc, addressdetails=True) for loc in list(df_places['Location'])]

locations_raw = []
cities = []
states = []
countries = []

for loc in locations:
    if loc is not None:
        add = loc.raw['address']
        locations_raw.append(add)
        add_parts = list(add.keys())
        
        if 'city' in add_parts:
            cities.append(add['city'])
        else:
            cities.append('')

        if 'state' in add_parts:
            states.append(add['state'])
        else:
            states.append('')

        if 'county' in add_parts:
            countries.append(add['country'])
        else:
            countries.append('')

    else:
        locations_raw.append('')
        cities.append('')
        states.append('')
        countries.append('')


df_places['add_raw'] = locations_raw
df_places['city'] = cities
df_places['state'] = states
df_places['country'] = countries

# write the us cities to json file

df_export = df_places.loc[(df_places['country'] == 'United States') & (df_places['state'] != '') & (df_places['city'] != '')]

out_dict = []

for idx, row in df_export.iterrows():
    out_dict.append(
        {'city': row['city'],
        'state': row['state']}
    )

out_json = r"C:\Projects\HTM_2022\locately\locations.json"

f = open(out_json, "w")
json.dump(out_dict, f)
f.close()