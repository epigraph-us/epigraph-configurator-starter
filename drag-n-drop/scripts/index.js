var EPIGRAPH_CONFIGURATOR_WC, contextMenuContainer;
var EPIGRAPH_CORE_API = undefined; // Storing a reference to the API directly.
const CONFIGURATOR_WC_ID = "wcEpigraphConfigurator";
var CURRENTLY_DRAGGING_ELEM, CURRENTLY_DRAGGING_ELEM_COMPUTED_STYLE = undefined;
var CURRENT_PRODUCT_ID = undefined;
var CURRENTLY_DRAGGING = false;


function populateBuildTab(productData) {
    // This is currently required to remove a dummy product that we create for internal usage.
    // We will look at options to do this at our end in the future to return productData 
    // from the coreApi without an entry for the "Root"
    delete productData["Root"];
    const allProductEntries = Object.keys(productData);
    const productsContainer = document.getElementById("productButtonsContainer");

    for (const productId of allProductEntries) {
        const productElem = document.createElement("img");
        productElem.classList.add("draggable-thumbnail");
        productElem.setAttribute("id", productId);
        const defaultVariantName = productData[productId].defaultVariant;

        // You could even choose the "high" resolution of the thumbnail (if available) 
        // by replacing ".low" with ".high"
        const defaultVariantThumbnail = productData[productId].lookDetails[defaultVariantName]?.thumbnails.low;

        // .getResolvedAssetUrl() is an essential method to resolve all asset paths 
        // coming from the core to their correct values
        productElem.setAttribute("src", EPIGRAPH_CORE_API.getResolvedAssetUrl(defaultVariantThumbnail));
        productElem.setAttribute("draggable", false);

        productsContainer.appendChild(productElem);
    }
}


function startDragging(rawEvent) {
    rawEvent.stopPropagation();
    const e = rawEvent.touches ? rawEvent.touches[0] : rawEvent;

    CURRENTLY_DRAGGING_ELEM.src = e.target.getAttribute("src");
    CURRENT_PRODUCT_ID = e.target.getAttribute("id");

    // This call helps ensure that the dragging element is positioned 
    // at the correct location before being displayed.
    // The reason we send 'rawEvent' and not 'e' is because we need to 
    // stopPropagation on this event
    dragCurrentThumbnail(rawEvent);

    document.addEventListener("mousemove", dragCurrentThumbnail);
    document.addEventListener("touchmove", dragCurrentThumbnail);

    CURRENTLY_DRAGGING_ELEM.classList.add("show");
}


function hasEnteredCanvas(e) {
    const hoveringOverElement = document.elementFromPoint(e.clientX, e.clientY);
    if (hoveringOverElement.getAttribute("id") === CONFIGURATOR_WC_ID) {
        return true;
    }
    else {
        return false;
    }
}


function dragCurrentThumbnail(rawEvent) {
    const e = rawEvent.touches ? rawEvent.touches[0] : rawEvent;
    rawEvent.stopPropagation();

    // Calculating the position for the thumbnail that's being dragged
    CURRENTLY_DRAGGING_ELEM.style.top = `${e.clientY - CURRENTLY_DRAGGING_ELEM_COMPUTED_STYLE.height}px`;
    CURRENTLY_DRAGGING_ELEM.style.left = `${e.clientX - CURRENTLY_DRAGGING_ELEM_COMPUTED_STYLE.width}px`;

    const hasEnteredConfigurator = hasEnteredCanvas(e);
    if (hasEnteredConfigurator === true) {
        if (CURRENTLY_DRAGGING === false) {
            CURRENTLY_DRAGGING = true;
            EPIGRAPH_CORE_API.itemDragStart(CURRENT_PRODUCT_ID);
        }
    }
    else {
        if (CURRENTLY_DRAGGING === true) {
            EPIGRAPH_CORE_API.itemDragEnd();
            CURRENTLY_DRAGGING = false;
        }
    }
}


function setupDraggableThumbnails() {
    CURRENTLY_DRAGGING_ELEM = document.getElementById("currentlyDragging");
    CURRENTLY_DRAGGING_ELEM_COMPUTED_STYLE = CURRENTLY_DRAGGING_ELEM.getBoundingClientRect();
    const allDraggableThumbnails = document.getElementsByClassName("draggable-thumbnail");

    for (const draggableThumbnail of allDraggableThumbnails) {
        draggableThumbnail.addEventListener("mousedown", startDragging);
        draggableThumbnail.addEventListener("touchstart", startDragging);
    }

    document.addEventListener(
        "mouseup",
        () => {
            if (CURRENT_PRODUCT_ID !== undefined) {
                EPIGRAPH_CORE_API.itemDragEnd();
                CURRENT_PRODUCT_ID = undefined;
                CURRENTLY_DRAGGING_ELEM.classList.remove("show");
                CURRENTLY_DRAGGING = false;
                document.removeEventListener("mousemove", dragCurrentThumbnail);
            }
        }
    );

    document.addEventListener(
        "touchend",
        () => {
            if (CURRENT_PRODUCT_ID !== undefined) {
                EPIGRAPH_CORE_API.itemDragEnd();
                CURRENT_PRODUCT_ID = undefined;
                CURRENTLY_DRAGGING_ELEM.classList.remove("show");
                CURRENTLY_DRAGGING = false;
                document.removeEventListener("touchmove", dragCurrentThumbnail);
            }
        }
    );
}


// ----------------- CUSTOM CONTEXT MENU IMPLEMENTATION -----------------
var contextMenuVisible = false;

/**
 * Function to handle what happens when the context menu is to be displayed.
 */
function showContextMenu() {
    contextMenuContainer.classList.add("show-context-menu");
}

/**
 * Function to handle what happens when the context menu is to be hidden.
 */
function hideContextMenu() {
    contextMenuContainer.classList.remove("show-context-menu");
}

/**
 * Overrides the variant in scene.
 * 
 * @param {HTMLElement} elem Expects the button element where this method was called from.
 *              Also, that button must contain a value attribute which contains 
 *              the guid and the variant name concatenated using the separator "<@>"
 */
function overrideVariant(elem) {
    const elementValue = elem.getAttribute("value");
    const splitValue = elementValue.split("<@>");
    EPIGRAPH_CORE_API.overrideItemMaterialByGuid(splitValue[0], splitValue[1])
}

/**
 * Clears out all existing thumbnails from the context menu.
 */
function flushContextMenu() {
    const allThumbnails = [...contextMenuContainer.getElementsByClassName("context-menu-thumbnail")];

    for (const entry of allThumbnails) {
        entry.remove();
    }
}

/**
 * Populates the context menu with provided details that we get from the event.
 * 
 * @param {*} details Details that were retrieved from the EPIGRAPH_CORE_API.EVENTS.UI.ContextMenu_Show event.
 */
function populateContextMenu(details) {
    const contextMenuThumbnailsContainer = contextMenuContainer.querySelector("#contextMenuThumbnailsContainer");
    details = details.data.primary;

    const looks = [...details.data.itemData.looks.sort()];

    const contextMenuTargetItemElement = contextMenuContainer.querySelector("#contextMenuTargetItem");
    contextMenuTargetItemElement.innerHTML = details.name;

    for (const entry of looks) {
        const contextMenuThumbnail = `
        <div class="context-menu-thumbnail" value="${details.guid}<@>${entry}" onclick="overrideVariant(this)">
          <img src="https://via.placeholder.com/150" style="height: 80%;" alt="">
          <div style="height: 20%;">${entry}</div>
        </div>
        `;

        contextMenuThumbnailsContainer.insertAdjacentHTML("beforeEnd", contextMenuThumbnail);
    }
}

/**
 * Sets up everything required to show a custom context menu when an item is clicked in the scene.
 */
function setupCustomContextMenu() {
    contextMenuContainer = document.getElementById("contextMenuContainer");

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        EPIGRAPH_CORE_API.EVENTS.UI.ContextMenu_Show,
        (e) => {
            if (contextMenuVisible === false) {
                contextMenuVisible = true;
            }

            // Clear existing data from the context menu.
            flushContextMenu();
            // Populate the context menu with new data.
            populateContextMenu(e);
            // Finally display the context menu.
            // You may implement whatever you wish to within this function call.
            showContextMenu();
        }
    );

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        EPIGRAPH_CORE_API.EVENTS.UI.ContextMenu_Hide,
        (e) => {
            contextMenuVisible = false;
            // Finally display the context menu.
            // You may implement whatever you wish to within this function call.
            hideContextMenu();
        }
    );


    const contextMenuCloseButton = contextMenuContainer.querySelector("#contextMenuCloseButton");
    contextMenuCloseButton.onclick = () => {
        EPIGRAPH_CORE_API.closeContextMenu()
    };
}

/**
 * Entry point for the entire script.
 */
async function main() {
    EPIGRAPH_CONFIGURATOR_WC = document.getElementById(CONFIGURATOR_WC_ID);

    EPIGRAPH_CONFIGURATOR_WC.addEventListener(
        "coreApi:ready",
        function (event) {
            console.log("Core API successfully initialised.");
            EPIGRAPH_CORE_API = EPIGRAPH_CONFIGURATOR_WC.api.core;

            /**
             * Populating all the entries within the build tab
             */
            populateBuildTab(EPIGRAPH_CORE_API.productData);

            /** 
             * Setting up the draggable thumbnails.
            */
            setupDraggableThumbnails();

            /**
             * Set up the custom context menu implementation. 
             * Please make sure to ask the Epigraph team to disable our 
             * default context menu to avoid having multiple context menus.
             */
            setupCustomContextMenu();
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