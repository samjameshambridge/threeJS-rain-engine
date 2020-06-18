import Application from "./app";
import { options } from "./options";

(function () {
  function init() {
    var application = new Application(options);

    application.init();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
