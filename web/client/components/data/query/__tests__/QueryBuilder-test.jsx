/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import QueryBuilder from '../QueryBuilder';
import standardItemsReference from "../../../../plugins/querypanel/index";
import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();


describe('QueryBuilder', () => {
    let store;
    beforeEach((done) => {
        store = mockStore({
            queryform: {}
        });
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });

    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById("container"));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    const standardItems = Object.keys(standardItemsReference).reduce((prev, cur) => {
        return {...prev, [cur]: standardItemsReference[cur].map(el => ({
            ...el,
            plugin: el.plugin ? (props) => <Provider store={store}><el.plugin {...props} /></Provider> : undefined,
            component: el.component ? (props) => <Provider store={store}><el.component {...props} /></Provider> : undefined
        }))};
    }, {});
    it('creates the QueryBuilder component with his default content', () => {
        const querybuilder = ReactDOM.render(<QueryBuilder/>, document.getElementById("container"));
        expect(querybuilder).toExist();
    });

    it('creates the QueryBuilder component with initial content', () => {
        const groupLevels = 5;

        const groupFields = [{
            id: 1,
            logic: "OR",
            index: 0
        }];

        const filterFields = [{
            rowId: 100,
            groupId: 1,
            attribute: "",
            operator: null,
            value: null,
            exception: null
        }, {
            rowId: 200,
            groupId: 1,
            attribute: "Attribute",
            operator: "=",
            value: "attribute1",
            exception: null
        }];

        const attributes = [{
            id: "Attribute",
            type: "list",
            values: [
                "attribute1",
                "attribute2",
                "attribute3",
                "attribute4",
                "attribute5"
            ]
        }];

        const querybuilder = ReactDOM.render(
            <QueryBuilder
                filterFields={filterFields}
                attributes={attributes}
                groupFields={groupFields}
                groupLevels={groupLevels}
            />,
            document.getElementById("container")
        );

        expect(querybuilder).toExist();
        expect(querybuilder.props.filterFields).toExist();
        expect(querybuilder.props.filterFields.length).toBe(2);
        expect(querybuilder.props.groupFields).toExist();
        expect(querybuilder.props.groupFields.length).toBe(1);
        expect(querybuilder.props.groupLevels).toExist();
        expect(querybuilder.props.groupLevels).toBe(5);
        expect(querybuilder.props.attributes).toExist();
        expect(querybuilder.props.attributes.length).toBe(1);

        const queryBuilderDOMNode = expect(ReactDOM.findDOMNode(querybuilder));

        expect(queryBuilderDOMNode).toExist();
        let childNodes = queryBuilderDOMNode.actual.childNodes;
        expect(childNodes.length).toBe(2);
    });

    it('creates the QueryBuilder component no filter set', () => {
        const groupLevels = 5;

        const groupFields = [];

        const filterFields = [{
            rowId: 100,
            groupId: 1,
            attribute: "",
            operator: null,
            value: null,
            exception: null
        }];

        const attributes = [{
            id: "Attribute",
            type: "list",
            values: [
                "attribute1",
                "attribute2",
                "attribute3",
                "attribute4",
                "attribute5"
            ]
        }];
        const querybuilder = ReactDOM.render(
            <QueryBuilder
                filterFields={filterFields}
                attributes={attributes}
                groupFields={groupFields}
                groupLevels={groupLevels}
                standardItems={standardItems}
            />,
            document.getElementById("container")
        );

        expect(querybuilder).toExist();

        const queryBuilderDOMNode = expect(ReactDOM.findDOMNode(querybuilder));

        expect(queryBuilderDOMNode).toExist();
        let childNodes = queryBuilderDOMNode.actual.childNodes;
        expect(childNodes.length).toBe(2);

        const queryButton = document.getElementById('query-toolbar-query');
        expect(queryButton).toExist();
        expect(queryButton.classList.contains("disabled")).toBe(true);
        // check presence of attribute, spatial and cross layer filter
        expect(document.querySelectorAll('.mapstore-switch-panel').length).toBe(3);
    });
    it('tool options', () => {
        const groupLevels = 5;

        const groupFields = [];

        const filterFields = [{
            rowId: 100,
            groupId: 1,
            attribute: "",
            operator: null,
            value: null,
            exception: null
        }];

        const attributes = [{
            id: "Attribute",
            type: "list",
            values: [
                "attribute1",
                "attribute2",
                "attribute3",
                "attribute4",
                "attribute5"
            ]
        }];

        const querybuilder = ReactDOM.render(
            <QueryBuilder
                toolsOptions={{
                    hideCrossLayer: true,
                    hideSpatialFilter: true
                }}
                filterFields={filterFields}
                attributes={attributes}
                groupFields={groupFields}
                groupLevels={groupLevels}
                standardItems={standardItems}
            />,
            document.getElementById("container")
        );
        expect(querybuilder).toExist();
        // only attribute filter should be shown
        expect(document.querySelectorAll('.mapstore-switch-panel').length).toBe(1);
    });
    it('useEmbeddedMap', () => {
        const groupLevels = 5;

        const groupFields = [];

        const filterFields = [{
            rowId: 100,
            groupId: 1,
            attribute: "",
            operator: null,
            value: null,
            exception: null
        }];

        const attributes = [{
            id: "Attribute",
            type: "list",
            values: [
                "attribute1",
                "attribute2",
                "attribute3",
                "attribute4",
                "attribute5"
            ]
        }];

        const querybuilder = ReactDOM.render(
            <QueryBuilder
                queryPanelEnabled
                toolsOptions={{
                    hideCrossLayer: true,
                    hideSpatialFilter: false,
                    useEmbeddedMap: true
                }}
                filterFields={filterFields}
                attributes={attributes}
                groupFields={groupFields}
                groupLevels={groupLevels}
                standardItems={standardItems}
            />,
            document.getElementById("container")
        );
        expect(querybuilder).toExist();
        // only attribute filter should be shown
        expect(document.querySelectorAll('.mapstore-switch-panel').length).toBe(2);
        expect(document.querySelectorAll('.mapstore-query-map').length).toBe(1);
    });

    it('creates the QueryBuilder component in error state', () => {

        const querybuilder = ReactDOM.render(<QueryBuilder
            featureTypeError={"true"}
            featureTypeErrorText={"bla bla"}
            featureTypeConfigUrl={"randomurl"} />,
        document.getElementById("container"));

        expect(querybuilder).toExist();
    });

    it('shows the QueryPanelHeader component in error state', () => {

        const querybuilder = ReactDOM.render(<QueryBuilder
            featureTypeError={"true"}
            featureTypeErrorText={"bla bla"}
            featureTypeConfigUrl={"randomurl"} />,
        document.getElementById("container"));

        expect(querybuilder).toExist();
        const closeButton = document.getElementById("toc-query-close-button");
        expect(closeButton).toExist();
    });

    it('calls onToggleQuery in error state on click closeButton', () => {
        const controlActions = {onToggleQuery: () => {}};
        const spy =  expect.spyOn(controlActions, 'onToggleQuery');
        let querybuilder;
        TestUtils.act(() => {
            querybuilder =  ReactDOM.render(<QueryBuilder
                controlActions={controlActions}
                featureTypeError={"true"}
                featureTypeErrorText={"bla bla"}
                featureTypeConfigUrl={"randomurl"} />,
            document.getElementById("container"));

        });

        expect(querybuilder).toExist();
        const closeButton = document.getElementById("toc-query-close-button");
        TestUtils.act(() => {
            TestUtils.Simulate.click(closeButton);
        });
        expect(spy).toHaveBeenCalled();
    });

    it('creates the QueryBuilder component with empty filter support', () => {
        const groupLevels = 5;

        const groupFields = [{
            id: 1,
            logic: "OR",
            index: 0
        }];

        const filterFields = [{
            rowId: 100,
            groupId: 1,
            attribute: "",
            operator: null,
            value: null,
            exception: null
        }, {
            rowId: 200,
            groupId: 1,
            attribute: "Attribute",
            operator: "=",
            value: "attribute1",
            exception: null
        }];

        const attributes = [{
            id: "Attribute",
            type: "list",
            values: [
                "attribute1",
                "attribute2",
                "attribute3",
                "attribute4",
                "attribute5"
            ]
        }];

        const querybuilder = ReactDOM.render(
            <QueryBuilder
                filterFields={filterFields}
                attributes={attributes}
                groupFields={groupFields}
                groupLevels={groupLevels}
                allowEmptyFilter
            />,
            document.getElementById("container")
        );

        expect(querybuilder).toExist();

        const queryBuilderDOMNode = expect(ReactDOM.findDOMNode(querybuilder));
        expect(queryBuilderDOMNode).toExist();
        const queryButton = document.getElementById('query-toolbar-query');
        expect(queryButton).toExist();
        expect(queryButton.getAttribute("disabled")).toNotExist();
    });

    it('creates the QueryBuilder component with custom panels support', () => {
        const groupLevels = 5;
        const groupFields = [];
        const filterFields = [{
            rowId: 100,
            groupId: 1,
            attribute: "",
            operator: null,
            value: null,
            exception: null
        }];

        const attributes = [{
            id: "Attribute",
            type: "list",
            values: [
                "attribute1",
                "attribute2",
                "attribute3",
                "attribute4",
                "attribute5"
            ]
        }];

        const querybuilder = ReactDOM.render(
            <QueryBuilder
                filterFields={filterFields}
                attributes={attributes}
                groupFields={groupFields}
                groupLevels={groupLevels}
                allowEmptyFilter
                standardItems={standardItems}
                selectedLayer="gs:us_states__25"
                items={[
                    {
                        id: 'attributeFilter',
                        component: () => null,
                        target: 'attributeFilter',
                        position: 0,
                        layerNameRegex: "^gs:us_states__[0-9]*"
                    },
                    {
                        id: 'attributeFilterNew',
                        component: () => <span className="customPanel">1</span>,
                        target: 'attributes',
                        position: 0
                    },
                    {
                        id: 'customPanel',
                        component: () => <span className="customPanel">2</span>,
                        target: 'attributes',
                        position: 3
                    },
                    {
                        id: 'customPanel2',
                        component: () => <span className="customPanel">3</span>,
                        target: 'start',
                        position: 3
                    }
                ]}
            />,
            document.getElementById("container")
        );

        expect(querybuilder).toExist();
        // only spatial filter and crossLayer filter should be shown
        expect(document.querySelectorAll('.mapstore-switch-panel').length).toBe(2);
        expect(document.querySelectorAll('.customPanel').length).toBe(3);
    });
});
