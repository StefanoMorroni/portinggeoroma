/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import expect from 'expect';

import search from '../search';

import {
    TEXT_SEARCH_RESULTS_LOADED,
    TEXT_SEARCH_LOADING,
    TEXT_SEARCH_ERROR,
    TEXT_SEARCH_RESULTS_PURGE,
    TEXT_SEARCH_NESTED_SERVICES_SELECTED,
    TEXT_SEARCH_CANCEL_ITEM,
    UPDATE_RESULTS_STYLE,
    resetSearch,
    selectSearchItem,
    changeFormat,
    changeCoord,
    changeActiveSearchTool,
    hideMarker
} from '../../actions/search';

import { resetControls } from '../../actions/controls';

describe('Test the search reducer', () => {
    it('search results loading', () => {
        let state = search({}, {
            type: TEXT_SEARCH_LOADING,
            loading: true
        });
        expect(state.loading).toBe(true);
        state = search({}, {
            type: TEXT_SEARCH_LOADING,
            loading: false
        });
        expect(state.loading).toBe(false);
    });
    it('search results error', () => {
        let state = search({}, {
            type: TEXT_SEARCH_ERROR,
            error: {message: "M"}
        });
        expect(state.error).toExist();
    });
    it('search results loaded', () => {
        let testAction1 = {
            type: TEXT_SEARCH_RESULTS_LOADED,
            results: ["result1", "result2"]
        };

        let state = search({error: {}}, testAction1);
        expect(state).toExist();
        expect(state.results).toEqual(["result1", "result2"]);
        expect(state.error).toBe(null);

        let testAction2 = {
            type: TEXT_SEARCH_RESULTS_LOADED,
            results: ["result3", "result4"]
        };

        state = search(state, testAction2);
        expect(state).toExist();
        expect(state.results).toEqual(["result3", "result4"]);

        let testAction3 = {
            type: TEXT_SEARCH_RESULTS_LOADED,
            results: ["result5", "result6"],
            append: true
        };

        state = search(state, testAction3);
        expect(state).toExist();
        expect(state.results).toEqual(["result3", "result4", "result5", "result6"]);
    });
    it('search results purge', () => {
        let state = search({
            results: ["result1", "result2"]
        }, {
            type: TEXT_SEARCH_RESULTS_PURGE,
            error: {message: "M"}
        });
        expect(state.results).toBe(null);
    });
    it('nested search service selected', () => {
        let state = search({
            results: ["result1", "result2"]
        }, {
            type: TEXT_SEARCH_NESTED_SERVICES_SELECTED,
            services: [{

            }],
            searchText: "TEST",
            selectedItems: [{
                text: "text"
            }]

        });
        expect(state.selectedItems.length).toBe(1);
        expect(state.selectedServices.length).toBe(1);
        state = search(state, {
            type: TEXT_SEARCH_NESTED_SERVICES_SELECTED,
            services: [{

            }],
            searchText: "TEST",
            selectedItems: [{
                text: "text"
            }]

        });
        expect(state.selectedItems.length).toBe(2);
        expect(state.selectedServices.length).toBe(1);
    });
    it('nested search cancel item', () => {
        let itemToCancel = {text: "text2"};
        let state = search({
            searchText: "",
            selectedItems: [{text: "text1"}, itemToCancel]
        }, {
            type: TEXT_SEARCH_CANCEL_ITEM,
            item: itemToCancel

        });
        expect(state.searchText).toBe("text2");
        expect(state.selectedItems.length).toBe(1);
    });
    it('checks for valid state in TEXT_SEARCH_CANCEL_ITEM', () => {
        let itemToCancel = {text: "text2"};
        let state = search(null, {
            type: TEXT_SEARCH_CANCEL_ITEM,
            item: itemToCancel

        });
        expect(state).toBe(null);
    });
    it('update results style', () => {
        const style = {color: '#ff0000'};
        const state = search({}, {
            type: UPDATE_RESULTS_STYLE,
            style
        });
        expect(state.style).toEqual(style);
    });
    it('update active search tool', () => {
        const activeSearchTool = "coordinateSearch";
        const state = search({}, changeActiveSearchTool(activeSearchTool));
        expect(state.activeSearchTool).toEqual(activeSearchTool);
    });
    it('CHANGE_FORMAT', () => {
        const format = "decimal";
        const state = search({}, changeFormat(format));
        expect(state.format).toEqual(format);
    });
    it('CHANGE_COORD', () => {
        const coordinate = "lat";
        const val = 2;
        const state = search({}, changeCoord(coordinate, val));
        expect(state.coordinate).toEqual({[coordinate]: val});
    });
    it('TEXT_SEARCH_RESET', () => {
        // reset maintains only the style
        let state = search({
            style: {
                color: "#ff0000"
            },
            searchText: "Rome",
            results: []
        }, resetSearch());
        expect(state).toEqual({style: {
            color: "#ff0000"
        }});

        // or it keeps one empty
        state = search({}, resetSearch());
        expect(state).toEqual({style: {}});
    });
    it('TEXT_SEARCH_ITEM_SELECTED - wfs service', () => {
        let service =  {
            type: 'wfs',
            displayName: '${properties.DISPLAY_NAME}'
        };
        let item = {
            properties: {
                DISPLAY_NAME: 'Display Name'
            }
        };
        const state = search({}, selectSearchItem(item, {}, service, {}));
        expect(state.searchText).toBe('Display Name');
    });
    it('TEXT_SEARCH_ITEM_SELECTED - Nominatim service', () => {
        let service =  {
            type: 'nominatim'
        };
        let item = {
            properties: {
                display_name: 'Display Name'
            }
        };
        const state = search({}, selectSearchItem(item, {}, service, {}));
        expect(state.searchText).toBe('Display Name');
    });
    it('TEXT_SEARCH_ITEM_SELECTED - undefined service', () => {
        let item = {
            properties: {
                display_name: 'Display Name'
            }
        };
        const state = search({ searchText: 'Displ' }, selectSearchItem(item, {}, undefined, {}));
        expect(state.searchText).toBe('Displ');
    });
    it('RESET_CONTROLS', () => {

        const state = search({style: {
            color: "#ff0000"
        }}, resetControls());
        expect(state).toBe(null);
    });

    it('HIDE MARKER', () => {
        const state = search({markerPosition: {
            latlng: {lat: 0, lng: 0}
        }}, hideMarker());
        expect(JSON.stringify(state.markerPosition)).toBe(JSON.stringify({}));
    });
});
