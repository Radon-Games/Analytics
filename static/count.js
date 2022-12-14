// @ts-nocheck

// https://stackoverflow.com/a/4585031/14635947
(function(history){
  var pushState = history.pushState;
  history.pushState = function(state) {
    if (typeof history.onpushstate == "function") {
      history.onpushstate(arguments);
    }
    return pushState.apply(history, arguments);
  };
})(window.history);

(() => {
  const ws = new WebSocket(`wss://${location.host}/ws`);
  const views = new Map();

  ws.addEventListener("open", () => {
    count();

    [history.onpushstate, window.onpopstate] = new Array(2).fill(() => {
      setTimeout(() => {
        count();
      }, 1);
    });
  });

  function count () {
    const viewId = uuidv4();
    const view = new View(viewId);
    views.set(viewId, view);
    view.send();
  }

  class View {
    viewId;
    applicationId;
    userId;
    sessionId;
    url;
    referrer;
    pageTitle;
    language;
    loadingTime;
    memory;

    constructor (id) {
      this.viewId = id || uuidv4();
      this.applicationId = window._R.applicationId;
      this.userId = getUserId();
      this.sessionId = getSessionId();
      this.url = location.href;
      this.referrer = document.referrer;
      this.pageTitle = document.title;
      this.language = navigator.language;
      this.loadingTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
      this.dataTransfer = performance.getEntriesByType("resource").reduce((acc, curr) => {
        if (!curr.transferSize) return;
        return acc + curr.transferSize;
      }, 0);
      this.memory = performance.memory.usedJSHeapSize;
    }

    send () {
      if (views.length === 0) {
        ws.send(JSON.stringify(["close"]))
      }
      ws.send(JSON.stringify(["view", Object.assign({}, this)]));
    }
  }

  function getUserId () {
    const userId = localStorage.getItem("userId");
    if (userId) return userId;
    const newUserId = uuidv4();
    localStorage.setItem("userId", newUserId);
    return newUserId;
  }

  function getSessionId () {
    const sessionId = sessionStorage.getItem("sessionId");
    if (sessionId) return sessionId;
    const newSessionId = uuidv4();
    sessionStorage.setItem("sessionId", newSessionId);
    return newSessionId;
  }

  // https://stackoverflow.com/a/2117523/14635947
  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
})();
