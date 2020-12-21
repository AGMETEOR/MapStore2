/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { SAVE_PLANNING_LAYER } from '../actions/urbanisme';

function urbanisme(state = {}, action) {
    switch (action.type) {
    case SAVE_PLANNING_LAYER:
        return {
            ...state,
            layer: action.layer
        };
    default:
        return state;
    }
}

export default urbanisme;
