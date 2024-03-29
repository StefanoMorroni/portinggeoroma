/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import {createSink} from 'recompose';

import onMapViewChanges from '../onMapViewChanges';

describe('onMapViewChanges enhancer', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('onMapViewChanges rendering with defaults', () => {
        const Sink = onMapViewChanges(createSink( props => {
            expect(props.eventHandlers.onMapViewChanges).toExist();
            setTimeout(props.eventHandlers.onMapViewChanges("CENTER", "ZOOM", { bbox: { x: 2 } }, "SIZE", "mapStateSource", "projection"));

        }));
        const actions = {
            onMapViewChanges: () => {}
        };
        const spy = expect.spyOn(actions, 'onMapViewChanges');
        ReactDOM.render(<Sink map={{ bbox: { x: 1, y: 1 }, test: "TEST" }} onMapViewChanges={actions.onMapViewChanges} />, document.getElementById("container"));
        expect(spy).toHaveBeenCalled();
        const map = spy.calls[0].arguments[0];
        expect(map).toExist();
        expect(map.center).toExist();
        expect(map.zoom).toExist();
        expect(map.bbox).toExist();
        expect(map.size).toExist();
        expect(map.mapStateSource).toExist();
        expect(map.projection).toExist();
    });
    it('onMapViewChanges rendering with zoomToExtentHandler', () => {
        const Sink = onMapViewChanges(createSink( props => {
            expect(props.eventHandlers.onMapViewChanges).toExist();
            setTimeout(props.eventHandlers.onMapViewChanges("CENTER", "ZOOM", { bbox: { x: 2 } }, "SIZE", "mapStateSource", "projection", {}, "RESOLUTION", "ORINATE", () => {}));

        }));
        const actions = {
            onMapViewChanges: () => {}
        };
        const spy = expect.spyOn(actions, 'onMapViewChanges');
        ReactDOM.render(<Sink map={{ bbox: { x: 1, y: 1 }, test: "TEST" }} onMapViewChanges={actions.onMapViewChanges} />, document.getElementById("container"));
        expect(spy).toHaveBeenCalled();
        const map = spy.calls[0].arguments[0];
        expect(map).toExist();
        expect(map.center).toExist();
        expect(map.zoom).toExist();
        expect(map.bbox).toExist();
        expect(map.size).toExist();
        expect(map.mapStateSource).toExist();
        expect(map.projection).toExist();
        expect(map.zoomToExtentHandler).toExist();
    });

});
