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
        items: PropTypes.array
    }
    static defaultProps = {
        enabled: false,
        items: []
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
                item.alwaysVisible // items not hidden (by expander)
                || hidableItems.length === 1) // if the item is only one, the expander will not show, instead we have only the item
            .filter(item => item.showWhen ? item.showWhen(this.props) : true) // optional display option (used by expander, that depends on other)
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
}))(UrbanismeToolbar);

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
    }
};

export default createPlugin("Urbanisme", UrbanismeCompDefinition);
