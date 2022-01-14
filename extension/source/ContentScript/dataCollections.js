// Demographics data collection
const Demographics = {
  variables: [
    "KeyUSFactsPL94.TOTPOP20", // Total population (2020 Census)
    "KeyUSFacts.DIVINDX_CY", // Diversity Index 2021
    "educationalattainment.EDUCBASECY", // Base pop for educational attainment
    "educationalattainment.BACHDEG_CY", // Attained Bachelor's Degree
    // "populationtotalsPL94.POPDENS20", // Population density per sq mi (2020 Census)
  ],
};

// People At Risk data collection
const AtRisk = {
  variables: [
    "AtRisk.ACSTOTHH", // Total households (2019 ACS)
    "AtRisk.ACSHHDIS", // Total households with 1+ disability (2019 ACS)
    "AtRisk.ACSHHBPOV", // Total households below poverty line (2019 ACS)
    "AtRisk.ACSOVEH0", // Total households with 0 vehicles (2019 ACS)
    "WaterWetlands.FLOODRSKPT", // Percent (of area) at flood risk
  ],
};

// Economy data collection
const Economy = {
  variables: [
    "KeyUSFacts.PCI_CY", // Per capita income (2021 Esri)
    "KeyUSFacts.AVGVAL_CY", // Average home value (2021 Esri)
    "EmploymentUnemployment.UNEMPRT_CY", // Unemployment Rate 2021
  ],
};

export { Demographics, AtRisk, Economy };
