function main() {
    const EPIGRAPH_CONFIGURATOR_WC = document.getElementById("wcEpigraphConfigurator");

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        "coreApi:ready",
        function (event) {
            console.log("Core API successfully initialised.");

            /** Start setting up the behaviour of the website 
             * if the configurator was successfully initialised 
             * without any errors
             */
            EPIGRAPH_CONFIGURATOR_WC.api.< anyMethodFromTheApi > ();
        }
    );

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        "coreApi:failed",
        function (event) {
            console.error("Failed to initialise core api.");

            /** Gracefully exit and probably show a modal to the user 
             * with a proper reasoning for the API to not initialise. 
             * This could be a hardware limitation too and 
             * not just a problem with the configurator web component
             */
            EPIGRAPH_CONFIGURATOR_WC.api.< anyMethodFromTheApi > ();
        }
    );
}