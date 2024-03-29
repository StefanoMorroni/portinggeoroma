/*
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';

import React from 'react';
import { Tooltip } from 'react-bootstrap';
import OverlayTrigger from '../../misc/OverlayTrigger';
import { getTitleAndTooltip } from '../../../utils/TOCUtils';
import './css/toctitle.css';

class Title extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        onClick: PropTypes.func,
        onContextMenu: PropTypes.func,
        currentLocale: PropTypes.string,
        filterText: PropTypes.string,
        tooltip: PropTypes.bool,
        tooltipOptions: PropTypes.object
    };

    static defaultProps = {
        onClick: () => {},
        onContextMenu: () => {},
        currentLocale: 'en-US',
        filterText: '',
        tooltip: false,
        tooltipOptions: {
            maxLength: 807,
            separator: " - "
        }
    };

    getFilteredTitle = (title) => {
        const regularExpression = new RegExp(this.props.filterText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');
        const matches = title.match(regularExpression);

        if (!this.props.filterText || !matches) {
            return title;
        }

        return title.split(regularExpression).map((split, idx) => {
            if (idx < matches.length) {
                return [...split, <strong key={idx}>{matches[idx]}</strong>];
            }
            return split;
        });
    };

    renderTitle = () => {
        const {title} = getTitleAndTooltip(this.props);
        return (
            <div className="toc-title" onClick={this.props.onClick ? (e) => this.props.onClick(this.props.node.id, 'layer', e.ctrlKey) : () => {}} onContextMenu={(e) => {e.preventDefault(); this.props.onContextMenu(this.props.node); }}>
                {this.getFilteredTitle(title)}
            </div>
        );
    };

    render() {
        const {tooltipText} = getTitleAndTooltip(this.props);
        return this.props.tooltip && tooltipText ? (
            <OverlayTrigger placement={this.props.node.tooltipPlacement || "top"} overlay={(<Tooltip id={"tooltip-layer-title"}>{tooltipText}</Tooltip>)}>
                {this.renderTitle()}
            </OverlayTrigger>
        ) : this.renderTitle();
    }
}


export default Title;
