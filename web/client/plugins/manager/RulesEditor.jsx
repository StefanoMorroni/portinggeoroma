/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import PropTypes from 'prop-types';
import { isSaveDisabled, isRulePristine, isRuleValid, askConfirm } from '../../utils/RulesEditorUtils';
import Message from '../../components/I18N/Message';
import BorderLayout from '../../components/layout/BorderLayout';
import Header from '../../components/manager/rulesmanager/ruleseditor/Header';
import MainEditor from '../../components/manager/rulesmanager/ruleseditor/EditMain';
import StylesEditor from '../../components/manager/rulesmanager/ruleseditor/StylesEditor';
import FiltersEditor from '../../components/manager/rulesmanager/ruleseditor/FiltersEditor';
import AttributesEditor from '../../components/manager/rulesmanager/ruleseditor/AttributesEditor';
import ModalDialog from '../../components/manager/rulesmanager/ModalDialog';


class RuleEditor extends React.Component {
    static propTypes = {
        initRule: PropTypes.object,
        disableDetails: PropTypes.bool,
        activeRule: PropTypes.object,
        activeEditor: PropTypes.string,
        onNavChange: PropTypes.func,
        setOption: PropTypes.func,
        setConstraintsOption: PropTypes.func,
        onExit: PropTypes.func,
        onSave: PropTypes.func,
        onDelete: PropTypes.func,
        styles: PropTypes.array,
        type: PropTypes.string,
        properties: PropTypes.array,
        loading: PropTypes.bool,
        cleanConstraints: PropTypes.func,
        layer: PropTypes.object
    }
    static defaultProps = {
        activeEditor: "1",
        onNavChange: () => {},
        setOption: () => {},
        onExit: () => {},
        onSave: () => {},
        onDelete: () => {},
        type: ""
    }
    constructor(props) {
        super(props);
        this.state = {
            editedAttributes: []
        };
    }
    render() {
        const { loading, activeRule, layer, activeEditor, onNavChange, initRule, styles = [], setConstraintsOption, type, properties, disableDetails} = this.props;
        const {modalProps} = this.state || {};
        return (
            <BorderLayout
                className="bg-body"
                header={<Header
                    disableDetails={disableDetails}
                    layer={layer}
                    loading={loading}
                    type={type}
                    onSave={this.save}
                    onExit={this.cancelEditing}
                    activeTab={activeEditor}
                    disableSave={isSaveDisabled(activeRule, initRule)}
                    rule={activeRule}
                    onNavChange={onNavChange}/>}
            >
                <MainEditor key="main-editor" rule={activeRule} setOption={this.setOption} active={activeEditor === "1"}/>
                <StylesEditor styles={styles} key="styles-editor" constraints={activeRule && activeRule.constraints} setOption={setConstraintsOption} active={activeEditor === "2"}/>
                <FiltersEditor layer={layer} key="filters-editor" setOption={setConstraintsOption} constraints={activeRule && activeRule.constraints} active={activeEditor === "3"}/>
                <AttributesEditor editedAttributes={this.state.editedAttributes} setEditedAttributes={this.handleSetEditedAttrbiutes.bind(this)} key="attributes-editor" active={activeEditor === "4"} attributes={properties} constraints={activeRule && activeRule.constraints} setOption={setConstraintsOption}/>
                <ModalDialog {...modalProps}/>
            </BorderLayout>);
    }
    clearHighlighedEditsInAttributes() {
        this.setState({ editedAttributes: [] });
    }
    handleSetEditedAttrbiutes(attr) {
        this.setState({ editedAttributes: [...this.state.editedAttributes, attr] });
    }
    cancelEditing = () => {
        const {activeRule, initRule, onExit} = this.props;
        if (!isRulePristine(activeRule, initRule)) {
            this.setState( () => ({modalProps: {title: "featuregrid.toolbar.saveChanges",
                showDialog: true, buttons: [{
                    text: <Message msgId="no"/>,
                    bsStyle: 'primary',
                    onClick: this.cancel
                },
                {
                    text: <Message msgId="yes"/>,
                    bsStyle: 'primary',
                    onClick: () => {
                        // check if there is edits in attributes clear highlight
                        this.state.editedAttributes.length && this.clearHighlighedEditsInAttributes();
                        onExit();
                    }
                }
                ], closeAction: this.cancel, msg: "map.details.sureToClose"}}));
        } else {
            onExit();
        }
    }
    cancel = () => {
        this.setState( () => ({modalProps: {showDialog: false}}));
    }
    save = () => {
        const {activeRule, onSave} = this.props;
        if (isRuleValid(activeRule)) {
            // check if there is edits in attributes clear highlight
            this.state.editedAttributes.length && this.clearHighlighedEditsInAttributes();
            onSave(activeRule);
        } else {
            this.setState( () => ({modalProps: {title: "featuregrid.toolbar.saveChanges",
                showDialog: true, buttons: [
                    {
                        text: 'Ok',
                        bsStyle: 'primary',
                        onClick: this.cancel
                    }
                ], closeAction: this.cancel, msg: "rulesmanager.invalidForm"}}));
        }
    }
    setOption = ({key, value}) => {
        if (askConfirm(this.props.activeRule, key, value)) {
            this.setState( () => ({modalProps: {title: "rulesmanager.resetconstraints",
                showDialog: true, buttons: [{
                    text: <Message msgId="no"/>,
                    bsStyle: 'primary',
                    onClick: this.cancel
                },
                {
                    text: <Message msgId="yes"/>,
                    bsStyle: 'primary',
                    onClick: () => {
                        this.cancel();
                        this.props.setOption({key, value});
                        this.props.cleanConstraints(key === 'grant');
                    }
                }
                ], closeAction: this.cancel, msg: "rulesmanager.constraintsmsg"}}));

        } else {
            this.props.setOption({key, value});
        }

    }
}
export default RuleEditor;
