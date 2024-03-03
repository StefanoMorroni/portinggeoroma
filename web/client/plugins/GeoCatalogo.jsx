import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import {get} from 'lodash';

import { createPlugin } from '../utils/PluginsUtils';
import Message from '../components/I18N/Message';
import help from '../reducers/help';

export default createPlugin('GeoCatalogo', {
    component: () => null,
    reducers: { help },
    containers: {
        BurgerMenu: {
            name: 'GeoCatalogo',
            position: 1100,
            tooltip: 'GeoCatalogo',
            text: 'GeoCatalogo',
            icon: <Glyphicon glyph="folder-open"/>, 
            action: () => ({type: ''}),
            selector: (state, ownProps) => {
                const docsUrl = get(ownProps, 'docsUrl', 'https://mapstore.readthedocs.io/en/latest/');
                return {href: docsUrl, target: '_blank'};
            },
            priority: 2,
            doNotHide: true
        }, SidebarMenu: {
            name: 'GeoCatalogo',
            position: 1100,
            tooltip: 'GeoCatalogo',
            icon: <Glyphicon glyph="folder-open"/>, 
            action: () => ({type: ''}),
            selector: (state, ownProps) => {
                const docsUrl = get(ownProps, 'docsUrl', 'https://mapstore.readthedocs.io/en/latest/');
                return {href: docsUrl, target: '_blank'};
            },
            priority: 2,
            doNotHide: true,
            toggle: true
        }
    }
});

