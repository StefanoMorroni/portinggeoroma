/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import React from 'react';
import {Glyphicon, ControlLabel, Tooltip } from 'react-bootstrap';
import uuidv1 from 'uuid/v1';
import bbox from '@turf/bbox';
import Toolbar from '../../misc/toolbar/Toolbar';
import OverlayTrigger from '../../misc/OverlayTrigger';
import cs from 'classnames';
import Message from '../../I18N/Message';
import {get} from 'lodash';
import {DEFAULT_ANNOTATIONS_STYLES, getStartEndPointsForLinestring, getGeometryGlyphInfo, getGeometryType} from '../../../utils/LegacyAnnotationsUtils';

/**
 * Feature List component for Annotation Viewer.
 * @memberof components.mapControls.annotations
 * @function
 *
*/
const FeaturesList = (props) => {
    const {
        editing,
        onAddGeometry,
        onSetStyle,
        onStartDrawing,
        onAddText,
        onStyleGeometry,
        setTabValue,
        isMeasureEditDisabled,
        onSetAnnotationMeasurement,
        showPopupWarning,
        setPopupWarning,
        geodesic,
        defaultStyles,
        defaultPointType,
        onValidateFeature,
        validateFeatures
    } = props;
    const {features = []} = editing || {};
    const isValidFeature = get(props, "selected.properties.isValidFeature", true);
    const areAllFeaturesValid = validateFeatures();

    const onClickGeometry = (type, style) => {
        onStyleGeometry(false);
        onAddGeometry(type);
        type === "Text" && onAddText();
        onSetStyle(style);
        onStartDrawing({geodesic});
        setTabValue('coordinates');
        onValidateFeature();
    };
    const circleCenterStyles = defaultPointType === "symbol" ? defaultStyles.POINT?.[defaultPointType] : DEFAULT_ANNOTATIONS_STYLES.Point;

    const linePointStyles = defaultPointType === "symbol" ?  [{...defaultStyles.POINT?.[defaultPointType], highlight: true, iconAnchor: [0.5, 0.5], type: "Point", title: "StartPoint Style", geometry: "startPoint", filtering: false, id: uuidv1()},
        {...defaultStyles.POINT?.[defaultPointType], highlight: true, iconAnchor: [0.5, 0.5], type: "Point", title: "EndPoint Style", geometry: "endPoint", filtering: false, id: uuidv1()}] : getStartEndPointsForLinestring();

    return (
        <>
            <div className={'geometries-toolbar'}>
                <ControlLabel><Message msgId={"annotations.geometries"}/></ControlLabel>
                <Toolbar
                    btnDefaultProps={{
                        className: 'square-button-md no-border'
                    }}
                    buttons={[
                        {
                            glyph: editing?.properties?.iconGlyph,
                            visible: !isMeasureEditDisabled,
                            disabled: !isValidFeature,
                            onClick: () => {
                                showPopupWarning ? setPopupWarning(true) : onSetAnnotationMeasurement();
                            },
                            tooltip: <Message msgId="annotations.editMeasurement" />
                        },
                        {
                            glyph: 'point-plus',
                            visible: isMeasureEditDisabled,
                            disabled: !isValidFeature,
                            onClick: () => {
                                const style = [{ ...defaultStyles.POINT?.[defaultPointType], highlight: true, id: uuidv1()}];
                                onClickGeometry("Point", style);
                            },
                            tooltip: <Message msgId="annotations.titles.marker" />
                        },
                        {
                            glyph: 'polyline-plus',
                            visible: isMeasureEditDisabled,
                            disabled: !isValidFeature,
                            onClick: () => {
                                const style = [{ ...DEFAULT_ANNOTATIONS_STYLES.LineString, highlight: true, id: uuidv1()}]
                                    .concat(linePointStyles);
                                onClickGeometry("LineString", style);
                            },
                            tooltip: <Message msgId="annotations.titles.line" />
                        },
                        {
                            glyph: 'polygon-plus',
                            visible: isMeasureEditDisabled,
                            disabled: !isValidFeature,
                            onClick: () => {
                                const style = [
                                    {...DEFAULT_ANNOTATIONS_STYLES.Polygon, highlight: true, id: uuidv1()}];
                                onClickGeometry("Polygon", style);
                            },
                            tooltip: <Message msgId="annotations.titles.polygon" />
                        },
                        {
                            glyph: 'font-add',
                            visible: isMeasureEditDisabled,
                            disabled: !isValidFeature,
                            onClick: () => {
                                const style = [
                                    {...DEFAULT_ANNOTATIONS_STYLES.Text, highlight: true, type: "Text", title: "Text Style", id: uuidv1()}];
                                onClickGeometry("Text", style);
                            },
                            tooltip: <Message msgId="annotations.titles.text" />
                        },
                        {
                            glyph: '1-circle-add',
                            visible: isMeasureEditDisabled,
                            disabled: !isValidFeature,
                            onClick: () => {
                                const style = [
                                    {...DEFAULT_ANNOTATIONS_STYLES.Circle, highlight: true, type: "Circle", title: "Circle Style", id: uuidv1()},
                                    { ...circleCenterStyles, highlight: true, iconAnchor: [0.5, 0.5], type: "Point", title: "Center Style", filtering: false, geometry: "centerPoint", id: uuidv1()}
                                ];
                                onClickGeometry("Circle", style);
                            },
                            tooltip: <Message msgId="annotations.titles.circle" />
                        }
                    ]}
                />
            </div>
            {features && features.length === 0 && <div style={{ textAlign: 'center' }}><Message msgId="annotations.addGeometry"/></div>}
            {features?.map((feature, key) => {
                return (
                    <FeatureCard disabled={!areAllFeaturesValid} onValidateFeature={onValidateFeature} feature={feature} key={key} {...props}/>
                );
            })}
        </>
    );
};

/**
 * Feature or Geometry card component for FeatureList.
 * @function
 *
 */
const FeatureCard = ({
    feature,
    selected,
    disabled,
    onDeleteGeometry,
    onZoom,
    maxZoom,
    onSelectFeature,
    onUnselectFeature,
    setTabValue,
    isMeasureEditDisabled,
    onStyleGeometry,
    onGeometryHighlight,
    onValidateFeature
}) => {
    const type = getGeometryType(feature);
    const {properties} = feature;
    const {glyph, label} = getGeometryGlyphInfo(type);
    const isSelected = selected?.properties?.id === properties?.id;

    const selectedIsValidFeature = get(selected, "properties.isValidFeature", true);
    const isValidFeature = properties?.isValidFeature;
    const allowCardMouseEvent = !isSelected && selectedIsValidFeature;

    const overlayWrapper = (content) => (
        <OverlayTrigger placement="left" overlay={<Tooltip><Message msgId="annotations.resolveAllErrors"/></Tooltip>}>
            {content}
        </OverlayTrigger>
    );

    const content = (
        <div
            className={cs('geometry-card', {'ms-selected': isSelected, 'ms-disabled': disabled && !isSelected})}
            onMouseEnter={() => allowCardMouseEvent && onGeometryHighlight(properties.id)}
            onMouseLeave={() => allowCardMouseEvent && onGeometryHighlight(properties.id, false)}
            onClick={() =>{

                if (isSelected && isValidFeature) {
                    onUnselectFeature();
                    onGeometryHighlight(properties.id);
                } else if (!disabled) {
                    onSelectFeature([feature]);
                    setTabValue(isMeasureEditDisabled ? 'coordinates' : 'style');
                    onStyleGeometry(!isMeasureEditDisabled);
                }
                onValidateFeature();
            } }
        >
            <div className="geometry-card-preview">
                <Glyphicon glyph={glyph}/>
            </div>
            <div className="geometry-card-label">
                <div>{properties?.geometryTitle || label || properties?.id}</div>
            </div>
            <Toolbar
                btnDefaultProps={{
                    className: 'square-button-md no-border'
                }}
                buttons={[
                    {
                        glyph: 'zoom-to',
                        visible: isValidFeature,
                        className: cs({'inactive': disabled && !isSelected, 'square-button-md no-border': true}),
                        tooltip: <Message msgId="annotations.zoomToGeometry"/>,
                        onClick: (event) => {
                            event.stopPropagation();
                            const extent = bbox(feature);
                            onZoom(extent, 'EPSG:4326', maxZoom);
                        }
                    },
                    {
                        glyph: 'trash',
                        className: cs({'inactive': disabled && !isSelected, 'square-button-md no-border': true}),
                        tooltip: <Message msgId="annotations.removeGeometry"/>,
                        onClick: (event) => {
                            event.stopPropagation();
                            onDeleteGeometry(properties?.id);
                        }
                    }
                ]}
            />
        </div>
    );

    return disabled && !isSelected ? overlayWrapper(content) : content;
};

FeaturesList.defaultProps = {
    onAddGeometry: () => {},
    onSetStyle: () => {},
    onStartDrawing: () => {},
    onAddText: () => {},
    onStyleGeometry: () => {},
    onSetAnnotationMeasurement: () => {},
    onSelectFeature: () => {},
    setTabValue: () => {},
    isMeasureEditDisabled: true,
    defaultPointType: 'marker',
    defaultStyles: {},
    onValidateFeature: () => {},
    validateFeatures: () => { return true; }
};

export default FeaturesList;
