import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import assign from 'object-assign';
import { Glyphicon, Table, Panel } from 'react-bootstrap';
import Message from '../components/I18N/Message';
import Dialog from '../components/misc/Dialog';
import { livello2Toggle } from './theActions';
import theReducer from './theReducer';


const TheComponent = (props, context) => {
    const l2 = props?.feature?.properties?.EXTRA_INFO ? JSON.parse(props.feature.properties.EXTRA_INFO) : {};
    const theSTRUMENTO = [];
    if (l2.STRUMENTO && l2.STRUMENTO.length > 0) {
        l2.STRUMENTO.forEach((item, index) => {
            Object.keys(item).forEach(item2 => {
                theSTRUMENTO.push(<h5><b>{item2.replaceAll('_',' ')}:</b> {item[item2]}</h5>);
            });
        });
    }
    const thePARCO = [];
    if (l2.PARCO && l2.PARCO.length > 0) {
        l2.PARCO.forEach((item, index) => {
            Object.keys(item).forEach(item2 => {
                thePARCO.push(<h5><b>{item2.replaceAll('_',' ')}:</b> {item[item2]}</h5>);
            });
        });
    }
    const theBIBL = [];
    if (l2.BIBL && l2.BIBL.length > 0) {
        l2.BIBL.forEach((item, index) => {
            Object.keys(item).forEach(item2 => {
                theBIBL.push(<h5><b>{item2.replaceAll('_',' ')}:</b> {item[item2]}</h5>);
            });
            theBIBL.push(<hr/>);
        });
    }
    const theCL = [];
    if (l2.CL && l2.CL.length > 0) {
        l2.CL.forEach((item, index) => {
            Object.keys(item).forEach(item2 => {
                theCL.push(<h5><b>{item2.replaceAll('_',' ')}:</b> {item[item2]}</h5>);
            });
        });
    }
    const theART11 = [];
    if (l2.ART11 && l2.ART11.length > 0) {
        l2.ART11.forEach((item, index) => {
            Object.keys(item).forEach(item2 => {
                theART11.push(<h5><b>{item2.replaceAll('_',' ')}:</b> {item[item2]}</h5>);
            });
        });
    }
    const theLEGENDA = [];
    if (l2.LEGENDA && l2.LEGENDA.length > 0) {
        theLEGENDA.push(<h2>Legenda</h2>);
        theLEGENDA.push(<h5><b>{props?.layer?.title}</b></h5>);
        l2.LEGENDA.forEach((item, index) => {
            Object.keys(item).forEach(item2 => {
                if (item2 === "NORME_TECNICHE_DI_ATTUAZIONE") {
                    theLEGENDA.push(<h5><b>NORME TECNICHE DI ATTUAZIONE:</b></h5>);
                    theLEGENDA.push(item.NORME_TECNICHE_DI_ATTUAZIONE.map((item2, index) => <h5><a key={index} href={item2.LINK} target="_blank">{item2?.KEY}</a></h5>));
                } else {
                    theLEGENDA.push(<h5><b>{item2.replaceAll('_',' ')}:</b> {item[item2]}</h5>);
                }
            });
        });
    }
    return (
        <Dialog
            id="livello2-dialog"
            style={{ zIndex: 1992, display: props.visible ? "block" : "none" }}
            modal
            draggable
        >
            <div key="header" role="heading" aria-level="1">
                <Message key="title" msgId="livello2.title" />
                <button aria-label="close" key="livello2-close" className="close" onClick={() => props.livello2Toggle()} >
                    <span className="glyphicon glyphicon-1-close"></span>
                </button>
            </div>
            <div key="body" role="region">
                {l2.LEGENDA && l2.LEGENDA.length > 0 &&
                    <p>{theLEGENDA}</p>
                }
                {l2.STRUMENTO && l2.STRUMENTO.length > 0 &&
                    <p>
                        <h2>Strumento di Attuazione</h2>
                        {theSTRUMENTO}
                    </p>
                }
                {l2.PARCO && l2.PARCO.length > 0 &&
                    <p>
                        <h2>Parco</h2>
                        {thePARCO}
                    </p>
                }
                {l2.CL && l2.CL.length > 0 &&
                    <p>
                        <h2>Strumento di attuazione Indiretta</h2>
                        {theCL}
                    </p>
                }
                {l2.ALLEGATO && l2.ALLEGATO.length > 0 &&
                    <p>
                        <h2>Allegati</h2>
                        {l2.ALLEGATO.map((item, index) => <h5><a key={index} href={item.LINK} target="_blank">{item?.TITOLO}</a></h5>)}
                    </p>
                }
                {l2.BIBL && l2.BIBL.length > 0 &&
                    <p>
                        <h2>Bibliografia</h2>
                        {theBIBL}
                    </p>
                }
                {l2.ART11 && l2.ART11.length > 0 &&
                    <p>
                        <h2>Articolo 11</h2>
                        {theART11}
                    </p>
                }
            </div>
        </Dialog >
    );
}

const mapStateToProps = (state) => {
    return {
        visible: state?.livello2?.enabled || false,
        feature: state?.livello2?.feature || {},
        layer: state?.livello2?.layer || {}
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        livello2Toggle
    }, dispatch);
};

// export const Livello2Plugin = assign(connect(mapStateToProps, mapDispatchToProps)(TheComponent), {
//     BurgerMenu: {
//         name: "livello2",
//         position: 1,
//         priority: 2,
//         doNotHide: true,
//         help: <Message msgId="livello2.title" />,
//         tooltip: "livello2.title",
//         text: <Message msgId="livello2.title" />,
//         icon: <Glyphicon glyph="paperclip" />,
//         action: () => livello2Toggle()
//     }
// });
export const Livello2Plugin = connect(mapStateToProps, mapDispatchToProps)(TheComponent);
export const reducers = { livello2: theReducer };
