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
    
    this.state = {selectedStop: null};
    this.renderForm = this.renderForm.bind(this);
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
      return <h3>Write atleast two letters of bus stop</h3>
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
            console.log("Got here");
            this.setState({...this.state, selectedStop: null});
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

    return <Modal show={this.state.selectedStop ? true : false} size="xl" className="selector-modal"
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

  renderForm() {
    const handleInput = (key, value) => {
      let data = {...this.state.data};
      data[key] = value;
      this.setState({...this.state, data});
    };

    const handleSubmit = event => {
      event.preventDefault();

      let array = localStorage.getItem("tuukka-raspberry-stops");
      array = array ? JSON.parse(array): [];

      let stop = this.state.data.stop;
      let line = this.state.data.line;

      if(stop && line) {
        array.push({stop: this.state.data.stop, line: this.state.data.line});
        localStorage.setItem("tuukka-raspberry-stops", JSON.stringify(array));
      }
    };

    return <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Label>Stop</Form.Label>
        <Form.Control
          onChange={e => handleInput("stop", e.currentTarget.value)}/>
      </Form.Row>
      <Form.Row>
        <Form.Label>Line</Form.Label>
        <Form.Control
          onChange={e => handleInput("line", e.currentTarget.value)}/>
      </Form.Row>
    </Form>
  }

  renderFilterInput() {
    return <div>
      <h1>Select stop</h1>
      <Form.Control type="text" placeholder="Enter bus stop name"
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