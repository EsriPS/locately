import { request } from '@esri/arcgis-rest-request';

/*
 * Query Wikipedia for a page about our place
 */
const searchWikipedia = async (searchQuery) => {
  // Query wikipedia for a page matching our place
  const infoResponse = await request(`https://en.wikipedia.org/w/api.php?action=query&list=search&prop=infoResponse&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${searchQuery}`);
  
  // Get the page returned from wikipedia
  const page = infoResponse.query.search[0];

  // Get the title of the page so we can fetch the image
  const title = page.title.replace(" ", "_")
  
  // Fetch the image for the wikipedia page we found
  const imageResponse = await request(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&origin=*&piprop=original&titles=${title}`);
  const imageInfo = imageResponse.query.pages[Object.keys(imageResponse.query.pages)[0]];
  const imageUrl = imageInfo.original.source;

  // Set properties to send back to the UI
  const pageUrl = `https://en.wikipedia.org/wiki/${page.title.replace(" ", "_")}`;
  const snippet = page.snippet;
  const wpInfo = { pageUrl, imageUrl, snippet };

  return wpInfo;
};

export { searchWikipedia };
