/*
* Copyright 2020, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

export const layerSwipeSettingsSelector = (state) => state.swipe && state.swipe || { active: false };
export const spyModeSettingsSelector = state => state?.swipe?.spy || { radius: 80 };
export const swipeModeSettingsSelector = state => state?.swipe?.swipe || { direction: 'cut-vertical' };
export const swipeToolCurrentModeSelector = state => state?.swipe?.mode || "swipe";

export const swipeToolConfigurationSelector = (state) => {
    return {
        mode: swipeToolCurrentModeSelector(state),
        spy: spyModeSettingsSelector(state),
        swipe: swipeModeSettingsSelector(state)
    };
};

export default {
    layerSwipeSettingsSelector,
    spyModeSettingsSelector,
    swipeModeSettingsSelector,
    swipeToolConfigurationSelector
};
