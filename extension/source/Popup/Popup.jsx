import React, { useState, useEffect } from "react";

import "./styles.scss";

const Popup = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get(
      {
        dataCollection: "Demographics",
      },
      (results) => {
        setSettings(results);
      }
    );
  }, []);

  const settingChanged = (value) => {
    chrome.storage.sync.set(
      {
        dataCollection: value,
      } // object
    );
    setSettings({ ...settings, dataCollection: value });
  };

  return (
    <section id="popup">
      <h2>Locately Settings</h2>
      <form>
        <p>
          <h3 htmlFor="dataCollection">I'm interested in...</h3>
          <br />
          <label
            for="Demographics"
            className={`${
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
                e.target.checked && settingChanged("Demographics")
              }
            />
            <i>👨‍👩‍👦‍👦</i>Demographics
          </label>

          <label
            for="AtRisk"
            className={`${settings?.dataCollection === "AtRisk" && "selected"}`}
          >
            <input
              type="radio"
              id="AtRisk"
              name="dataCollection"
              value="AtRisk"
              checked={settings?.dataCollection === "AtRisk"}
              onChange={(e) => e.target.checked && settingChanged("AtRisk")}
            />
            <i>🆘</i>At Risk
          </label>

          <label
            for="Economy"
            className={`${
              settings?.dataCollection === "Economy" && "selected"
            }`}
          >
            <input
              type="radio"
              id="Economy"
              name="dataCollection"
              value="Economy"
              checked={settings?.dataCollection === "Economy"}
              onChange={(e) => e.target.checked && settingChanged("Economy")}
            />
            <i>📈</i>Economy
          </label>
        </p>
      </form>
    </section>
  );
};

export default Popup;
