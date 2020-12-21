/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

export const GET_PLANNING_LAYER = "URBANISME:GET_PLANNING_LAYER";
export const SAVE_PLANNING_LAYER = "URBANISME:SAVE_PLANNING_LAYER";

export function getPlanningLayer({format, url, startPosition, maxRecords, text, options = {}} = {}) {
    return {
        type: GET_PLANNING_LAYER,
        format,
        url,
        startPosition,
        maxRecords,
        text,
        options
    };
}
export function savePlanningLayer(layer) {
    return {
        type: SAVE_PLANNING_LAYER,
        layer
    };
}
