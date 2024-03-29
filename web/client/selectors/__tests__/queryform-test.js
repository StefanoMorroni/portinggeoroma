/*
* Copyright 2017, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import expect from 'expect';

import { set } from '../../utils/ImmutableUtils';

import {
    availableCrossLayerFilterLayersSelector,
    spatialFieldSelector,
    spatialFieldGeomSelector,
    spatialFieldGeomTypeSelector,
    getMapConfigSelector,
    spatialFieldGeomProjSelector,
    spatialFieldGeomCoordSelector,
    spatialFieldMethodSelector,
    queryFormUiStateSelector,
    storedFilterSelector,
    appliedFilterSelector,
    filtersSelector,
    filtersSelectorCreator
} from '../queryform';

const circle = "Circle";
const attribute = "the_geom";
const type = "Polygon";
const projection = "EPSG:4326";
const initialState = {
    queryform: {
        attributePanelExpanded: false,
        spatialPanelExpanded: true,
        crossLayerExpanded: true,
        spatialField: {
            method: circle,
            attribute,
            operation: 'INTERSECTS',
            geometry: {
                type,
                extent: [
                    -131.13193396618624,
                    41.70442679825947,
                    -120.23525353381378,
                    49.3390609957278
                ],
                center: [
                    -125.68359374999999,
                    45.52174389699363
                ],
                coordinates: [
                    [
                        [
                            -125.56368892134608,
                            42.78500647128915
                        ],
                        [
                            -125.32435247361764,
                            42.79605649953404
                        ],
                        [
                            -125.08643378708538,
                            42.81810704761059
                        ],
                        [
                            -124.85087181811029,
                            42.85105938624819
                        ],
                        [
                            -124.61859622216589,
                            42.894766137903254
                        ],
                        [
                            -125.56368892134608,
                            42.78500647128915
                        ]
                    ]
                ],
                radius: 424941.79896156304,
                projection
            }
        },
        filters: [{
            id: "test",
            format: 'cql',
            body: 'prop1 = 1'
        }, {
            id: "test2",
            format: 'cql',
            body: 'prop2 = 2'
        }]
    },
    layerFilter: {
        persisted: {id: 1},
        applied: {id: 2}
    }
};

describe('Test queryform selectors', () => {
    it('getMapConfigSelector ', () => {
        const state = set(`queryform.map`, { id: "map-id" }, {});
        expect(getMapConfigSelector(state)).toEqual({ id: "map-id" });
    });
    it('spatialFieldSelector', () => {
        const spatialfield = spatialFieldSelector(initialState);
        expect(spatialfield).toExist();
        expect(spatialfield.method).toBe(circle);
        expect(spatialfield.attribute).toBe(attribute);
    });
    it('spatialFieldGeomSelector', () => {
        const geom = spatialFieldGeomSelector(initialState);
        expect(geom).toExist();
        expect(geom.type).toBe(type);
    });
    it('spatialFieldGeomTypeSelector', () => {
        const geomType = spatialFieldGeomTypeSelector(initialState);
        expect(type).toExist();
        expect(type).toBe(geomType);
    });
    it('spatialFieldGeomProjSelector', () => {
        const geomProj = spatialFieldGeomProjSelector(initialState);
        expect(geomProj).toExist();
        expect(geomProj).toBe(projection);
    });
    it('spatialFieldGeomCoordSelector', () => {
        const geomCoord = spatialFieldGeomCoordSelector(initialState);
        expect(geomCoord).toExist();
        expect(geomCoord.length).toBe(1);
        expect(geomCoord[0].length).toBe(6);
    });
    it('spatialFieldMethodSelector', () => {
        const method = spatialFieldMethodSelector(initialState);
        expect(method).toExist();
        expect(method).toBe(circle);
    });
    it('queryFormUiStateSelector', () => {
        const queryFormUiState = queryFormUiStateSelector(initialState);
        expect(queryFormUiState).toExist();
        expect(queryFormUiState.attributePanelExpanded).toBe(false);
        expect(queryFormUiState.spatialPanelExpanded).toBe(true);
        expect(queryFormUiState.crossLayerExpanded).toBe(true);
    });
    it('storedFilterSelector', () => {
        const storedFilter = storedFilterSelector(initialState);
        expect(storedFilter).toExist();
        expect(storedFilter.id).toBe(1);
    });
    it('appliedFilterSelector', () => {
        const appliedFilter = appliedFilterSelector(initialState);
        expect(appliedFilter).toExist();
        expect(appliedFilter.id).toBe(2);
    });
    it('availableCrossLayerFilterLayersSelector', () => {
        const layers = availableCrossLayerFilterLayersSelector({layers: [
            {type: "wms", group: "group name"},
            {type: "csw", group: "group name"},
            {type: "wms", group: "background"}]
        });
        expect(layers).toExist();
        expect(layers.length).toBe(1);
        expect(layers[0].group).toBe("group name");
        expect(layers[0].type).toBe("wms");
    });
    it('filtersSelector', () => {
        const filters = filtersSelector(initialState);
        expect(filters).toExist();
        expect(filters.length).toBe(2);
    });
    it('filtersSelectorCreator', () => {
        const filter = filtersSelectorCreator("test_not_exists")(initialState);
        expect(filter).toNotExist();
        const filter2 = filtersSelectorCreator("test")(initialState);
        expect(filter2).toExist();
        expect(filter2.id).toBe("test");
        expect(filter2.body).toBe("prop1 = 1");
    });
});
