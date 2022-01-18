# -*- coding: utf-8 -*-
import arcpy
import spacy
import pandas as pd
import geopy
import warnings
warnings.filterwarnings("ignore")

class Toolbox(object):
    def __init__(self):
        """Define the toolbox (the name of the toolbox is the name of the
        .pyt file)."""
        self.label = "Toolbox"
        self.alias = "toolbox"

        # List of tool classes associated with this toolbox
        self.tools = [NERtoolset]

class NERtoolset(object):
    def __init__(self):
        """Define the tool (tool name is the name of the class)."""
        self.label = "NER_Toolbox"
        self.description = ""
        self.canRunInBackground = False

    def getParameterInfo(self):
        """Define parameter definitions"""
        input_strings = arcpy.Parameter(
            displayName="String",
            name="input_string",
            datatype="GPString",
            parameterType="Required",
            direction="Input")

        output_response = arcpy.Parameter(
            displayName="Output Response",
            name="output_response",
            datatype="GPString",
            parameterType="Derived",
            direction="Output")

        params = [input_strings, output_response]
        return params

    def isLicensed(self):
        """Set whether tool is licensed to execute."""
        return True

    def updateParameters(self, parameters):
        """Modify the values and properties of parameters before internal
        validation is performed.  This method is called whenever a parameter
        has been changed."""
        return

    def updateMessages(self, parameters):
        """Modify the messages created by internal validation for each tool
        parameter.  This method is called after internal validation."""
        return

    def execute(self, parameters, messages):
        """The source code of the tool."""
        text = parameters[0].valueAsText
        arcpy.AddMessage(text)

        # load the spacy model
        nlp = spacy.load("en_core_web_lg")

        # process the text
        arcpy.AddMessage(text)
        doc = nlp(text)

        tokens = []

        tokens.extend([[ent.text, ent.start, ent.end, ent.label_, spacy.explain(ent.label_)] for ent in doc.ents])
        df_all = pd.DataFrame(tokens, columns=['Location', 'start','end', 'label', 'meaning'])

        # Just the locations
        loc_codes = ['GPE', 'LOC']
        df_places = df_all.loc[df_all['label'].isin(loc_codes)]

        # GeoCode the locations
        locator = geopy.geocoders.Nominatim(user_agent='mygeocoder')
        locations = [locator.geocode(loc, addressdetails=True) for loc in list(df_places['Location'])]

        out_dict = []
        for loc in locations:
            if loc is not None:
                add = loc.raw['address']
                add_parts = list(add.keys())

                if 'city' in add_parts:
                    out_dict.append(
                        {'city': add['city'],
                        'state': add['state']})

                elif 'town' in add_parts:
                    out_dict.append(
                        {'city': add['town'],
                        'state': add['state']})
            else:
                pass

        arcpy.AddMessage(out_dict)
        arcpy.SetParameterAsText(1, out_dict)

    # Uncomment below if you want a JSON file written to the scratch folder.
        # import json
        # import os.path
        # out_json = os.path.join(arcpy.env.scratchFolder, "locations.json")
        # f = open(out_json, "w")
        # json.dump(out_dict, f)
        # f.close()

        return
