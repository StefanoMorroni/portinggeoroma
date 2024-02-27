import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import assign from 'object-assign';
import { Glyphicon, Table, Panel, Radio, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import Spinner from "react-spinkit";
import axios from '../libs/ajax';
import qs from 'qs';
import Message from '../components/I18N/Message';
import Dialog from '../components/misc/Dialog';
import Button from '../components/misc/Button';
import {
    caricamentodatiToggle,
    caricamentodatiSpinner,
    caricamentodatiParams,
    caricamentodatiNewFile,
    caricamentodatiDeleteFile,
    fetchMeWorkflows,
    fetchDepartments,
    fetchMeWorkspaces,
    fetchAdminWorkspaces,
    fetchWorkspaceAdministrators
} from './theactions';
import thereducer from './thereducer';
//import theepics from './theepics';
import { success, warning } from '../actions/notifications';


const CaricamentoDatiComponent = (props, context) => {

    const hasGroup = (name) => {
        let nameUppercase = name.toUpperCase();
        return props.group.filter(item => item?.groupName?.toUpperCase() === nameUppercase).length > 0
    }

    const hasGroups = (name) => {
        let nameUppercase = name.toUpperCase();
        return props.group.filter(item => item?.groupName?.toUpperCase().startsWith(nameUppercase)).length > 0
    }

    const onUpload = (acceptedFiles, fileRejections, event) => {
        acceptedFiles.forEach(item => {
            props.caricamentodatiNewFile(item);
        });
    }

    const onRemove = (item) => {
        props.caricamentodatiDeleteFile(item);
    }

    const renderToUpload = (item, onRemove = () => { }) => {
        console.log("[STF]", item);
        const uploadingStatus = item.error ? <Glyphicon glyph="remove" /> : <Glyphicon glyph="ok" />;
        return (<div className="uploading-file" key={item.name}>
            {uploadingStatus}<span className="plugin-name">{item.name}</span>
            <span className="upload-remove" onClick={onRemove}><Glyphicon glyph="trash" /></span>
            <span className="upload-error">{item.error && renderPluginError(item.error)}</span>
        </div>);
    };

    useEffect(() => {
        if (props.caricamentodati.panelElencoCaricamenti) {
            props.fetchMeWorkflows();
        }
    }, [props.caricamentodati.panelElencoCaricamenti]);

    useEffect(() => {
        if (props.caricamentodati.panelNuovoLayer) {
            props.fetchMeWorkspaces();
            props.fetchDepartments();
        }
    }, [props.caricamentodati.panelNuovoLayer]);

    useEffect(() => {
        if (props.caricamentodati.panelAdministration) {
            props.fetchAdminWorkspaces();
        }
    }, [props.caricamentodati.panelAdministration]);

    useEffect(() => {
        props.fetchWorkspaceAdministrators(props.caricamentodati.adminworkspace);
    }, [props.caricamentodati.adminworkspace]);

    if (props.caricamentodati?.spinner) {
        return (
            <Spinner spinnerName="circle" noFadeIn />
        );
    }
    return (
        <div style={{ width: "98%" }}>
            <Panel collapsible expanded={props.caricamentodati.panelElencoCaricamenti} header={<h5 style={{ "backgroundColor": "#8e001c", "color": "white" }}><span onClick={() => props.caricamentodatiParams({ panelElencoCaricamenti: !props.caricamentodati.panelElencoCaricamenti })}>Elenco dei caricamenti</span></h5>}>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th colSpan={8} style={{ textAlign: "left" }}>
                                <OverlayTrigger
                                    placement="right"
                                    rootClose
                                    overlay={<Tooltip>Aggiorna la tabella</Tooltip>}>
                                    <button
                                        type="button"
                                        className="square-button btn btn-primary"
                                        onClick={() => {
                                            props.caricamentodatiParams({ workflows: [] });
                                            props.fetchMeWorkflows();
                                        }}>
                                        <span className="glyphicon-refresh" ></span>
                                    </button>
                                </OverlayTrigger>
                            </th>
                        </tr>
                        <tr>
                            <th>workflow_id</th>
                            <th>approved</th>
                            <th>action</th>
                            <th>approver_role</th>
                            <th>username</th>
                            <th>dataset_id</th>
                            <th>name</th>
                            <th>status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.caricamentodati.workflows.length < 1 && <Spinner spinnerName="circle" noFadeIn />}
                        {props.caricamentodati.workflows?.map((item, index) =>
                            <tr key={index}>
                                <td>{item?.workflow_id}</td>
                                <td>{item?.approved ? 'True' : 'False'}</td>
                                <td>
                                    {!item?.approved && hasGroup(item?.approver_role) &&
                                        <OverlayTrigger
                                            placement="right"
                                            rootClose
                                            overlay={<Tooltip>Approva il caricamento</Tooltip>}>
                                            <button
                                                type="button"
                                                className="square-button btn btn-primary"
                                                onClick={() => {
                                                    axios({
                                                        method: 'PATCH',
                                                        headers: {
                                                            'Accept': 'application/json',
                                                            'Content-Type': 'application/json'
                                                        },
                                                        data: JSON.stringify({ approved: true }),
                                                        url: props?.localConfig?.georoma?.loaderMeWorkflows + '/' + item?.workflow_id,
                                                    })
                                                        .then((response) => {
                                                            props.success({
                                                                title: "Operazione eseguita con successo",
                                                                message: "Operazione eseguita con successo",
                                                                autoDismiss: 6,
                                                                position: "tc"
                                                            });
                                                            props.fetchMeWorkflows();
                                                        }).catch((error) => {
                                                            console.error("[STF]", error);
                                                            props.success({
                                                                title: "Operazione fallita",
                                                                message: "Operazione fallita",
                                                                autoDismiss: 6,
                                                                position: "tc"
                                                            });
                                                        });
                                                }}>
                                                <span className="glyphicon-play" ></span>
                                            </button>
                                        </OverlayTrigger>
                                    }
                                </td>
                                <td>{item?.approver_role}</td>
                                <td>{item?.username}</td>
                                <td>{item?.dataset_id}</td>
                                <td>{item?.name}</td>
                                <td>{item?.status}</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Panel>
            <Panel style={{ display: hasGroups("EDIT_") ? "block" : "none" }} collapsible expanded={props.caricamentodati.panelNuovoLayer} header={<h5 onClick={() => props.caricamentodatiParams({ panelNuovoLayer: !props.caricamentodati.panelNuovoLayer })} style={{ "backgroundColor": "#8e001c", "color": "white" }}>Nuovo layer cartografico</h5>}>
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ "marginTop": "0", "marginBottom": "20px" }}>Nome del layer cartografico</h5>
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            //maxLength="5"
                            //placeholder={getMessageById(context?.messages, "search.addressNumber")}
                            placeholder="Nome del layer"
                            value={props.caricamentodati.title}
                            onChange={(event) => props.caricamentodatiParams({ title: event?.target?.value })}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ "marginTop": "0", "marginBottom": "20px" }}>workspace</h5>
                    </div>
                    <div className="col-md-6">
                        {props?.caricamentodati?.workspaces?.length < 1 ? <Spinner spinnerName="circle" noFadeIn /> :
                            <select
                                value={props.caricamentodati.workspace}
                                style={{ "width": "100%", "padding": "5px" }}
                                onChange={(event) => props.caricamentodatiParams({ workspace: event?.target?.value })}
                            >
                                <option value=""></option>
                                {props.caricamentodati?.workspaces?.map((item, index) => <option key={item.name}>{item.name}</option>)}
                            </select>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ "marginTop": "0", "marginBottom": "20px" }}>Tipo di layer</h5>
                    </div>
                    <div className="col-md-6">
                        <select
                            value={props.caricamentodati.type}
                            style={{ "width": "100%", "padding": "5px" }}
                            onChange={(event) => props.caricamentodatiParams({ type: event?.target?.value })}
                        >
                            <option value="shapefile">shapefile</option>
                            <option value="geopackage">geopackage</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ "marginTop": "0", "marginBottom": "20px" }}>Visibilità</h5>
                    </div>
                    <div className="col-md-6">
                        <select
                            value={props.caricamentodati.visibility}
                            style={{ "width": "100%", "padding": "5px" }}
                            onChange={(event) => props.caricamentodatiParams({ visibilita: event?.target?.value })}
                        >
                            <option value="PUBLIC">Pubblica</option>
                            <option value="CITIZEN">Cittadino</option>
                            <option value="EMPLOYEE">Dipendente</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ "marginTop": "0", "marginBottom": "20px" }}>Gruppi a sistema autorizzati alla visualizzazione del layer cartografico</h5>
                    </div>
                    <div className="col-md-6">
                        {props?.caricamentodati?.departments?.length < 1 ? <Spinner spinnerName="circle" noFadeIn /> :
                            <select
                                multiple={true}
                                size={3}
                                value={props.caricamentodati.viewDepartments}
                                style={{ "width": "100%", "padding": "5px" }}
                                onChange={(event) => props.caricamentodatiParams({ viewDepartments: Array.from(event.target.selectedOptions, item => item.value) })}
                            >
                                {props.caricamentodati?.departments?.map((item, index) => <option key={item}>{item}</option>)}
                            </select>
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ "marginTop": "0", "marginBottom": "20px" }}>Gruppi a sistema autorizzati alla modifica del layer cartografico</h5>
                    </div>
                    <div className="col-md-6">
                        {props?.caricamentodati?.departments?.length < 1 ? <Spinner spinnerName="circle" noFadeIn /> :
                            <select
                                multiple={true}
                                size={3}
                                value={props.caricamentodati.editDepartments}
                                style={{ "width": "100%", "padding": "5px" }}
                                onChange={(event) => props.caricamentodatiParams({ editDepartments: Array.from(event.target.selectedOptions, item => item.value) })}
                            >
                                {props.caricamentodati?.departments?.map((item, index) => <option key={item}>{item}</option>)}
                            </select>
                        }
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className='configure-plugins-step-upload'>
                        <Dropzone
                            key="dropzone"
                            rejectClassName="dropzone-danger"
                            className="dropzone"
                            activeClassName="active"
                            onDrop={onUpload}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                height: "100%",
                                justifyContent: "center"
                            }}>
                                <span style={{
                                    textAlign: "center"
                                }}>
                                    <Message msgId="caricamentodati.uploadlabel" />
                                </span>
                            </div>
                        </Dropzone>
                        <div className="uploads-list">{props.caricamentodati?.toUpload?.sort()?.map((item, idx) => renderToUpload(item, () => onRemove(item)))}</div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-10">
                    </div>
                    <div className="col-md-2">
                        <OverlayTrigger
                            placement="right"
                            rootClose
                            overlay={<Tooltip>Procedi con il caricamento</Tooltip>}>
                            <button
                                type="button"
                                className="square-button btn btn-primary"
                                aria-label="salva"
                                onClick={() => {
                                    props.caricamentodatiSpinner(true);

                                    var formData = new FormData();
                                    props.caricamentodati?.toUpload.forEach(item => {
                                        formData.append("files", item);
                                    })

                                    let url = props?.localConfig?.georoma?.loaderWorkflows +
                                        '?type=' + props.caricamentodati.type +
                                        '&visibility=' + props.caricamentodati.visibility +
                                        '&workspace=' + props.caricamentodati.workspace +
                                        '&title=' + props.caricamentodati.title;
                                    props.caricamentodati.viewDepartments.forEach(item => {
                                        url += '&view_department=' + item
                                    })
                                    props.caricamentodati.editDepartments.forEach(item => {
                                        url += '&edit_department=' + item
                                    })
                                    axios({
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'multipart/form-data'
                                        },
                                        data: formData,
                                        url
                                    })
                                        .then((response) => {
                                            props.caricamentodatiSpinner(false);
                                            console.log("[STF] caricamentodati", props?.localConfig?.georoma?.loaderWorkflows, "-->", response?.data);
                                            props.success({
                                                title: "Operazione eseguita con succeso",
                                                message: 'dataset: ' + response?.data?.dataset,
                                                autoDismiss: 6,
                                                position: "tc"
                                            });
                                            props.fetchMeWorkflows();
                                        }).catch((error) => {
                                            props.caricamentodatiSpinner(false);
                                            console.error("[STF] caricamentodati", error);
                                            props.success({
                                                title: "Salvataggio fallito",
                                                message: 'salvataggio fallito',
                                                autoDismiss: 6,
                                                position: "tc"
                                            });
                                        });
                                }}
                            >
                                <span className="glyphicon glyphicon-floppy-disk"></span>
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>
            </Panel>
            <Panel style={{ display: hasGroups("ADMIN_") ? "block" : "none" }} collapsible expanded={props.caricamentodati.panelAdministration} header={<h5 onClick={() => props.caricamentodatiParams({ panelAdministration: !props.caricamentodati.panelAdministration })} style={{ "backgroundColor": "#8e001c", "color": "white" }}>Amministrazione</h5>}>
                {/* prima si sceglie il workspace 
                poi da una parte c'è la lista degli utenti selezionabili e dall'altra la lista degli utenti selezionati
                con il tasto > l'utente diventa amministratore
                con il tasto < l'utente perde il ruolo di amministratore

                in pratica bisogna copiare <Transfer/>
                
                */}
                <div className="row">
                    <div className="col-md-6">
                        <h5 style={{ "marginTop": "0", "marginBottom": "20px" }}>workspace</h5>
                    </div>
                    <div className="col-md-6">
                        {props?.caricamentodati?.adminworkspaces?.length < 1 ? <Spinner spinnerName="circle" noFadeIn /> :
                            <select
                                value={props.caricamentodati.adminworkspace}
                                style={{ "width": "100%", "padding": "5px" }}
                                onChange={(event) => props.caricamentodatiParams({ adminworkspace: event?.target?.value })}
                            >
                                <option value=""></option>
                                {props.caricamentodati?.adminworkspaces?.map((item, index) => <option key={item.name}>{item.name}</option>)}
                            </select>
                        }
                    </div>
                </div>

            </Panel>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        mapInfoEnabled: state?.mapInfo?.enabled,
        caricamentodati: state?.caricamentodati,
        localConfig: state?.localConfig,
        query: state?.query || {},
        layers: state?.layers,
        user: state?.security?.user || {},
        group: state?.security?.user?.groups?.group || []
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        caricamentodatiToggle,
        caricamentodatiSpinner,
        caricamentodatiParams,
        caricamentodatiNewFile,
        caricamentodatiDeleteFile,
        fetchMeWorkflows,
        fetchDepartments,
        fetchMeWorkspaces,
        fetchAdminWorkspaces,
        fetchWorkspaceAdministrators,
        success,
        warning
    }, dispatch);
};

export const CaricamentoDatiPlugin = assign(connect(mapStateToProps, mapDispatchToProps)(CaricamentoDatiComponent), {});
export const reducers = { caricamentodati: thereducer };
//export const epics = theepics;
