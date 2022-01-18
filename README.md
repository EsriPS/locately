<div align="center">
  <a href="#">
    <img height="150px" src="https://esrips.github.io/locately/logo.jpg" alt="locately" title="locately" />     <a/>
  <h3 align="center">a pocket atlas for your browser</h3>
</div>
 
## 👋 Hey, Hack the Map 5 Judges!

Welcome to **locately**. If you haven't installed it yet, you can find instructions here: https://esrips.github.io/locately.
  
If you're looking to pop the hood and see how locately works, here's a quick overview with some helpful links to source code.
  
### On the frontend...

The user interface of locately is implemented as a browser extension (just supporting Chrome for now). Once installed by an end-user, it works right out-of-the-box thanks to some [**default settings**](), allows end-users [**to set their own preferences**](), and does some pretty interesting things with the DOM, including [**traversing all elements to find text**](), reacting to DOM updates [**via the MutationObserver API**](). 
  
The page's text is sent to the backend for some natural language processing (NLP) goodness ([more on that later](#the-backend-is-pretty-rad-too)), then returned as recognized place entities. The extension takes over again and [**matches all these entities with the DOM nodes where they're mentioned**](), adds some styling to alert users they've been recognized, and waits for user interaction. Finally, when a user interacts with a locately place, the extension [**talks to Wikipedia**]() and ArcGIS Platform ([**see below**](#enter-arcgis-platform)) and [**constructs a beautiful popover with relevant information**]().

### The backend is pretty rad, too...

Once the backend receives text, it uses the SpaCy library to execute NLP. NLP is a form of deep learning that understands linguistic context and dependencies between words to split text into meaningful tokens, and then names them as real-world objects (e.g., person, date, or place). The trained model leveraged by the backend has learned from conversational phone speech, news articles, blogs and more to complete this task. 

From the collection of meaningful tokens identified, just the location-types are isolated. The location tokens are then supplemented with additional spatial information. The ArcGIS Python API is used to Geocode and match location entities with geographic keywords that can be used as inputs to the Geoenrichment API.
  
### Enter ArcGIS Platform...
  
TL;DR: locately uses the following ArcGIS Platform services, APIs, and tools: 
  
  - [~~Geocoding~~](https://developers.arcgis.com/documentation/mapping-apis-and-services/search/geocoding)
  - [GeoEnrichment](https://developers.arcgis.com/documentation/mapping-apis-and-services/demographics/geoenrichment)
  - [Basemaps](https://developers.arcgis.com/documentation/mapping-apis-and-services/maps/basemap-layers)
  - [ArcGIS REST JS](https://developers.arcgis.com/arcgis-rest-js)
  - [ArcGIS API for JS](https://developers.arcgis.com/javascript/latest)
  - [Map Viewer](https://developers.arcgis.com/documentation/mapping-apis-and-services/tools/mapviewer)

locately uses ArcGIS Platform in a few distinct ways:
  
  1. After the backend runs the NLP to identify place entities, ~~it uses the Geocoding service~~ to gather more details [[view code](https://github.com/EsriPS/locately/blob/main/backend/locately_tools.pyt)]
  
  2. Back on the frontend, the browser extension uses both the [Standard geography query](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-query.htm) and [Enrich](https://developers.arcgis.com/rest/geoenrichment/api-reference/enrich.htm) tasks from the GeoEnrichment service in order to fetch data variables for displaying to the end user. All the heavy lifting here is done by one of our favorite ArcGIS Platform APIs, [ArcGIS REST JS](https://developers.arcgis.com/arcgis-rest-js). [[view code](https://github.com/EsriPS/locately/blob/main/extension/source/ContentScript/api.js)]
  
  3. Finally, the map users see in the locately popover is built with another ArcGIS Platform API, the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest). The JSAPI leverages the `geometry` returned by the GeoEnrichment service as well as [ArcGIS Platform's basemap layer service](https://developers.arcgis.com/documentation/mapping-apis-and-services/maps/basemap-layers) to show a contextual map to users. Users can even click the map to go directly to that place in the [Map Viewer](https://developers.arcgis.com/documentation/mapping-apis-and-services/tools/mapviewer)! [[view code](https://github.com/EsriPS/locately/blob/main/docs/map/index.html)]

## Solution Overview
  
![locately solution overview](https://esrips.github.io/locately/locately-overview.png)

## Roadmap
  
![locately roadmap](https://esrips.github.io/locately/locately-roadmap.png)


  
<!-- ## Core Team
  
You are more than welcome to reach out to the core team members listed below, but we highly recommend asking questions or proposing ideas within this repo (via [Issues](https://github.com/EsriPS/innersource-template/issues) or [Discussions](https://github.com/EsriPS/innersource-template/discussions)) so we can keep everything transparent and discoverable!

| Name | Contact |
| -----| ------- |
| Josh Peterson      | <a href="https://teams.microsoft.com/l/chat/0/0?users=jpeterson@esri.com"><img height="50px" src="https://oit.ua.edu/wp-content/uploads/2020/12/Microsoft_Teams_256x256.png"></img></a><a href="mailto:jpeterson@esri.com"><img height="50px" src="https://office365.delaware.gov/wp-content/uploads/sites/135/2019/06/Outlook_256x256-1.png"></img></a> |
| Gavin Rehkemper    | <a href="https://teams.microsoft.com/l/chat/0/0?users=grehkemper@esri.com"><img height="50px" src="https://oit.ua.edu/wp-content/uploads/2020/12/Microsoft_Teams_256x256.png"></img></a><a href="mailto:grehkemper@esri.com"><img height="50px" src="https://office365.delaware.gov/wp-content/uploads/sites/135/2019/06/Outlook_256x256-1.png"></img></a> |
  
Please see the [codeowners](CODEOWNERS) file for the appropriate contacts for each file in this project. -->
