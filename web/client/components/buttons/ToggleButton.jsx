/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var BootstrapReact = require('react-bootstrap');
var Glyphicon = BootstrapReact.Glyphicon;
var Button = BootstrapReact.Button;

var ToggleButton = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        btnConfig: React.PropTypes.object,
        text: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        glyphicon: React.PropTypes.string,
        pressed: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            onClick: () => {},
            pressed: false
        };
    },
    onClick() {
        this.props.onClick(!this.props.pressed);
    },
    render() {
        return (
                <Button id={this.props.id} {...this.props.btnConfig} onClick={this.onClick} bsStyle={this.props.pressed ? 'primary' : 'default'}>
                    {this.props.glyphicon ? <Glyphicon glyph={this.props.glyphicon}/> : null}
                    {this.props.glyphicon && this.props.text ? "\u00A0" : null}
                    {this.props.text}
                </Button>
        );
    }
});

module.exports = ToggleButton;
