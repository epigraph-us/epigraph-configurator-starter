var EPIGRAPH_CORE_API = undefined; // Storing a reference to the API directly.

const CONFIG_2_JSON = {
    "structure": [
        {
            "skuID": "Root",
            "guid": "d095c7f6-78fc-4d31-9bfe-1e8c2b5b08ee",
            "isEndNode": false,
            "plugs": {
                "root": {
                    "guid": "228c897e-0cb1-43d4-86ed-23488adb77bc",
                    "isOpen": false,
                    "attachedPlugGUID": "2152f753-3a6e-4a2b-8704-2f083bc0405b",
                    "isReceiverPlug": true
                }
            },
            "overrideVariant": null
        },
        {
            "skuID": "king_base",
            "guid": "180b5c79-4991-48cf-baa3-8ec9b742f26a",
            "isEndNode": false,
            "plugs": {
                "originplug_001": {
                    "guid": "2152f753-3a6e-4a2b-8704-2f083bc0405b",
                    "isOpen": false,
                    "attachedPlugGUID": "228c897e-0cb1-43d4-86ed-23488adb77bc",
                    "isReceiverPlug": false
                },
                "bed_hardware_plug": {
                    "guid": "0e55497b-adb7-4c98-bafb-bdcfea291bb2",
                    "isOpen": false,
                    "attachedPlugGUID": "4751cfb2-0258-4672-a425-a6b1413f5b3d",
                    "isReceiverPlug": true
                }
            },
            "overrideVariant": null
        },
        {
            "skuID": "king_hardware",
            "guid": "207c42ea-1e5c-415a-9069-8edfd9273e0c",
            "isEndNode": true,
            "plugs": {
                "hardware_bed_plug_001": {
                    "guid": "4751cfb2-0258-4672-a425-a6b1413f5b3d",
                    "isOpen": false,
                    "attachedPlugGUID": "0e55497b-adb7-4c98-bafb-bdcfea291bb2",
                    "isReceiverPlug": false
                }
            },
            "overrideVariant": null
        }
    ],
    "globalVariants": {
        "wood": "walnut",
        "hardware": "white"
    }
};


/**
 * A demonstration of how a saved configuration could be loaded from either:
 * 1. A JSON object that is stored and managed by you.
 * 2. An ID that Epigraph stores and fetches for your convenience.
 */
function setupPreConfigurationLoaderThumbnails() {
    // Configuration 01 - Examples of being loaded from Epigraph's database.
    // You would need to discuss this initially with Epigraph's dev team if you'd like to save and load configurations from our Database.
    // The method being used is documented here: https://epg-configurator-client-docs-dot-composite-sun-338620.uc.r.appspot.com/api-docs/Classes/ConfiguratorCoreAPI/index.html#loadscenefromconfigurationididtoload
    const loadconfig1 = document.getElementById("loadconfig1");
    loadconfig1.addEventListener('click', () => {
        const configID = loadconfig1.getAttribute("config-id");
        EPIGRAPH_CORE_API.loadSceneFromConfigurationID(configID);
    });

    // Configuration 03 - Example of being loaded from a JSON object (In the first example, the same JSON object gets internally fetched from Epigraph's database).
    // You are expected to store and fetch this JSON object from a database if you decide to move forward with this approach.
    // The method being used is documented here: https://epg-configurator-client-docs-dot-composite-sun-338620.uc.r.appspot.com/api-docs/Classes/ConfiguratorCoreAPI/index.html#ConfiguratorCoreAPI+loadSceneFromConfiguration
    const loadconfig3 = document.getElementById("loadconfig2");
    loadconfig3.addEventListener('click', () => {
        EPIGRAPH_CORE_API.loadSceneFromConfiguration(CONFIG_2_JSON);
    });
}


function onColourVariantChange(event) {
    const colourVariantElement = event.target;

    const lookCategory = colourVariantElement.getAttribute("look-category");
    const lookVariant = colourVariantElement.getAttribute("look-variant");
    EPIGRAPH_CORE_API.switchGlobalVariant(lookCategory, lookVariant);
}


function setupColourVariantThumbnails() {
    const allColourVariantThumbnails = [...document.getElementsByClassName("colour-thumbnail")];
    for (const colorThumbnail of allColourVariantThumbnails) {
        colorThumbnail.addEventListener("click", onColourVariantChange);
    }
}


function setupViewInYourSpaceButton() {
    const viewInYourSpaceButton = document.getElementById('viewInYourSpace');
    viewInYourSpaceButton.addEventListener("click", () => { EPIGRAPH_CORE_API.viewInYourSpace() });
}


function main() {
    var EPIGRAPH_CONFIGURATOR_WC = document.getElementById("wcEpigraphConfigurator");

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        "coreApi:ready",
        function (event) {
            console.log("Core API successfully initialised.");
            EPIGRAPH_CORE_API = EPIGRAPH_CONFIGURATOR_WC.api.core;

            /** 
             * Setting up the preConfigured scene loading thumbnails.
            */
            setupPreConfigurationLoaderThumbnails();

            // Setting up the Colour Variant Switcher.
            setupColourVariantThumbnails();

            // Setting up View In Your Space
            setupViewInYourSpaceButton();
        }
    );

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        "coreApi:failed",
        function (event) {
            console.error("Failed to initialise core api.");
            console.error(event);

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