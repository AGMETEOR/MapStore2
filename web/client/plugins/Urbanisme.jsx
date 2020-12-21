/*
* Copyright 2020, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import assign from 'object-assign';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ToolsContainer from './containers/ToolsContainer';
import Message from '../components/I18N/Message';
import { createPlugin } from '../utils/PluginsUtils';
import { toggleControl } from '../actions/controls';
import { getPlanningLayer } from '../actions/urbanisme';
import API from '../api/catalog';
import urbanismeEpic from '../epics/urbanisme';

class Container extends React.Component {
    render() {
        const { children, ...props } = this.props;
        return (<div {...props}>
            {children}
        </div>);
    }
}

class UrbanismeToolbar extends React.Component {
    static propTypes = {
        enabled: PropTypes.boolean,
        items: PropTypes.array,
        onGetPlanningLayer: PropTypes.func
    }
    static defaultProps = {
        enabled: false,
        items: [],
        onGetPlanningLayer: () => {}
    }

    componentDidMount() {
        const url = "https://georchestra.geo-solutions.it:443/geoserver/qgis/ows?SERVICE=WMS&REQUEST=GetCapabilities";
        this.props.onGetPlanningLayer({
            format: "wms",
            url,
            startPosition: 1,
            maxRecords: 1,
            text: "urbanisme_parcelle" });
    }

    getTools = () => {
        const tools = [
            {
                alwaysVisible: true,
                name: "NRU",
                cfg: {},
                items: [],
                position: 3,
                priority: 1,
                tool: false,
                action: toggleControl.bind(null, 'urbanisme', null),
                icon: <Glyphicon glyph="remove" />,
                help: <Message msgId="helptexts.zoomToMaxExtentButton"/>
            }
        ];
        const combinedItemTools = [...this.props.items, ...tools ];
        const hidableItems = combinedItemTools.filter((item) => !item.alwaysVisible) || [];
        const unsorted = combinedItemTools
            .filter((item) =>
                item.alwaysVisible
                || hidableItems.length === 1) // TODO: Refactor and remove unnecessary filter
            .filter(item => item.showWhen ? item.showWhen(this.props) : true)
            .map((item, index) => assign({}, item, {position: item.position || index}));
        return unsorted.sort((a, b) => a.position - b.position);
    };

    render() {
        const panelStyle = {
            minWidth: "300px",
            right: "450px",
            zIndex: 100,
            position: "absolute",
            overflow: "auto",
            left: "52px",
            top: "52px"
        };

        const btnConfig = {
            className: "square-button"
        };

        return this.props.enabled ? (<ToolsContainer
            id="urbanisme"
            className="urbanismeToolbar btn-group-horizontal"
            container={Container}
            toolStyle="primary"
            activeStyle="success"
            panelStyle={panelStyle}
            toolCfg={btnConfig}
            tools={this.getTools()}
            panels={[]} />) : null;
    }

}

const Urbanisme = connect((state) => ({
    enabled: state.controls && state.controls.urbanisme && state.controls.urbanisme.enabled || false
}), {
    onGetPlanningLayer: getPlanningLayer
})(UrbanismeToolbar);

const UrbanismeCompDefinition = {
    component: Urbanisme,
    containers: {
        BurgerMenu: {
            name: "urbanisme",
            text: "LAND PLANNING", // TODO: Use translation component
            icon: <Glyphicon glyph="th-list" />,
            action: toggleControl.bind(null, 'urbanisme', null),
            position: 1501,
            doNotHide: true,
            priority: 2
        }
    },
    epics: urbanismeEpic(API) // using catalog API
};

export default createPlugin("Urbanisme", UrbanismeCompDefinition);
