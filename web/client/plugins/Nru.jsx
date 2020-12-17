/*
* Copyright 2020, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import React from 'react';
import { createPlugin } from '../utils/PluginsUtils';
import { connect } from 'react-redux';
import {Glyphicon} from 'react-bootstrap';

import Message from '../components/I18N/Message';
import Button from '../components/misc/Button';

const NruButton = () => {
    const btnConfig = {
        className: "square-button"
    };
    const bsStyle = "primary";
    return (
        <Button id="nru-btn" disabled={false} {...btnConfig} onClick={() => console.log("XXXX")} bsStyle={bsStyle} style={{}}>
            <Glyphicon glyph="zoom-to" />
        </Button>
    );

};

const Nru = connect(() => ({
    tooltip: "NRU" // TODO: Use translate
}))(NruButton);

export default createPlugin('Nru', {
    component: Nru,
    containers: {
        Urbanisme: {
            name: 'nru',
            position: 1,
            tool: true,
            icon: <Glyphicon glyph="zoom-to" />,
            help: <Message msgId="NRU"/>, // TODO: Use translate
            priority: 1
        }
    },
    reducers: {}
});
