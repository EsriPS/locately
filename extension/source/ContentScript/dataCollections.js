// Demographics data collection
const Demographics = {
  variables: [
    "KeyUSFactsPL94.TOTPOP20", // Total population (2020 Census)
    "KeyUSFacts.DIVINDX_CY", // Diversity Index 2021
    "educationalattainment.EDUCBASECY", // Base pop for educational attainment
    "educationalattainment.BACHDEG_CY", // Attained Bachelor's Degree
    // "populationtotalsPL94.POPDENS20", // Population density per sq mi (2020 Census)
  ],
  attributes: [
    {
      name: "TOTPOP20",
      label: "Total Population (2020)",
      valueType: "COUNT",
    },
    {
      name: "DIVINDX_CY",
      label: "Diversity Index",
      valueType: "INDEX",
    },
    {
      name: "BACHDEG_CY",
      label: "Pop w/ Bachelors Degree",
      renderer: ({ BACHDEG_CY, EDUCBASECY }) => {
        return `${Math.round((BACHDEG_CY/EDUCBASECY)*100)}%`;
      },
    },
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
  attributes: [
    {
      name: "ACSHHDIS",
      label: "Households w/ Disability",
      renderer: ({ ACSHHDIS, ACSTOTHH }) => {
        return `${Math.round((ACSHHDIS / ACSTOTHH) * 100)}%`;
      },
    },
    {
      name: "ACSHHBPOV",
      label: "Households Below Poverty",
      renderer: ({ ACSHHBPOV, ACSTOTHH }) => {
        return `${(ACSHHBPOV / ACSTOTHH) * 100}%`;
      },
    },
    {
      name: "ACSOVEH0",
      label: "Households w/o Vehicle",
      renderer: ({ ACSOVEH0, ACSTOTHH }) => {
        return `${(ACSOVEH0 / ACSTOTHH) * 100}%`;
      },
    },
  ],
};

// Economy data collection
const Economy = {
  variables: [
    "KeyUSFacts.PCI_CY", // Per capita income (2021 Esri)
    "KeyUSFacts.AVGVAL_CY", // Average home value (2021 Esri)
    "EmploymentUnemployment.UNEMPRT_CY", // Unemployment Rate 2021
  ],
  attributes: [
    {
      name: "PCI_CY",
      label: "Per capita income",
      valueType: "CURRENCY",
    },
    {
      name: "AVGVAL_CY",
      label: "Average home value",
      valueType: "CURRENCY",
    },
    {
      name: "UNEMPRT_CY",
      label: "Unemployment Rate",
      valueType: "DECIMAL",
    },
  ],
};

export { Demographics, AtRisk, Economy };
