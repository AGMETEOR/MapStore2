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

class Urbanisme extends React.Component {
    static propTypes = {
        items: PropTypes.array
    }
    static defaultProps = {
        items: []
    }

    getTools = () => {
        console.log("THE ITEMS", this.props.items);
        const hidableItems = this.props.items.filter((item) => !item.alwaysVisible) || [];
        const unsorted = this.props.items
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
        return (<ToolsContainer
            id="urbanisme"
            className="urbanismeToolbar btn-group-horizontal"
            container={Container}
            toolStyle="primary"
            activeStyle="success"
            panelStyle={panelStyle}
            toolCfg={btnConfig}
            tools={this.getTools()}
            panels={[]} />);
    }

}

// const Urbanisme = () => {
//     const panelStyle = {
//         minWidth: "300px",
//         right: "450px",
//         zIndex: 100,
//         position: "absolute",
//         overflow: "auto",
//         left: "52px",
//         top: "52px"
//     };

//     const btnConfig = {
//         className: "square-button"
//     };

//     const tools = [
//         {
//             alwaysVisible: true,
//             name: "NRU",
//             cfg: {},
//             items: [],
//             position: 1,
//             priority: 1,
//             tool: false,
//             icon: <Glyphicon glyph="zoom-to" />,
//             help: <Message msgId="helptexts.zoomToMaxExtentButton"/>
//         },
//         {
//             alwaysVisible: true,
//             name: "NRU",
//             cfg: {},
//             items: [],
//             position: 2,
//             priority: 1,
//             tool: false,
//             icon: <Glyphicon glyph="info-sign" />,
//             help: <Message msgId="helptexts.zoomToMaxExtentButton"/>
//         },
//         {
//             alwaysVisible: true,
//             name: "NRU",
//             cfg: {},
//             items: [],
//             position: 3,
//             priority: 1,
//             tool: false,
//             icon: <Glyphicon glyph="question-sign" />,
//             help: <Message msgId="helptexts.zoomToMaxExtentButton"/>
//         },
//         {
//             alwaysVisible: true,
//             name: "NRU",
//             cfg: {},
//             items: [],
//             position: 3,
//             priority: 1,
//             tool: false,
//             icon: <Glyphicon glyph="remove" />,
//             help: <Message msgId="helptexts.zoomToMaxExtentButton"/>
//         }
//     ];
//     return (<ToolsContainer
//         id="urbanisme"
//         className="urbanismeToolbar btn-group-horizontal"
//         container={Container}
//         toolStyle="primary"
//         activeStyle="success"
//         panelStyle={panelStyle}
//         toolCfg={btnConfig}
//         tools={tools}
//         panels={[]} />);
// };

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
