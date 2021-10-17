export function getXMLData(xml: string, bracket: string) {
  const xmlDoc = new DOMParser().parseFromString(xml, "text/xml");

  return xmlDoc.getElementsByTagName(bracket)[0].textContent;
}
