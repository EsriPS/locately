# -*- coding: utf-8 -*-
import arcpy
import spacy
import pandas as pd

from arcgis.geocoding import geocode
from arcgis.gis import GIS


class Toolbox(object):
    def __init__(self):
        """Define the toolbox (the name of the toolbox is the name of the
        .pyt file)."""
        self.label = "test"
        self.alias = "test"

        # List of tool classes associated with this toolbox
        self.tools = [NERtoolset]

class NERtoolset(object):
    def __init__(self):
        """Define the tool (tool name is the name of the class)."""
        self.label = "NERToolbox"
        self.description = "sample"
        self.canRunInBackground = False

    def getParameterInfo(self):
        """Define parameter definitions"""
        input_strings = arcpy.Parameter(
            displayName="String",
            name="input_string",
            datatype="GPString",
            parameterType="Required",
            direction="Input")

        user_name = arcpy.Parameter(
            displayName="Username",
            name="user_name",
            datatype="GPString",
            parameterType="Required",
            direction="Input")

        user_pass = arcpy.Parameter(
            displayName="Password",
            name="user_pass",
            datatype="GPString",
            parameterType="Required",
            direction="Input")

        output_response = arcpy.Parameter(
            displayName="Output Response",
            name="output_response",
            datatype="GPString",
            parameterType="Derived",
            direction="Output")

        params = [input_strings, user_name, user_pass, output_response]
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
        user_name = parameters[1].valueAsText
        user_pass = parameters[2].valueAsText
      
        # load the spacy model
        nlp = spacy.load("en_core_web_lg")
        # process the text
        doc = nlp(text)

        tokens = []

        tokens.extend([[ent.text, ent.start, ent.end, ent.label_, spacy.explain(ent.label_)] for ent in doc.ents])
        df_all = pd.DataFrame(tokens, columns=["Location", "start","end", "label", "meaning"])

        # Just the locations
        loc_codes = ["GPE", "LOC"]
        df_places = df_all.loc[df_all["label"].isin(loc_codes)]

        gis = GIS("https://zaaberg.esri.com/portal",user_name,user_pass)

        # GeoCode the locations
        arcpy.AddMessage(list(df_places.loc[:, ("Location")]))
        locations = [geocode(loc)[0] for loc in list(df_places.loc[:, ("Location")])]

        out_dict = []
        for loc in locations:
            if loc is not None:

                loc_type = loc["attributes"]["Type"]

                if loc_type=="City":
                    out_dict.append(
                        {"city": loc["attributes"]["City"],
                        "state": loc["attributes"]["Region"]})

        arcpy.AddMessage(out_dict)
        arcpy.SetParameterAsText(3, out_dict)

        return