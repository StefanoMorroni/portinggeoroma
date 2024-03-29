/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import expect from 'expect';
import WidgetBuilder from '../WidgetBuilder';
describe('WidgetsBuilder component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('WidgetsBuilder rendering with defaults', () => {
        ReactDOM.render(<WidgetBuilder />, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.ms-wizard');
        expect(el).toBeFalsy();
    });
    it('WidgetsBuilder rendering chart options', () => {
        ReactDOM.render(<WidgetBuilder
            step={0}
            featureTypeProperties={[
                { type: 'xsd:string', localType: 'string', name: 'STATE_NAME' }
            ]}
            editorData={{
                selectedChartId: 'chart-01',
                charts: [{
                    chartId: 'chart-01',
                    traces: [{
                        type: 'bar',
                        layer: {},
                        options: {}
                    }]
                }]
            }}
        />, document.getElementById("container"));
        const container = document.getElementById('container');
        const elChartOption = container.querySelector('.chart-options');
        expect(elChartOption).toBeTruthy();
        const elChartOptionForm = container.querySelector('.chart-options-form');
        expect(elChartOptionForm).toBeTruthy();
    });
});
