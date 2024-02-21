async function getFile(link: string, bulkOrderID: string, type: string) {
  function downloadFile(url: string, filename: string): void {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  try {
    const response = await fetch(link);
    const contents = await response.blob();
    const url = URL.createObjectURL(contents);
    downloadFile(url, `${bulkOrderID}.${type}`);
    console.log(`Status: ${response.status}`);
    return response.status;
  } catch (error) {
    console.log(`%cReq failed: ${JSON.stringify(error)}`, "color: red");
    return new Error(`Req failed: ${JSON.stringify(error)}`);
  }
}
