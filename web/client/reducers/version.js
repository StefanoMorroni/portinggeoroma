/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CHANGE_VERSION, LOAD_VERSION_ERROR } from '../actions/version';
import { parseCommitDataMessage } from '../utils/VersionUtils';
/**
 * Manages the state of the version identifier
 * @prop {string} current mapstore version identifier
 * @prop {string} message the commit name
 * @prop {string} commit the commit sha
 * @prop {string} date the date when the commit has been created
 * @prop {string} githubUrl url to use as target for <a> tag inside a button
 *
 * @example
 *{
 *  current: '2017.00.04'
 *}
 * @memberof reducers
 */
function version(state = parseCommitDataMessage(__COMMIT_DATA__), action) {
    switch (action.type) {
    case CHANGE_VERSION: {
        return {
            ...state,
            current: action.version
        };
    }
    case LOAD_VERSION_ERROR: {
        return {
            ...state,
            current: 'no-version'
        };
    }
    default:
        return state;
    }
}

export default version;
