// @ts-nocheck

(() => {
  function getApplications () {
    post("/api/applications", {}, {
      "Authorization": `Basic ${localStorage.getItem("token")}`
    });
  }

  function post (endpoint, data, headers) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.setRequestHeader("Content-Type", "application/json");
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.send(JSON.stringify(data));
  }
})();