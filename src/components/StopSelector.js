import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import stops from "../data/stops.json";
import lines from "../data/lines";

import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";

import "./css/StopSelector.css";

class StopSelector extends React.Component {
  constructor(props) {
    super(props);     
    
    this.state = {filter: "", selectedStop: null};
    this.renderStopList = this.renderStopList.bind(this);
    this.renderLineSelection = this.renderLineSelection.bind(this);
    this.renderFilterInput = this.renderFilterInput.bind(this);
  }

  renderStopList() {
    const filter = this.state.filter;

    if(filter && filter.length > 1) {
      const handleSelection = (stop) => {
        this.setState({...this.state, selectedStop: {num: stop.StationId, name: stop.Name}})
      };

      const filteredStops = stops.filter(stop => stop.Name.toLowerCase().includes(filter.toLowerCase()));

      filteredStops.sort((stopA, stopB) => {
        if(stopA.Name === stopB.Name) return 0;
        return stopA.Name > stopB.Name ? 1 : 0;
      });

      const stopList = filteredStops.map((stop, index) => {
        return <ListGroup.Item action key={index}
                               onClick={() => handleSelection(stop)}>
          {stop.Name}: {stop.StationId}
        </ListGroup.Item>
      });

      return <ListGroup>
        {stopList}
      </ListGroup>
    } else {
      let array = localStorage.getItem("tuukka-raspberry-stops");
      array = array ? JSON.parse(array): [];
      const selected = array.map((item, index)=> {
        return <div key={index}>
          <h4>
            <i className="fa fa-bus"/>
            <span className="selector-line-number">{" " + item.line + " "}</span>
            <i className="fa fa-map-signs" />
            {item.stopName + " : " + item.stop}
          </h4>
        </div>
      });

      return <div>
        <h3><b>Selected stops</b></h3>
        {selected}
      </div>
    }
  }


  renderLineSelection() {
    const handleLineClicked = (line) => {
      let array = localStorage.getItem("tuukka-raspberry-stops");
      array = array ? JSON.parse(array): [];

      let stopId = this.state.selectedStop.num;
      let stopName = this.state.selectedStop.name;
      let lineNumber = line;

      if(stopId && stopName && lineNumber) {
          this.setState({...this.state, selectedStop: null, filter:""});
          array.push({stop: stopId, stopName: stopName, line: lineNumber});
          localStorage.setItem("tuukka-raspberry-stops", JSON.stringify(array));
      }
    };

    const lineButtons = lines.map((line, index)=> {
      return <Button variant="success" className="selector-line-button" key={index}
        onClick={() => handleLineClicked(line)}>
        {line}
      </Button>
    });

    const stopName = this.state.selectedStop ? this.state.selectedStop.name : "";

    return <Modal show={!!this.state.selectedStop} size="xl" className="selector-modal"
                  onHide={() => this.setState({...this.state, selectedStop: null})}>
      <Modal.Header closeButton>
        <Modal.Title>{stopName} - Select line</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            {lineButtons}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  }

  renderFilterInput() {
    return <div>
      <h1>Select stop</h1>
      <Form.Control type="text" placeholder="Enter at least two first letters of the bus stop"
              value={this.state.filter}
              onChange={e => this.setState({...this.state, filter: e.currentTarget.value})}/>
    </div>
  }

  render() {
    return (
        <Container>
          <Row className="selector-separator">
            <Col>
              {this.renderFilterInput()}
            </Col>
          </Row>
          <Row className="selector-separator">
            <Col>
              {this.renderStopList()}
            </Col>
          </Row>
          <Row>
            <Col className="selector-modal">
              {this.renderLineSelection()}
            </Col>
          </Row>
        </Container>
    );
  }
}

export default StopSelector; 