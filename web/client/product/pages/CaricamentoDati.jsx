import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Page from '../../containers/Page';


const CaricamentoDatiPage = (props, context) => {
    return (<Page
        id="caricamentodati"
        className="manager"
        plugins={props.plugins}
        params={props.match.params}
    />);
}

function mapStateToProps(state) {
    return {
    };
}

export default connect(mapStateToProps)(CaricamentoDatiPage);