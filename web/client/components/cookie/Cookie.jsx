/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/
import PropTypes from 'prop-types';

import React from 'react';
import { Glyphicon, Col } from 'react-bootstrap';
import Button from '../misc/Button';
import Message from '../../components/I18N/Message';
import MoreDetails from './MoreDetails';
import { getApi } from '../../api/userPersistedStorage';

/**
  * Component used to show a panel with the information about cookies
  * @class Cookies
  * @memberof components
  * @prop {string} declineUrl The url associated with the leave button
  * @prop {string} locale the language used, default browser's one
  * @prop {string} externalCookieUrl if provided then it link to that url otherwise it will opens a section with more details.
  * @prop {function} onSetCookieVisibility to change the visibility of the cookie panel
  * @prop {function} onMoreDetails to toggle the more details section
  * @prop {bool} seeMore if true the more details section is visible
  * @prop {bool} show if true the cookie panel is visible
  *
  */

class Cookie extends React.Component {
    static propTypes = {
        declineUrl: PropTypes.string,
        externalCookieUrl: PropTypes.string,
        locale: PropTypes.string,
        onMoreDetails: PropTypes.func,
        onSetCookieVisibility: PropTypes.func,
        seeMore: PropTypes.bool,
        show: PropTypes.bool,
        claim: PropTypes.string
    };
    static contextTypes = {
        messages: PropTypes.object
    };
    static defaultProps = {
        declineUrl: "http://www.google.com",
        onMoreDetails: () => {},
        onSetCookieVisibility: () => {},
        seeMore: false,
        show: false,
        claim: "<span/>"
    };

    renderAcceptButton = () => {
        return (
            <Button
                className="cookie-button"
                id="accept-cookie"
                bsStyle="primary"
                onClick={() => this.accept(true)} >
                <Message msgId="cookie.accept"/>
            </Button>);
    }

    renderMoreDetails = () => {
        return this.props.externalCookieUrl ?
            (
                <a style={{cursor: "pointer"}}
                    id="cookie-moredetails-div"
                    href={this.props.externalCookieUrl}>
                    <Button
                        className="cookie-button"
                        id="cookie-moredetails"
                        bsStyle="primary" >
                        <Message msgId="cookie.moreDetailsButton"/>
                    </Button>
                </a>
            ) : (
                <Button
                    onClick={() => this.moreDetails()}
                    className="cookie-button"
                    id="cookie-moredetails"
                    bsStyle="primary" >
                    <Message msgId="cookie.moreDetailsButton"/>
                </Button>
            );
    }
    renderLeaveButton = () => {
        return (<a href={this.props.declineUrl} target="_self" style={{cursor: "pointer"}}>
            <Button
                className="cookie-button"
                id="cookie-leave"
                bsStyle="primary" >
                <Message msgId="cookie.leave"/>
            </Button>
        </a>);
    }
    render() {
        return this.props.show ? (
            <div className={this.props.seeMore ? "mapstore-cookie-panel see-more" : "mapstore-cookie-panel not-see-more"}>
                {this.props.seeMore ?
                    <div role="heading" aria-level="1" className="cookie-header" style={{ height: this.props.seeMore ? "44px" : "0px" }}>
                        <Glyphicon glyph="1-close" onClick={() => this.props.onMoreDetails(false)} />
                    </div>
                    :
                    null
                }
                <div role="region" className="cookie-body-container">
                    {!this.props.externalCookieUrl && this.props.seeMore ? (
                        <MoreDetails html={this.props.html}/>
                    ) : (<div className="cookie-message">
                        <span dangerouslySetInnerHTML={{__html: this.props?.claim}} />
                    </div>) }
                    <br/>
                    {!this.props.seeMore ?
                        (<div className="cookie-action">

                            <Col xs={6} sm={4} className="action-button">
                                {this.renderAcceptButton()}
                            </Col>
                            <Col xs={6} sm={4} className="action-button">
                                {this.renderMoreDetails()}
                            </Col>
                            <Col xs={6} sm={4} className="action-button">
                                {this.renderLeaveButton()}
                            </Col>
                            <Col xs={12}>
                                <br></br>
                            </Col>
                        </div>) : null }
                </div>
            </div>
        ) : null;
    }
    moreDetails = () => {
        this.props.onMoreDetails(!this.props.seeMore);
    }
    accept = () => {
        try {
            getApi().setItem("cookies-policy-approved", true);
        } catch (e) {
            console.error(e);
        }
        this.props.onSetCookieVisibility(false);
    }
}
export default Cookie;
