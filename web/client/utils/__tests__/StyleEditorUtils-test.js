/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const expect = require('expect');

const {
    generateTemporaryStyleId,
    STYLE_ID_SEPARATOR,
    generateStyleId,
    extractFeatureProperties,
    getEditorMode,
    isSameOrigin,
    getStyleTemplates,
    getNameParts,
    stringifyNameParts,
    parseJSONStyle,
    formatJSONStyle
} = require('../StyleEditorUtils');

describe('StyleEditorUtils test', () => {
    it('test generateTemporaryStyleId', () => {
        const divider = '_ms_';
        const generateId = generateTemporaryStyleId();
        const idSplit = generateId.split(divider);
        expect(idSplit.length).toBe(2);
    });
    it('test generateStyleId', () => {
        const generateId = generateStyleId({title: 'My style TiTle'});
        const idSplit = generateId.split(STYLE_ID_SEPARATOR);
        expect(idSplit.length).toBe(2);
        expect(idSplit[0]).toBe('my_style_title');
    });
    it('test extractFeatureProperties', () => {
        const layer = {
            id: 'layerId',
            name: 'layerName',
            style: 'point',
            describeLayer: {
                owsType: 'WFS'
            },
            describeFeatureType: {
                complexType: [{
                    complexContent: {
                        extension: {
                            sequence: {
                                element: [{
                                    TYPE_NAME: "XSD_1_0.LocalElement",
                                    maxOccurs: "1",
                                    minOccurs: 0,
                                    name: "RANK",
                                    nillable: true,
                                    otherAttributes: {},
                                    type: {
                                        key: "{http://www.w3.org/2001/XMLSchema}short",
                                        localPart: "short",
                                        namespaceURI: "http://www.w3.org/2001/XMLSchema",
                                        prefix: "xsd",
                                        string: "{http://www.w3.org/2001/XMLSchema}xsd:short"
                                    }
                                }, {
                                    TYPE_NAME: "XSD_1_0.LocalElement",
                                    maxOccurs: "1",
                                    minOccurs: 0,
                                    name: "geom",
                                    nillable: true,
                                    otherAttributes: {},
                                    type: {
                                        key: "{http://www.opengis.net/gml}PointPropertyType",
                                        localPart: "PointPropertyType",
                                        namespaceURI: "http://www.opengis.net/gml",
                                        prefix: "gml",
                                        string: "{http://www.opengis.net/gml}gml:PointPropertyType"
                                    }
                                }]
                            }
                        }
                    }
                }]
            }
        };
        expect(extractFeatureProperties(layer)).toEqual({
            geometryType: 'point',
            properties: {
                RANK: { localPart: 'short', prefix: 'xsd' },
                geom: { localPart: 'PointPropertyType', prefix: 'gml' }
            },
            owsType: 'WFS'
        });

    });
    it('test getEditorMode', () => {
        expect(getEditorMode('css')).toBe('geocss');
        expect(getEditorMode('sld')).toBe('xml');
        expect(getEditorMode('yaml')).toBe('yaml');
    });
    it('test isSameOrigin', () => {
        expect(isSameOrigin({url: '/geoserver'}, {baseUrl: '/geoserver'})).toBe(true);
        expect(isSameOrigin({url: 'http://localhost:8080/geoserver'}, {baseUrl: '/geoserver'})).toBe(false);
        expect(isSameOrigin({url: 'http://localhost:8080/geoserver'}, {baseUrl: '/geoserver', availableUrls: [ 'http://localhost:8080']})).toBe(true);
    });
    it('test getStyleTemplates', () => {
        expect(getStyleTemplates().length > 2).toBe(true);
    });
    it('test getNameParts', () => {
        expect(getNameParts('workspace:name')).toEqual({
            name: 'name',
            workspace: 'workspace'
        });

        expect(getNameParts('name')).toEqual({
            name: 'name',
            workspace: undefined
        });
    });

    it('test getNameParts', () => {
        expect(stringifyNameParts({name: 'name', workspace: {name: 'workspace'}})).toBe('workspace:name');
        expect(stringifyNameParts({name: 'name'})).toBe('name');
    });

    it('test parseJSONStyle filter object to geostyler array filter translation', () => {
        const style = {
            name: 'Style',
            rules: [
                {
                    name: 'Rule',
                    filter: {
                        filterFields: [
                            {
                                rowId: 1594021816562,
                                groupId: 1,
                                attribute: 'STATE_NAME',
                                operator: '=',
                                value: 'New York',
                                type: 'string',
                                fieldOptions: {
                                    valuesCount: 0,
                                    currentPage: 1
                                },
                                exception: null
                            }
                        ],
                        groupFields: [
                            {
                                id: 1,
                                logic: 'OR',
                                index: 0
                            }
                        ]
                    },
                    symbolizers: []
                }
            ]
        };
        expect(parseJSONStyle(style)).toEqual({
            name: 'Style',
            rules: [ {
                name: 'Rule',
                filter: [ '||', [ '==', 'STATE_NAME', 'New York' ] ],
                symbolizers: []
            }]
        });
    });

    it('test parseJSONStyle classification translation', () => {
        const style = {
            name: 'Style',
            rules: [
                {
                    ruleId: 'rule1',
                    kind: 'Classification',
                    color: '#dddddd',
                    fillOpacity: 1,
                    outlineColor: '#777777',
                    outlineWidth: 1,
                    classification: [{
                        title: ' >= 18.0 AND <10164.3',
                        color: '#FFF7EC',
                        type: 'Polygon',
                        min: 18,
                        max: 10164.3
                    },
                    {
                        title: ' >= 10164.3 AND <20310.5',
                        color: '#FC8D59',
                        type: 'Polygon',
                        min: 10164.3,
                        max: 20310.5
                    },
                    {
                        title: ' >= 20310.5 AND <=30456.9',
                        color: '#7F0000',
                        type: 'Polygon',
                        min: 20310.5,
                        max: 30456.9
                    }],
                    intervals: 3,
                    method: 'equalInterval',
                    ramp: 'orrd',
                    reverse: false,
                    symbolizerKind: 'Fill',
                    attribute: 'WATER_KM'
                }
            ]
        };
        expect(parseJSONStyle(style)).toEqual({
            name: 'Style',
            rules: [ {
                name: '>= 18 and < 10164.3',
                filter: [ '&&', [ '>=', 'WATER_KM', 18 ], [ '<', 'WATER_KM', 10164.3 ] ],
                symbolizers: [{
                    kind: 'Fill',
                    color: '#FFF7EC',
                    fillOpacity: 1,
                    outlineColor: '#777777',
                    outlineWidth: 1
                }]
            },
            {
                name: '>= 10164.3 and < 20310.5',
                filter: [ '&&', [ '>=', 'WATER_KM', 10164.3 ], [ '<', 'WATER_KM', 20310.5 ] ],
                symbolizers: [ {
                    kind: 'Fill',
                    color: '#FC8D59',
                    fillOpacity: 1,
                    outlineColor: '#777777',
                    outlineWidth: 1
                }]
            },
            {
                name: '>= 20310.5 and <= 30456.9',
                filter: [ '&&', [ '>=', 'WATER_KM', 20310.5 ], [ '<=', 'WATER_KM', 30456.9 ] ],
                symbolizers: [{
                    kind: 'Fill',
                    color: '#7F0000',
                    fillOpacity: 1,
                    outlineColor: '#777777',
                    outlineWidth: 1
                }]
            }]
        });
    });

    it('test parseJSONStyle raster classification translation', () => {

        const style = {
            name: 'Style',
            rules: [
                {
                    ruleId: 'rule1',
                    kind: 'Raster',
                    opacity: 1,
                    classification: [{
                        color: '#B9FBC7',
                        opacity: 1,
                        label: '1066',
                        quantity: 1066
                    },
                    {
                        color: '#FC8D59',
                        opacity: 1,
                        label: '1453',
                        quantity: 1453
                    },
                    {
                        color: '#7F0000',
                        opacity: 1,
                        label: '1840',
                        quantity: 1840
                    }],
                    intervals: 3,
                    method: 'equalInterval',
                    ramp: 'custom',
                    reverse: false,
                    continuous: true,
                    symbolizerKind: 'Raster',
                    name: 'raster'
                }
            ]
        };

        expect(parseJSONStyle(style)).toEqual({
            name: 'Style',
            rules: [ {
                name: 'raster',
                symbolizers: [ {
                    kind: 'Raster',
                    opacity: 1,
                    colorMap: {
                        colorMapEntries: [{
                            color: '#B9FBC7',
                            opacity: 1,
                            label: '1066',
                            quantity: 1066
                        },
                        {
                            color: '#FC8D59',
                            opacity: 1,
                            label: '1453',
                            quantity: 1453
                        },
                        {
                            color: '#7F0000',
                            opacity: 1,
                            label: '1840',
                            quantity: 1840
                        }]
                    }
                }]
            } ]
        });
    });

    it('test parseJSONStyle should return empty string when rule name is undefined', () => {

        const style = {
            name: 'Style',
            rules: [
                {
                    ruleId: 'rule1',
                    kind: 'Raster',
                    opacity: 1,
                    classification: [],
                    intervals: 3,
                    method: 'equalInterval',
                    ramp: 'custom',
                    reverse: false,
                    continuous: true,
                    symbolizerKind: 'Raster'
                }
            ]
        };

        expect(parseJSONStyle(style)).toEqual({
            name: 'Style',
            rules: [ {
                name: '',
                symbolizers: [ {
                    kind: 'Raster',
                    opacity: 1
                }]
            } ]
        });
    });

    it('test formatJSONStyle geostyler array filter to filter object translation', () => {
        const style = {
            name: 'Style',
            rules: [ {
                name: 'Rule',
                filter: [ '||', [ '==', 'STATE_NAME', 'New York' ] ],
                symbolizers: []
            }]
        };

        const formattedJSONStyle = formatJSONStyle(style);
        expect(formattedJSONStyle.rules[0].filter.groupFields).toBeTruthy();
        expect(formattedJSONStyle.rules[0].filter.filterFields).toBeTruthy();
    });

});
