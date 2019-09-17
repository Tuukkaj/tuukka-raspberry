import React from "react"
import {Col, Row} from "react-bootstrap"

import "./css/PageSwitcher.css"
import helpers from "../helpers";


function PageSwitcher(props) {
  const state = helpers.getState(props.location.pathname)

  function getIcon() {
    if(state == "manage") {
      return <i className="fa fa-bus fa-4x switcher-icon" onClick={() => window.location = window.location.origin + "#/times"}></i>
    } else {
      return <i className="fa fa-th-list fa-4x switcher-icon" onClick={() => window.location = window.location.origin + "#/manage"}></i>
    }
  }

  return <Row className="fixed-bottom justify-content-end switcher-row" align="center">
      <Col className="col-1 no-gutters switcher-col">
        {getIcon()}
      </Col>
    </Row>
}

export default PageSwitcher;

