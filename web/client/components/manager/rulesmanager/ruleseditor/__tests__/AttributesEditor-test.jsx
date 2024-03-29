/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ReactDOM from 'react-dom';
import expect from 'expect';
import AttributesEditor from '../AttributesEditor.jsx';
const constraints = {
    attributes: {
        attribute: {access: "READONLY", name: "cat"}
    }
};
const attributes = [
    {
        "name": "the_geom",
        "type": "gml:Point",
        "localType": "Point"},
    {
        "name": "cat",
        "maxOccurs": 1,
        "type": "xsd:int",
        "localType": "int"}];

describe('Attributes Editor component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('render nothing if not  active', () => {
        ReactDOM.render(<AttributesEditor/>, document.getElementById("container"));
        const container = document.getElementById('container');
        const el = container.querySelector('.ms-rule-editor');
        expect(el).toExist();
        expect(el.style.display).toBe("none");
    });
    it('render attributes', () => {
        ReactDOM.render(<AttributesEditor attributes={attributes} active constraints={constraints} />, document.getElementById("container"));
        const container = document.getElementById('container');
        const rows = container.querySelectorAll('.row');
        expect(rows).toExist();
        expect(rows.length).toBe(3);
    });
    it('render attributes with highlighted DD', () => {
        ReactDOM.render(<AttributesEditor editedAttributes={["cat"]} attributes={attributes} active constraints={constraints} />, document.getElementById("container"));
        const container = document.getElementById('container');
        const rows = container.querySelectorAll('.row');
        const highlights = container.querySelectorAll('.highlighted-dd');
        expect(rows).toExist();
        expect(highlights).toExist();
        expect(rows.length).toBe(3);
        expect(highlights.length).toBe(1);
    });

});
