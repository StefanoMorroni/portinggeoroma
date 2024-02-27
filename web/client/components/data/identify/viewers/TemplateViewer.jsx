/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { template } from 'lodash';
import { getCleanTemplate } from '../../../../utils/TemplateUtils';
import HtmlRenderer from '../../../misc/HtmlRenderer';
import { livello2Toggle } from '../../../../livello2/theActions';
import { getMessageById } from '../../../../utils/LocaleUtils';
import HTML from '../../../../components/I18N/HTML';


const TemplateViewer = (props, context) => {
    const { layer, response, ...other } = props;
    return (
        <div className="ms-template-viewer">
            {response.features
                .filter(feature => {
                    if (feature?.properties?.RED_BAND) return false;
                    if (feature?.geometry == null) return false
                    return true;
                })
                .map((feature, i) =>
                    <div key={i}>
                        <HtmlRenderer html={template(getCleanTemplate(layer.featureInfo && layer.featureInfo.template || '', feature, /\$\{.*?\}/g, 2, 1))(feature)} />
                        {feature?.properties?.EXTRA_INFO && <a href="javascript:void(0)" onClick={() => props.livello2Toggle(layer, feature)}>{getMessageById(context?.messages, "livello2.title")}</a>}
                    </div>
                )
            }
            {response.features.filter(feature => !feature?.properties?.RED_BAND).length == 0 && <h4><HTML msgId="noFeatureInfo"/></h4>}
        </div>
    );
}

var mapDispatchToProps = function (dispatch) {
    return {
        livello2Toggle: function (layer, feature) {
            dispatch(livello2Toggle(layer, feature));
            //dispatch(mapInfo.closeIdentify());
        },
    };
};

TemplateViewer.contextTypes = {messages: PropTypes.object};
export default connect(null,mapDispatchToProps)(TemplateViewer);