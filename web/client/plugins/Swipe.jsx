/*
* Copyright 2020, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isObject, isString } from 'lodash';
import { Row, Col, Nav, NavItem, Glyphicon } from 'react-bootstrap';

import { createPlugin } from '../utils/PluginsUtils';
import { hideLayerSwipeSettings } from '../actions/layers';
import { mapLayoutValuesSelector } from '../selectors/maplayout';
import { elementSelector, layerSwipeSettingsSelector } from '../selectors/layers';
import { currentLocaleSelector } from '../selectors/locale';

import DockablePanel from '../components/misc/panels/DockablePanel';
import Toolbar from '../components/misc/toolbar/Toolbar';
import tooltip from '../components/misc/enhancers/tooltip';
import Message from '../components/I18N/Message';

const NavItemT = tooltip(NavItem);

const MapSwipeSupport = () => {
    return (<div>Swipe too</div>);
};

const MapSwipeSettingsPanel = (props) => {
    const { dockStyle, element, currentLocale, swipeSettings, onHideSwipeSettings, onSave } = props;
    const toolbarButtons = [
        {
            glyph: 'floppy-disk',
            tooltipId: 'save',
            visible: !!onSave,
            onClick: () => onSave()
        }];
    const tabs = [
        {
            id: 'swipe',
            titleId: 'swipe',
            tooltipId: 'swipe',
            glyph: 'wrench',
            visible: true,
            Component: () => <div>SWIPE SETTINGS HERE</div>
        }];

    const [activeTab, onSetTab] = useState('swipe');
    const header = [
        <Row key="ms-toc-settings-toolbar" className="text-center">
            <Col xs={12}>
                <Toolbar
                    btnDefaultProps={{ bsStyle: 'primary', className: 'square-button-md' }}
                    buttons={toolbarButtons}/>
            </Col>
        </Row>,
        ...(tabs.length > 1 ? [<Row key="ms-toc-settings-navbar" className="ms-row-tab">
            <Col xs={12}>
                <Nav bsStyle="tabs" activeKey={activeTab} justified>
                    {tabs.map(tab =>
                        <NavItemT
                            key={'ms-tab-settings-' + tab.id}
                            tooltip={<Message msgId={tab.tooltipId}/> }
                            eventKey={tab.id}
                            onClick={() => {
                                onSetTab(tab.id);
                                if (tab.onClick) { tab.onClick(); }
                            }}>
                            <Glyphicon glyph={tab.glyph}/>
                        </NavItemT>
                    )}
                </Nav>
            </Col>
        </Row>] : [])];
    console.log("HEADER", header);
    return (
        <div>
            <DockablePanel
                open={swipeSettings.show}
                glyph="transfer"
                width={500}
                style={dockStyle}
                title={element.title && isObject(element.title) && (element.title[currentLocale] || element.title.default) || isString(element.title) && element.title || ''}
                dock
                position="left"
                onClose={onHideSwipeSettings}
                header={header}>
                {tabs.filter(tab => tab.id && tab.id === activeTab).filter(tab => tab.Component).map(tab => (
                    <tab.Component />
                ))}
            </DockablePanel>
        </div>);
};

const mapSwipeSelector = createSelector([
    state => mapLayoutValuesSelector(state, {height: true}),
    elementSelector,
    currentLocaleSelector,
    layerSwipeSettingsSelector
], (dockStyle, element, currentLocale, swipeSettings) => (
    {
        dockStyle,
        element,
        currentLocale,
        swipeSettings
    }
));

const MapSwipeSettingsPlugin = connect(mapSwipeSelector, {
    onHideSwipeSettings: hideLayerSwipeSettings
})(MapSwipeSettingsPanel);

const SwipePlugin = createPlugin(
    'Swipe',
    {
        component: MapSwipeSettingsPlugin,
        containers: {
            TOC: {
                name: "Swipe",
                button: () => <div>Toggle btn</div>
            },
            Map: {
                Component: MapSwipeSupport
            }
        }
    }
);

export default SwipePlugin;

