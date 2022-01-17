import React, { useState, useEffect } from "react";
import defaultSettings from "../defaultSettings.json";
import "./styles.scss";

import LightThumb from "./assets/navigation_thumb.jpeg";
import DarkThumb from "./assets/streetnight_thumb.jpeg";
import SatelliteThumb from "./assets/satellite_thumb.jpeg";

const Popup = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (results) => {
      setSettings(results);
    });
  }, []);

  const dataCollectionChanged = (value) => {
    chrome.storage.sync.set(
      {
        dataCollection: value,
      } // object
    );
    setSettings({ ...settings, dataCollection: value });
  };

  const basemapChanged = (value) => {
    chrome.storage.sync.set(
      {
        basemap: value,
      } // object
    );
    setSettings({ ...settings, basemap: value });
  };

  return (
    <section id="SettingsPopup">
      <h2>Locately Settings</h2>
      <form>
        <p>
          <h3 htmlFor="dataCollection">I'm interested in...</h3>
          <br />
          <label
            for="Demographics"
            className={`dataCollection-label ${
              settings?.dataCollection === "Demographics" && "selected"
            }`}
          >
            <input
              type="radio"
              id="Demographics"
              name="dataCollection"
              value="Demographics"
              checked={settings?.dataCollection === "Demographics"}
              onChange={(e) =>
                e.target.checked && dataCollectionChanged("Demographics")
              }
            />
            <i>👨‍👩‍👦‍👦</i>Demographics
          </label>

          <label
            for="AtRisk"
            className={`dataCollection-label ${
              settings?.dataCollection === "AtRisk" && "selected"
            }`}
          >
            <input
              type="radio"
              id="AtRisk"
              name="dataCollection"
              value="AtRisk"
              checked={settings?.dataCollection === "AtRisk"}
              onChange={(e) =>
                e.target.checked && dataCollectionChanged("AtRisk")
              }
            />
            <i>🆘</i>At Risk
          </label>

          <label
            for="Economy"
            className={`dataCollection-label ${
              settings?.dataCollection === "Economy" && "selected"
            }`}
          >
            <input
              type="radio"
              id="Economy"
              name="dataCollection"
              value="Economy"
              checked={settings?.dataCollection === "Economy"}
              onChange={(e) =>
                e.target.checked && dataCollectionChanged("Economy")
              }
            />
            <i>📈</i>Economy
          </label>
        </p>

        <p>
          <h3 htmlFor="basemap">Basemap</h3>
          <br />
          <label
            for="arcgis-navigation"
            className={`basemap-label ${
              settings?.basemap === "arcgis-navigation" && "selected"
            }`}
          >
            <input
              type="radio"
              id="arcgis-navigation"
              name="basemap"
              value="arcgis-navigation"
              checked={settings?.basemap === "arcgis-navigation"}
              onChange={(e) =>
                e.target.checked && basemapChanged("arcgis-navigation")
              }
            />
            <span>
              <img src={LightThumb} width="100%" />
              Light
            </span>
          </label>

          <label
            for="arcgis-streets-night"
            className={`basemap-label ${
              settings?.basemap === "arcgis-streets-night" && "selected"
            }`}
          >
            <input
              type="radio"
              id="arcgis-streets-night"
              name="basemap"
              value="arcgis-streets-night"
              checked={settings?.basemap === "arcgis-streets-night"}
              onChange={(e) =>
                e.target.checked && basemapChanged("arcgis-streets-night")
              }
            />
            <span>
              <img src={DarkThumb} width="100%" />
              Dark
            </span>
          </label>

          <label
            for="arcgis-imagery"
            className={`basemap-label ${
              settings?.basemap === "arcgis-imagery" && "selected"
            }`}
          >
            <input
              type="radio"
              id="arcgis-imagery"
              name="basemap"
              value="arcgis-imagery"
              checked={settings?.basemap === "arcgis-imagery"}
              onChange={(e) =>
                e.target.checked && basemapChanged("arcgis-imagery")
              }
            />
            <span>
              <img src={SatelliteThumb} width="100%" />
              Satellite
            </span>
          </label>
        </p>
      </form>
    </section>
  );
};

export default Popup;
