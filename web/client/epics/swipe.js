/**
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Rx from 'rxjs';

import { SELECT_NODE } from '../actions/layers';
import { setActive } from '../actions/swipe';
import { layerSwipeSettingsSelector } from '../selectors/swipe';

/**
 * Ensures that swipeSettings active is changed back to false when a layer is deselected in TOC
 * @memberof epics.swipe
 * @param {external:Observable} action$ manages `SELECT_NODE`
 * @return {external:Observable}
 */
const resetLayerSwipeSettingsEpic = (action$, store) =>
    action$.ofType(SELECT_NODE)
        .switchMap(() => {
            const state = store.getState();
            const swipeSettings = layerSwipeSettingsSelector(state);
            return swipeSettings.active
                ? Rx.Observable.of(setActive(false))
                : Rx.Observable.empty();
        });

export {
    resetLayerSwipeSettingsEpic
};
