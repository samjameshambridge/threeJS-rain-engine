import Application from "./app.js";

(function () {
  var application;

  function init() {
    var numberOfClouds = 45;
    var rainCount = 15000;

    application = new Application({ numberOfClouds, rainCount });

    application.init();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
