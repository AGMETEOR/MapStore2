/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import * as Rx from 'rxjs';

import { GET_PLANNING_LAYER, savePlanningLayer } from '../actions/urbanisme';
import { addLayer } from '../actions/catalog';
import { removeNode } from '../actions/layers';
import { TOGGLE_CONTROL } from '../actions/controls';
import { recordToLayer, getCatalogRecords } from '../utils/CatalogUtils';
import { authkeyParamNameSelector } from '../selectors/catalog';
import { urbanismeLayerSelector } from '../selectors/urbanisme';

export default (API) => ({
    toggleLandPlanningEpic: (action$, store) =>
        action$.ofType(TOGGLE_CONTROL)
            .filter(({ control }) => control === "urbanisme")
            .switchMap(() => {
                const state = store.getState();
                const enabled = state.controls && state.controls.urbanisme && state.controls.urbanisme.enabled || false;
                let layer = urbanismeLayerSelector(state);
                layer = {...layer, id: "URNABISME" };
                if (enabled) {
                    return Rx.Observable.of(addLayer(layer, { zoomToLayer: true }));
                }
                return Rx.Observable.of(removeNode(layer.id || layer.title, "layers"));
            }),
    getPlanningLayerEpic: (action$, store) =>
        action$.ofType(GET_PLANNING_LAYER)
            .switchMap(({ format, url, startPosition, maxRecords, text }) => {
                return Rx.Observable.defer(() =>
                    API[format].textSearch(url, startPosition, maxRecords, text)
                ).switchMap((result) => {
                    if (result.error) {
                        // TODO: Handle the resulting error
                        return Rx.Observable.empty();
                    }
                    const state = store.getState();
                    const authkeyParamNames = authkeyParamNameSelector(state);
                    const records = getCatalogRecords("wms", result);
                    const layer = recordToLayer(
                        records[0],
                        "wms",
                        {
                            removeParams: authkeyParamNames,
                            catalogURL: url + "?request=GetRecordById&service=CSW&version=2.0.2&elementSetName=full&id=" +
                            records[0].identifier
                        }
                    );
                    return Rx.Observable.of(savePlanningLayer(layer));
                });
            })
});
