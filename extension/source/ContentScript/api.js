import { ApiKey } from "@esri/arcgis-rest-auth";
import {
  getGeography,
  queryDemographicData,
} from "@esri/arcgis-rest-demographics";

import { Demographics } from "./dataCollections";
import { places } from "./mockApi.json";

// We'll use an ArcGIS Platform API Key to authenticate
const authentication = new ApiKey({
  key: process.env.API_KEY,
});

/*
 * Send text to LocateXT-like API and get back "place" objects
 */
const fetchPlaces = async (text) => {
  // TODO: Replace with actual API request
  return await places;
};

/*
 * Get a "Standard Geogaphy" object from ArcGIS to be used as studyAreas
 */
const findStudyArea = async ({ city, state }) => {
  try {
    // Assemble `geographyQuery` param from place object
    const geographyQuery = `${city} AND MajorSubdivisionAbbr:${state}`;

    // Send request for standard geographies to ArcGIS
    const studyArea = await getGeography({
      sourceCountry: "US",
      geographyLayers: ["US.Places"],
      returnGeometry: true,
      featureLimit: 5,
      authentication,
      geographyQuery,
    });

    // Pull the feature out of the response and return it
    return studyArea?.results[0]?.value?.features;
  } catch (error) {
    console.error(error);
  }
};

/*
 * Send Standard Geography to ArcGIS to be enriched
 */
const enrich = async (studyArea) => {
  // Assemble the `studyAreas` param
  const studyAreas = [
    {
      sourceCountry: "US",
      layer: "US.Places",
      ids: [studyArea[0].attributes.AreaID],
      attributes: studyArea[0].attributes,
    },
  ];

  try {
    const response = await queryDemographicData({
      studyAreas,
      analysisVariables: Demographics.variables,
      authentication,
    });

    // geometry: studyArea[0].geometry,
    return response.results[0].value.FeatureSet[0];
  } catch (error) {
    console.error(error);
  }
};

export { fetchPlaces, findStudyArea, enrich };
