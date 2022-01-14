// At Risk data collection
const AtRisk = {
  variables: [
    'AtRisk.ACSTOTHH', // Total households (2020 Census)
    'AtRisk.ACSHHDIS', // Total households with 1+ disability (2019 ACS)
    'AtRisk.ACSHHBPOV', // Total households below poverty line (2019 ACS)
    'AtRisk.ACSOVEH0', // Total households with 0 vehicles (2019 ACS)
  ],
};

// Demographics data collection
const Demographics = {
  variables: [
    'KeyUSFactsPL94.TOTHH20', // Total households (2020 Census)
    'AtRisk.ACSHHDIS', // Total households with 1+ disability (2019 ACS)
    'AtRisk.ACSHHBPOV', // Total households below poverty line (2019 ACS)
    'AtRisk.ACSOVEH0', // Total households with 0 vehicles (2019 ACS)
  ],
};

// AnotherAnother data collection
const AnotherAnotherOne = {
  variables: [
    'KeyUSFactsPL94.TOTHH20', // Total households (2020 Census)
    'AtRisk.ACSHHDIS', // Total households with 1+ disability (2019 ACS)
    'AtRisk.ACSHHBPOV', // Total households below poverty line (2019 ACS)
    'AtRisk.ACSOVEH0', // Total households with 0 vehicles (2019 ACS)
  ],
};

export { AtRisk, Demographics, AnotherAnotherOne };