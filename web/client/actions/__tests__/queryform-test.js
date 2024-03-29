/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';

import {
    ADD_FILTER_FIELD,
    ADD_GROUP_FIELD,
    REMOVE_FILTER_FIELD,
    UPDATE_FILTER_FIELD,
    UPDATE_EXCEPTION_FIELD,
    UPDATE_LOGIC_COMBO,
    REMOVE_GROUP_FIELD,
    CHANGE_CASCADING_VALUE,
    EXPAND_ATTRIBUTE_PANEL,
    EXPAND_SPATIAL_PANEL,
    SELECT_SPATIAL_METHOD,
    UPDATE_GEOMETRY,
    SELECT_SPATIAL_OPERATION,
    REMOVE_SPATIAL_SELECT,
    SHOW_SPATIAL_DETAILS,
    ZONE_SEARCH,
    ZONE_SEARCH_ERROR,
    ZONE_FILTER,
    ZONE_CHANGE,
    ZONES_RESET,
    SHOW_GENERATED_FILTER,
    QUERY_FORM_RESET,
    CHANGE_DWITHIN_VALUE,
    QUERY_FORM_SEARCH,
    LOAD_FILTER,
    SIMPLE_FILTER_FIELD_UPDATE,
    ADD_SIMPLE_FILTER_FIELD,
    REMOVE_SIMPLE_FILTER_FIELD,
    REMOVE_ALL_SIMPLE_FILTER_FIELDS,
    SELECT_VIEWPORT_SPATIAL_METHOD,
    CHANGE_SPATIAL_ATTRIBUTE,
    TOGGLE_AUTOCOMPLETE_MENU,
    SET_AUTOCOMPLETE_MODE,
    CHANGE_SPATIAL_FILTER_VALUE,
    UPDATE_CROSS_LAYER_FILTER_FIELD_OPTIONS,
    UPSERT_FILTERS,
    REMOVE_FILTERS,
    setAutocompleteMode,
    toggleMenu,
    changeDwithinValue,
    resetZones,
    zoneChange,
    zoneSearch,
    zoneSearchError,
    zoneFilter,
    zoneGetValues,
    query,
    search,
    loadFilter,
    reset,
    addFilterField,
    addGroupField,
    removeFilterField,
    updateFilterField,
    updateExceptionField,
    updateLogicCombo,
    removeGroupField,
    changeCascadingValue,
    expandAttributeFilterPanel,
    expandSpatialFilterPanel,
    selectSpatialMethod,
    updateGeometrySpatialField,
    selectViewportSpatialMethod,
    selectSpatialOperation,
    removeSpatialSelection,
    changeSpatialAttribute,
    showSpatialSelectionDetails,
    simpleFilterFieldUpdate,
    addSimpleFilterField,
    removeSimpleFilterField,
    removeAllSimpleFilterFields,
    changeSpatialFilterValue,
    updateCrossLayerFilterFieldOptions,
    upsertFilters,
    changeMapEditor,
    removeFilters,
    CHANGE_MAP_EDITOR
} from '../queryform';

describe('Test correctness of the queryform actions', () => {

    it('changeMapEditor', () => {
        var retval = changeMapEditor(null);

        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_MAP_EDITOR);
        expect(retval.mapData).toBe(null);
    });
    it('addFilterField', () => {
        let groupId = 1;

        var retval = addFilterField(groupId);

        expect(retval).toExist();
        expect(retval.type).toBe(ADD_FILTER_FIELD);
        expect(retval.groupId).toBe(1);
    });

    it('toggleMenu', () => {
        let status = true;
        let rowId = 100;

        var retval = toggleMenu(rowId, status);

        expect(retval).toExist();
        expect(retval.type).toBe(TOGGLE_AUTOCOMPLETE_MENU);
        expect(retval.rowId).toBe(rowId);
        expect(retval.status).toBe(status);
    });

    it('toggleMenu with layerFilterType undefined', () => {
        let status = true;
        let rowId = 100;

        var retval = toggleMenu(rowId, status);

        expect(retval).toExist();
        expect(retval.type).toBe(TOGGLE_AUTOCOMPLETE_MENU);
        expect(retval.rowId).toBe(rowId);
        expect(retval.status).toBe(status);
        expect(retval.layerFilterType).toBe("filterField");
    });


    it('toggleMenu with layerFilterType', () => {
        let status = true;
        let rowId = 100;

        var retval = toggleMenu(rowId, status, "crossLayer");

        expect(retval).toExist();
        expect(retval.type).toBe(TOGGLE_AUTOCOMPLETE_MENU);
        expect(retval.rowId).toBe(rowId);
        expect(retval.status).toBe(status);
        expect(retval.layerFilterType).toBe("crossLayer");
    });

    it('set autocomplete', () => {
        let status = true;
        var retval = setAutocompleteMode(status);

        expect(retval).toExist();
        expect(retval.type).toBe(SET_AUTOCOMPLETE_MODE);
        expect(retval.status).toBe(status);
    });

    it('addGroupField', () => {
        let groupId = 1;
        let index = 0;

        var retval = addGroupField(groupId, index);

        expect(retval).toExist();
        expect(retval.type).toBe(ADD_GROUP_FIELD);
        expect(retval.groupId).toBe(1);
        expect(retval.index).toBe(0);
    });

    it('updateGeometrySpatialField', () => {
        const geometry = {center: [0, 1], coordinates: []};
        const retval = updateGeometrySpatialField(geometry);

        expect(retval).toExist();
        expect(retval.type).toBe(UPDATE_GEOMETRY);
        expect(retval.geometry).toBe(geometry);
    });

    it('selectViewportSpatialMethod', () => {
        const retval = selectViewportSpatialMethod();
        expect(retval).toExist();
        expect(retval.type).toBe(SELECT_VIEWPORT_SPATIAL_METHOD);
    });

    it('changeSpatialAttribute', () => {
        const attribute = "some value";
        const retval = changeSpatialAttribute(attribute);
        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_SPATIAL_ATTRIBUTE);
        expect(retval.attribute).toBe(attribute);
    });

    it('removeFilterField', () => {
        let rowId = 100;

        let retval = removeFilterField(rowId);

        expect(retval).toExist();
        expect(retval.type).toBe(REMOVE_FILTER_FIELD);
        expect(retval.rowId).toBe(100);
    });

    it('updateFilterField', () => {
        let rowId = 100;
        let fieldName = "fieldName";
        let fieldValue = "fieldValue";

        let retval = updateFilterField(rowId, fieldName, fieldValue);

        expect(retval).toExist();
        expect(retval.type).toBe(UPDATE_FILTER_FIELD);
        expect(retval.rowId).toBe(100);
        expect(retval.fieldName).toBe("fieldName");
        expect(retval.fieldValue).toBe("fieldValue");
    });

    it('updateCrossLayerFilterFieldOptions', () => {
        let rowId = 100;
        let fieldName = "fieldName";
        let fieldValue = "fieldValue";
        let fieldAttribute = 'NAME';

        let retval = updateCrossLayerFilterFieldOptions({
            rowId, fieldName, fieldValue, attribute: fieldAttribute, fieldOptions: {}
        }, ['a', 'b, c'], 3);
        expect(retval).toExist();
        expect(retval.filterField.fieldValue).toBe(fieldValue);
        expect(retval.type).toBe(UPDATE_CROSS_LAYER_FILTER_FIELD_OPTIONS);
        expect(retval.valuesCount).toEqual(3);
        expect(retval.options).toEqual(['a', 'b, c']);
    });

    it('updateExceptionField', () => {
        let rowId = 100;
        let message = "message";

        let retval = updateExceptionField(rowId, message);

        expect(retval).toExist();
        expect(retval.type).toBe(UPDATE_EXCEPTION_FIELD);
        expect(retval.rowId).toBe(100);
        expect(retval.exceptionMessage).toBe("message");
    });

    it('updateLogicCombo', () => {
        let groupId = 100;
        let logic = "OR";

        let retval = updateLogicCombo(groupId, logic);

        expect(retval).toExist();
        expect(retval.type).toBe(UPDATE_LOGIC_COMBO);
        expect(retval.groupId).toBe(100);
        expect(retval.logic).toBe("OR");
    });

    it('removeGroupField', () => {
        let groupId = 100;

        let retval = removeGroupField(groupId);

        expect(retval).toExist();
        expect(retval.type).toBe(REMOVE_GROUP_FIELD);
        expect(retval.groupId).toBe(100);
    });

    it('changeCascadingValue', () => {
        let attributes = [];

        let retval = changeCascadingValue(attributes);

        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_CASCADING_VALUE);
        expect(retval.attributes.length).toBe(0);
    });

    it('expandAttributeFilterPanel', () => {
        let expanded = false;

        let retval = expandAttributeFilterPanel(expanded);

        expect(retval).toExist();
        expect(retval.type).toBe(EXPAND_ATTRIBUTE_PANEL);
        expect(retval.expand).toBe(false);
    });

    it('expandSpatialFilterPanel', () => {
        let expanded = false;

        let retval = expandSpatialFilterPanel(expanded);

        expect(retval).toExist();
        expect(retval.type).toBe(EXPAND_SPATIAL_PANEL);
        expect(retval.expand).toBe(false);
    });

    it('selectSpatialMethod', () => {
        let method = "BBOX";
        let fieldName = "method";

        let retval = selectSpatialMethod(method, fieldName);

        expect(retval).toExist();
        expect(retval.type).toBe(SELECT_SPATIAL_METHOD);
        expect(retval.method).toBe("BBOX");
        expect(retval.fieldName).toBe("method");
    });

    it('selectSpatialOperation', () => {
        let operation = "DWITHIN";
        let fieldName = "operation";

        let retval = selectSpatialOperation(operation, fieldName);

        expect(retval).toExist();
        expect(retval.type).toBe(SELECT_SPATIAL_OPERATION);
        expect(retval.operation).toBe("DWITHIN");
        expect(retval.fieldName).toBe("operation");
    });

    it('removeSpatialSelection', () => {
        let retval = removeSpatialSelection();

        expect(retval).toExist();
        expect(retval.type).toBe(REMOVE_SPATIAL_SELECT);
    });

    it('showSpatialSelectionDetails', () => {
        let show = true;

        let retval = showSpatialSelectionDetails(show);

        expect(retval).toExist();
        expect(retval.type).toBe(SHOW_SPATIAL_DETAILS);
        expect(retval.show).toBe(true);
    });

    it('changeDwithinValue', () => {
        let retval = changeDwithinValue(1);

        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_DWITHIN_VALUE);
        expect(retval.distance).toBe(1);
    });

    it('query', () => {
        let retval = query("url", null);

        expect(retval).toExist();
        expect(retval.type).toBe(SHOW_GENERATED_FILTER);
        expect(retval.data).toBe(null);
    });

    it('search', () => {
        const retval = search("URL", {});
        expect(retval).toExist();
        expect(retval.type).toBe(QUERY_FORM_SEARCH);
    });

    it('loadFilter', () => {
        const filter = {

        };
        const retval = loadFilter(filter);
        expect(retval).toExist();
        expect(retval.type).toBe(LOAD_FILTER);
        expect(retval.filter).toBe(filter);
    });

    it('reset', () => {
        let retval = reset();

        expect(retval).toExist();
        expect(retval.type).toBe(QUERY_FORM_RESET);
    });

    it('resetZones', () => {
        let retval = resetZones();

        expect(retval).toExist();
        expect(retval.type).toBe(ZONES_RESET);
    });

    it('zoneFilter', () => {
        let retval = zoneFilter(null, 1);

        expect(retval).toExist();
        expect(retval.type).toBe(ZONE_FILTER);
        expect(retval.data).toBe(null);
        expect(retval.id).toBe(1);
    });

    it('zoneSearchError', () => {
        let retval = zoneSearchError("error");

        expect(retval).toExist();
        expect(retval.type).toBe(ZONE_SEARCH_ERROR);
        expect(retval.error).toBe("error");
    });

    it('zoneSearch', () => {
        let retval = zoneSearch(true, 1);

        expect(retval).toExist();
        expect(retval.type).toBe(ZONE_SEARCH);
        expect(retval.active).toBe(true);
        expect(retval.id).toBe(1);
    });

    it('loads an existing zones file', (done) => {
        zoneGetValues('../../test-resources/featureGrid-test-data.json')((e) => {
            try {
                expect(e).toExist();
                done();
            } catch (ex) {
                done(ex);
            }
        });
    });

    /* it('openMenu', () => {
        let retval = openMenu(true, 1);

        expect(retval).toExist();
        expect(retval.type).toBe(OPEN_MENU);
        expect(retval.active).toBe(true);
        expect(retval.id).toBe(1);
    });*/

    it('zoneChange', () => {
        let retval = zoneChange(1, "value");

        expect(retval).toExist();
        expect(retval.type).toBe(ZONE_CHANGE);
        expect(retval.value).toBe("value");
        expect(retval.id).toBe(1);
    });

    it('simpleFilterFieldUpdate', () => {
        let retval = simpleFilterFieldUpdate(1, "value");

        expect(retval).toExist();
        expect(retval.type).toBe(SIMPLE_FILTER_FIELD_UPDATE);
        expect(retval.properties).toBe("value");
        expect(retval.id).toBe(1);
    });

    it('addSimpleFilterField', () => {
        let retval = addSimpleFilterField("value");

        expect(retval).toExist();
        expect(retval.type).toBe(ADD_SIMPLE_FILTER_FIELD);
        expect(retval.properties).toBe("value");
    });
    it('removeSimpleFilterField', () => {
        let retval = removeSimpleFilterField(1);

        expect(retval).toExist();
        expect(retval.type).toBe(REMOVE_SIMPLE_FILTER_FIELD);
        expect(retval.id).toBe(1);
    });
    it('removeAllSimpleFilterFields', () => {
        let retval = removeAllSimpleFilterFields();

        expect(retval).toExist();
        expect(retval.type).toBe(REMOVE_ALL_SIMPLE_FILTER_FIELDS);
    });
    it('removeAllSimpleFilterFields', () => {
        const arg = {
            collectGeometries: {},
            options: {},
            feature: { geometry: {
                type: "Point",
                coordinates: [1, 1]
            }},
            srsName: {},
            style: {}
        };
        let retval = changeSpatialFilterValue(arg);

        expect(retval).toExist();
        expect(retval.type).toBe(CHANGE_SPATIAL_FILTER_VALUE);
        expect(retval.geometry).toBe(arg.feature.geometry);
        expect(retval.collectGeometries).toBe(arg.collectGeometries);
        expect(retval.options).toBe(arg.options);
        expect(retval.feature).toBe(arg.feature);
        expect(retval.srsName).toBe(arg.srsName);
        expect(retval.style).toBe(arg.style);

    });
    it('upsertFilters', () => {
        let retval = upsertFilters({id: "my", format: 'cql', body: 'prop = 1'});

        expect(retval).toExist();
        expect(retval.type).toBe(UPSERT_FILTERS);
        expect(retval.filters).toExist();
        expect(retval.filters.length).toBe(1);
        expect(retval.filters[0].id).toBe("my");
        expect(retval.filters[0].format).toBe('cql');
        expect(retval.filters[0].body).toBe('prop = 1');
    });
    it('removeFilters', () => {
        let retval = removeFilters({id: "my", format: 'cql', body: 'prop = 1'});

        expect(retval).toExist();
        expect(retval.type).toBe(REMOVE_FILTERS);
        expect(retval.filters).toExist();
        expect(retval.filters.length).toBe(1);
        expect(retval.filters[0].id).toBe("my");
        expect(retval.filters[0].format).toBe('cql');
        expect(retval.filters[0].body).toBe('prop = 1');
    });
});
