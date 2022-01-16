import React, { useState, useEffect } from "react";
import defaultSettings from "../defaultSettings.json";
import "./styles.scss";

const Popup = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (results) => {
      setSettings(results);
    });
  }, []);

  const settingChanged = (e) => {
    chrome.storage.sync.set(
      {
        dataCollection: e.target.value,
      } // object
    );
    setSettings({ ...settings, dataCollection: e.target.value });
  };

  return (
    <section id="popup">
      <h2>Locately Settings</h2>
      <form>
        <p>
          <label htmlFor="dataCollection">Data Collection</label>
          <br />
          <select
            name="dataCollection"
            id="dataCollection"
            value={settings?.dataCollection}
            onChange={settingChanged}
          >
            <option value="Demographics">Demographics</option>
            <option value="AtRisk">AtRisk</option>
            <option value="Economy">Economy</option>
          </select>
        </p>
      </form>
    </section>
  );
};

export default Popup;
