import Application from "./app.js";

(function () {
  var application;

  function init() {
    var numberOfClouds = 25;
    var rainCount = 15000;

    application = new Application({ numberOfClouds, rainCount });

    application.init();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
