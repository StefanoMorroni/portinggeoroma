/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import TableViewComp from './TableView';
import ChartView from './ChartView';

import WidgetContainer from './WidgetContainer';
import {
    Glyphicon
} from 'react-bootstrap';
import ChartSwitcher from "../builder/wizard/chart/ChartSwitcher";
import emptyTableState from "../../widgets/enhancers/emptyChartState";
import loadingState from '../../misc/enhancers/loadingState';
const TableView = loadingState()(emptyTableState(TableViewComp));

const renderHeaderLeftTopItem = ({ showTable, toggleTableView = () => {}} = {}) => {
    if (showTable) {
        return <Glyphicon onClick={() => {toggleTableView(); }} glyph="arrow-left pull-left"/>;
    }
    return null;
};

const ChartWidget = ({
    id,
    title,
    description,
    headerStyle,
    data = [],
    charts = [],
    selectedChartId,
    traces = [],
    loading,
    icons,
    showTable,
    topRightItems,
    confirmDelete = false,
    dataGrid = {},
    onDelete = () => {},
    toggleTableView = () => {},
    toggleDeleteConfirm = () => {},
    updateProperty = () => { },
    selectionActive,
    ...props}) => {
    const containerId = `widget-chart-${id}`;
    const width = document.getElementById(containerId)?.clientWidth;
    return (<WidgetContainer
        className={"chart-widget-view"}
        id={containerId}
        headerStyle={headerStyle}
        isDraggable={dataGrid.isDraggable}
        title={title}
        icons={icons}
        topLeftItems={renderHeaderLeftTopItem({loading, title, description, showTable, toggleTableView})}
        confirmDelete={confirmDelete}
        onDelete={onDelete}
        toggleDeleteConfirm={toggleDeleteConfirm}
        topRightItems={[
            <ChartSwitcher
                className={'chart-switcher'}
                charts={charts}
                onChange={(...args) => updateProperty(id, ...args)}
                value={selectedChartId}
                disabled={selectionActive}
                width={width}
            />,
            ...(topRightItems ? topRightItems : [])
        ]}
        options={props?.options}
    >
        {showTable
            ? <TableView data={data} {...props}/>
            : <ChartView id={id} isAnimationActive={!loading} loading={loading} data={data} traces={traces} iconFit {...props} />}
    </WidgetContainer>

    );
};

export default ChartWidget;
