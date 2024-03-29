/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Toolbar from '../../../../misc/toolbar/Toolbar';

const getSaveTooltipId = (step, {id} = {}) => {
    if (id) {
        return "widgets.builder.wizard.updateWidget";
    }
    return "widgets.builder.wizard.addTheWidget";
};

export default ({ step = 0, editorData = {}, stepButtons = [], onFinish = () => {}} = {}) => (<Toolbar btnDefaultProps={{
    bsStyle: "primary",
    bsSize: "sm",
    className: "square-button-md"
}}
buttons={[...stepButtons, {
    onClick: () => onFinish(Math.min(step + 1, 1)),
    visible: step === 0,
    glyph: "floppy-disk",
    tooltipId: getSaveTooltipId(step, editorData)
}]} />);
