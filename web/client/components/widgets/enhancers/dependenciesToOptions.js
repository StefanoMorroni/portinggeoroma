/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { compose, withPropsOnChange } from 'recompose';

import { getDependencyLayerParams } from './utils';
import { find } from 'lodash';

const addViewParamsToOptions = ({ dependencies = {}, options, layer = {} }) => {
    const params = getDependencyLayerParams(layer, dependencies);
    const viewParamsKey = find(Object.keys(params || {}), (k = "") => k.toLowerCase() === "viewparams");
    const viewParams = params && viewParamsKey && params[viewParamsKey];
    return {
        options: viewParams ? {
            ...options,
            viewParams
        } : options
    };
};

/**
 * Merges options and original layer's data to get the final options (with viewParams added)
 */
export default compose(
    withPropsOnChange(
        ['dependencies', 'options', 'traces'],
        ({ traces, ...props } = {}) => {
            if (traces) {
                return {
                    traces: traces.map((trace) => {
                        return {
                            ...trace,
                            ...addViewParamsToOptions({ ...trace, dependencies: props.dependencies })
                        };
                    })
                };
            }
            return addViewParamsToOptions(props);
        }
    )

);
