/**
  * Copyright 2017, GeoSolutions Sas.
  * All rights reserved.
  *
  * This source code is licensed under the BSD-style license found in the
  * LICENSE file in the root directory of this source tree.
  */

import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import NumberFilter from '../NumberFilter';

const EXPRESSION_TESTS = [
    ["2", "=", 2],
    ["2.", "=", 2],
    ["2.1", "=", 2.1],
    [" 2.1 ", "=", 2.1],
    ["> 2", ">", 2],
    [">= 2", ">=", 2],
    ["< 2", "<", 2],
    ["<= 2", "<=", 2],
    ["=2", "=", 2],
    ["==2", "=", 2],
    ["=== 2", "=", 2],
    ["!== 2", "<>", 2],
    ["!= 2", "<>", 2],
    ["<> 2", "<>", 2],
    ["<> -2", "<>", -2],
    ["", "=", undefined],
    [" ", "=", undefined],
    ["ZZZ", "=", undefined]
];
const testExpression = (spyonChange, spyonValueChange, rawValue, expectedOperator, expectedValue, index) => {
    const input = document.getElementsByTagName("input")[0];
    input.value = rawValue;
    ReactTestUtils.Simulate.change(input);
    const args = spyonChange.calls[index]?.arguments[0];
    const valueArgs = spyonValueChange.calls[index]?.arguments[0];
    if (valueArgs) {        // in case of invalid number expression it will be undefined
        expect(args.value).toBe(expectedValue);
        expect(args.operator).toBe(expectedOperator);
        expect(valueArgs).toBe(rawValue);
    }
};

describe('Test for NumberFilter component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('render with defaults', () => {
        ReactDOM.render(<NumberFilter/>, document.getElementById("container"));
        const el = document.getElementsByClassName("form-control input-sm")[0];
        expect(el).toExist();
    });
    it('render with value', () => {
        ReactDOM.render(<NumberFilter value={1}/>, document.getElementById("container"));
        const el = document.getElementsByClassName("form-control input-sm")[0];
        expect(el).toExist();
        const input = document.getElementsByTagName("input")[0];
        expect(input.value).toBe("1");
    });
    it('Test NumberFilter onChange', () => {
        const actions = {
            onChange: () => {}
        };
        const spyonChange = expect.spyOn(actions, 'onChange');
        ReactDOM.render(<NumberFilter onChange={actions.onChange} />, document.getElementById("container"));

        const input = document.getElementsByTagName("input")[0];
        input.value = "2";
        ReactTestUtils.Simulate.change(input);
        expect(spyonChange).toHaveBeenCalled();
    });
    it('Test NumberFilter validity check', () => {
        const actions = {
            onChange: () => {}
        };
        ReactDOM.render(<NumberFilter onChange={actions.onChange} />, document.getElementById("container"));

        const input = document.getElementsByTagName("input")[0];
        input.value = "ZZZ 2";
        ReactTestUtils.Simulate.change(input);
        expect( document.getElementsByClassName("has-error").length > 0).toBe(true);
    });

    it('Test NumberFilter allow filter update only when expression is valid', () => {
        const actions = {
            onChange: () => {}
        };
        const spyonChange = expect.spyOn(actions, 'onChange');
        ReactDOM.render(<NumberFilter onChange={actions.onChange} />, document.getElementById("container"));

        let input = document.getElementsByTagName("input")[0];
        input.value = "<0.2,>";
        ReactTestUtils.Simulate.change(input);
        expect( document.getElementsByClassName("has-error").length > 0).toBe(true);
        input.value = "<0.2,";
        ReactTestUtils.Simulate.change(input);
        expect( document.getElementsByClassName("has-error").length > 0).toBe(true);
        expect(spyonChange).toNotHaveBeenCalled();
    });
    it('Test NumberFilter expressions', () => {
        const actions = {
            onChange: () => {},
            onValueChange: () => {}
        };
        const spyonChange = expect.spyOn(actions, 'onChange');
        const spyonValueChange = expect.spyOn(actions, 'onValueChange');
        ReactDOM.render(<NumberFilter onChange={actions.onChange} onValueChange={actions.onValueChange} />, document.getElementById("container"));
        EXPRESSION_TESTS.map( (params, index) => testExpression(spyonChange, spyonValueChange, ...params, index));
    });
});
