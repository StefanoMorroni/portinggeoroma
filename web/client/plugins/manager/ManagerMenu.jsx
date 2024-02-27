/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import assign from 'object-assign';
import { isPageConfigured } from '../../selectors/plugins';
import tooltip from '../../components/misc/enhancers/tooltip';

import { DropdownButton, Glyphicon, MenuItem } from 'react-bootstrap';

const TDropdownButton = tooltip(DropdownButton);
const Container = connect(() => ({
    noCaret: true,
    pullRight: true,
    bsStyle: "primary",
    title: <Glyphicon glyph="1-menu-manage"/>,
    tooltipId: "manager.managerMenu",
    tooltipPosition: "bottom"
}), {})(TDropdownButton);

import ToolsContainer from '../containers/ToolsContainer';
import Message from '../locale/Message';
import { itemSelected } from '../../actions/manager';
import '../burgermenu/burgermenu.css';

class ManagerMenu extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        dispatch: PropTypes.func,
        role: PropTypes.string,
        entries: PropTypes.array,
        title: PropTypes.node,
        onItemClick: PropTypes.func,
        itemSelected: PropTypes.func,
        controls: PropTypes.object,
        panelStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        enableRulesManager: PropTypes.bool,
        enableImporter: PropTypes.bool,
        enableContextManager: PropTypes.bool
    };

    static contextTypes = {
        messages: PropTypes.object,
        router: PropTypes.object
    };

    static defaultProps = {
        id: "mapstore-manager-menu",
        entries: [
        {
            "msgId": "caricamentodati.title",
            "glyph": "upload",
            "path": "/caricamentodati"
        },
        {
            "msgId": "users.title",
            "glyph": "1-group-mod",
            "path": "/manager/usermanager"
        },
        {
            "msgId": "contextManager.title",
            "glyph": "wrench",
            "path": "/context-manager"
        },
        {
            "msgId": "rulesmanager.menutitle",
            "glyph": "admin-geofence",
            "path": "/rules-manager"
        },
        {
            "msgId": "importer.title",
            "glyph": "upload",
            "path": "/importer"
        }],
        role: "",
        onItemClick: () => {},
        itemSelected: () => {},
        title: <MenuItem header>Manager</MenuItem>,
        controls: [],
        panelStyle: {
            minWidth: "300px",
            right: "52px",
            zIndex: 100,
            position: "absolute",
            overflow: "auto"
        },
        panelClassName: "toolbar-panel",
        enableContextManager: false
    };

    hasGroups = (name) => {
        let nameUppercase = name.toUpperCase();
        let retValue = false;
        if (this.props?.groups?.group) {
            retValue = this.props?.groups?.group.filter(item => item?.groupName?.toUpperCase().startsWith(nameUppercase)).length > 0;
        } else {
            retValue = this.props?.groups.filter(item => item?.groupName?.toUpperCase().startsWith(nameUppercase)).length > 0;
        }
        console.log("[STF] ManagerMenu.hasGroups()", nameUppercase, retValue);
        return retValue;
    }

    getTools = () => {
        return [
            //{element:<span key="burger-menu-title">{this.props.title}</span>},
        ...this.props.entries
            .filter(e => {
                if (this.props.role === "ADMIN" && e.path === "/manager/usermanager") {
                    return true
                } else if (this.props.role === "ADMIN" && e.path === "/rules-manager" && this.props.enableRulesManager) {
                    return true
                } else if (this.props.role === "ADMIN" && e.path === "/importer" && this.props.enableImporter) {
                    return true
                } else if (this.props.role === "ADMIN" && e.path === "/context-manager" && this.props.enableContextManager) {
                    return true
                } else if ((this.hasGroups("EDIT_") || this.hasGroups("ADMIN_")) && e.path === "/caricamentodati") {
                    return true
                }
                return false;
            }) 
            .sort((a, b) => a.position - b.position)
            .map((entry) => {
                console.log("[STF] ManagerMenu.getTools() entry:", JSON.stringify(entry));
                return {
                    action: (context) => {
                        context.router.history.push(entry.path);
                        this.props.itemSelected(entry.id);
                        return {
                            type: "@@router/LOCATION_CHANGE",
                            payload: {
                                action: context.router.history.action,
                                isFirstRendering: false,
                                location: context.router.history.location
                            }
                        };
                    },
                    text: entry.msgId ? <Message msgId={entry.msgId} /> : entry.text,
                    cfg: {...entry}
                };
            })
        ];
    };

    render() {
        const tools = this.getTools();
        if (tools.length < 1) return null;
        return (
            <ToolsContainer id={this.props.id} className="square-button"
                container={Container}
                mapType={this.props.mapType}
                toolStyle="primary"
                activeStyle="default"
                stateSelector="burgermenu"
                eventSelector="onSelect"
                tool={MenuItem}
                tools={tools}
                panelStyle={this.props.panelStyle}
                panelClassName={this.props.panelClassName}
            />);
    }
}

const IMPORTER_ID = 'importer';
const RULE_MANAGER_ID = 'rulesmanager';

/**
 * This plugin provides a special Manager dropdown menu, that contains various administration tools
 * @memberof plugins
 * @name ManagerMenu
 * @class
 * @prop {boolean} cfg.enableContextManager: enable context manager menu entry, default `true`
 */
export default {
    ManagerMenuPlugin: assign(connect((state) => ({
        enableRulesManager: isPageConfigured(RULE_MANAGER_ID)(state),
        enableImporter: isPageConfigured(IMPORTER_ID)(state),
        controls: state.controls,
        security: state.security,
        role: state?.security?.user?.role,
        groups: state?.security?.user?.groups || []
    }), {
        itemSelected
    })(ManagerMenu), {
        OmniBar: {
            name: "managermenu",
            position: 1,
            tool: true,
            priority: 1
        }
    }),
    reducers: {}
};
