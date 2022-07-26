var api_ready = false;
function main() {
    var EPIGRAPH_CONFIGURATOR_WC = document.getElementById("wcEpigraphConfigurator");

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        "core-app-connected",
        function (event) {
            console.log("Core API successfully initialised.");
            api_ready = true;
            /** Start setting up the behaviour of the website 
             * if the configurator was successfully initialised 
             * without any errors
             */
            const loadconfig1 = document.getElementById("loadconfig1");
            loadconfig1.addEventListener('click', () => {
                const configID = loadconfig1.getAttribute("config-id");
                EPIGRAPH_CONFIGURATOR_WC.api.core.loadSceneFromConfigurationID(configID);
            });

            const loadconfig2 = document.getElementById("loadconfig2");
            loadconfig2.addEventListener('click', () => {
                const configID = loadconfig2.getAttribute("config-id");
                EPIGRAPH_CONFIGURATOR_WC.api.core.loadSceneFromConfigurationID(configID);
            });

            const loadconfig3 = document.getElementById("loadconfig3");
            loadconfig3.addEventListener('click', () => {
                const configID = loadconfig3.getAttribute("config-id");
                EPIGRAPH_CONFIGURATOR_WC.api.core.loadSceneFromConfigurationID(configID);
            });

            const redVariantBtn = document.getElementById("redVariantBtn");
            redVariantBtn.addEventListener('click', () => {
                const lookCategory = redVariantBtn.getAttribute("look-category");
                const lookVariant = redVariantBtn.getAttribute("look-variant");
                EPIGRAPH_CONFIGURATOR_WC.api.core.switchGlobalVariant(lookCategory, lookVariant);
            });

            const blackVariantBtn = document.getElementById("blackVariantBtn");
            blackVariantBtn.addEventListener('click', () => {
                const lookCategory = blackVariantBtn.getAttribute("look-category");
                const lookVariant = blackVariantBtn.getAttribute("look-variant");
                EPIGRAPH_CONFIGURATOR_WC.api.core.switchGlobalVariant(lookCategory, lookVariant);
            });

        }
    );

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        "coreApi:failed",
        function (event) {
            console.error("Failed to initialise core api.");
            api_ready = false;
            /** Gracefully exit and probably show a modal to the user 
             * with a proper reasoning for the API to not initialise. 
             * This could be a hardware limitation too and 
             * not just a problem with the configurator web component
             */
            // EPIGRAPH_CONFIGURATOR_WC.api.< anyMethodFromTheApi > ();
        }
    );
}


main();