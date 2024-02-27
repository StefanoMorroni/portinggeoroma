/*
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import PropTypes from 'prop-types';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';
import HTML from '../../components/I18N/HTML';

/**
 * Description of MapStore rendered in the home page.
 * Renders the HTML in localization files identified by
 * the path `home.shortDescription`.
 * @name HomeDescription
 * @class
 * @memberof plugins
 * @prop {string} [name='MapStore'] Title of the text
 */
class HomeDescription extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        name: PropTypes.string
    };

    static defaultProps = {
        name: 'MapStore',
        className: 'ms-home-description',
        style: {}
    };

    render() {
        return (
            <div>
                <link media="all" rel="stylesheet" href="https://www.comune.roma.it/web-resources/static/css/build.min.css?v=1.0.13" />
                <link media="all" rel="stylesheet" href="https://www.comune.roma.it/web-resources/static/css/portal.min.css?v=1.0.10" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                <link rel="stylesheet" href="https://www.comune.roma.it/web-resources/static/fonts/romaicons/RomaIcons.min.css?v=1.0.5" />
                <link rel="stylesheet" href="https://www.comune.roma.it/web-resources/static/fonts/itaicons/itaicons.css" />
                <div className="Roma c-hideFocus enhanced">
                    <div id="HeaderRomaCapitale" className="Header Headroom--fixed js-Headroom u-hiddenPrint Headroom Headroom--not-bottom Headroom--pinned Headroom--top"
                        style={{ zIndex: "200", position: "fixed", top: "0px" }}>
                        <div className="Header-banner">
                            <div className="Header-owner Headroom-hideme">
                                <a href="http://www.regione.lazio.it/" title="Apri sito esterno della Regione Lazio">
                                    <span>Regione Lazio</span>
                                </a>
                            </div>
                        </div>
                        <div className="Header-navbar">
                            <div className="u-layout-wide Grid Grid--alignMiddle u-layoutCenter">
                                <div className="Header-logo Grid-cell">
                                    <a href="https://www.comune.roma.it/web/it/home.page" title="Home page di Roma Capitale">
                                        <img src="product/assets/img/logo_roma.png" alt="Logo di Roma Capitale" />
                                    </a>
                                </div>
                                <h1 className="Header-titleLink">Roma Capitale</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default {
    HomeDescriptionPlugin: HomeDescription
};
