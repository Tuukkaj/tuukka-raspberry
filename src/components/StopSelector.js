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
import ButtonGroup from "react-bootstrap/ButtonGroup";

class StopSelector extends React.Component {
  constructor(props) {
    super(props);     

    this.state = {
      filter: "",
      selectedStop: null,
      removableStops: [],
      showRemoveModal: false,
      searchType: "name"
    };
    this.renderStopList = this.renderStopList.bind(this);
    this.renderLineSelection = this.renderLineSelection.bind(this);
    this.renderFilterInput = this.renderFilterInput.bind(this);
    this.renderStopRemovalModal = this.renderStopRemovalModal.bind(this);
  }

  renderStopList() {
    const filter = this.state.filter;
    if(filter && (filter > 0 || filter.length > 1)) {
      const handleSelection = (stop) => {
        this.setState({...this.state, selectedStop: {num: stop.StationId, name: stop.Name}})
      };

      let filteredStops;

      if(this.state.searchType === "name") {
        filteredStops = stops.filter(stop => stop.Name.toLowerCase().includes(filter.toLowerCase()));

        filteredStops.sort((stopA, stopB) => {
          if(stopA.Name === stopB.Name) return 0;
          return stopA.Name > stopB.Name ? 1 : 0;
        });
      } else {

        filteredStops = stops.filter(stop => stop.StationId.toString().includes(filter));

        filteredStops.sort((stopA, stopB) => {
          return stopA.StationId - stopB.StationId;
        });
      }

      const stopList = filteredStops.map((stop, index) => {
        return <ListGroup.Item action key={index}
                               onClick={() => handleSelection(stop)}>
          <i className="fa fa-map-signs"/>{" "}
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
            {StopSelector.transformToStopAndLineText(item)}
          </h4>
        </div>
      });

      return <>
        <Row className="align-items-center">
          <Col className="col-auto">
            <h3 className="selector-inline-block"><b>Stops</b></h3>
          </Col>
          <Col>
            <Button variant="danger"
                    size="sm"
                    disabled={array.length <= 0}
                    onClick={() => this.setState({...this.state, showRemoveModal: true})}>
              <i className="fa fa-times"/> <b>Remove stops</b>
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {selected}
          </Col>
        </Row>
      </>
    }
  }

  static transformToStopAndLineText(stop) {
    return <>
        <i className="fa fa-bus"/>
        <span className="selector-line-number">{" " + stop.line + " "}</span>
        <i className="fa fa-map-signs" />
        {" " + stop.stopName + ": " + stop.stop}
      </>
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
      return <Button variant="danger" className="selector-line-button" key={index}
        onClick={() => handleLineClicked(line)}>
        {line}
      </Button>
    });

    const stopName = this.state.selectedStop ? this.state.selectedStop.name : "";

    return <Modal show={!!this.state.selectedStop} size="xl" className="selector-modal"
                  onHide={() => this.setState({...this.state, selectedStop: null})}>
      <Modal.Header closeButton>
        <Modal.Title>
          {stopName} - Select line {" "}
          <i className="fa fa-bus"/>
        </Modal.Title>
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
    const handleSearchTypeSelection = type => {
      this.setState({...this.state, searchType: type})
    };

    let formText = this.state.searchType === "name" ?
        "Enter name of the bus stop (At least two characters)" :
        "Enter number of the bus stop";

    return <>
      <Row className="align-items-center">
        <Col className="col-auto">
          <h1><b>Select stop</b></h1>
        </Col>
        <Col xs={12} sm="auto">
          <ButtonGroup>
            <Button variant={this.state.searchType === "name" ? "danger" : "secondary"}
              onClick={() => handleSearchTypeSelection("name")}
              size="sm">
              <b>Stop name</b>
            </Button>
            <Button variant={this.state.searchType === "number" ? "danger" : "secondary"}
              onClick={() => handleSearchTypeSelection("number")}
              size="sm">
              <b>Stop number</b>
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Control type="text" placeholder={formText}
                        value={this.state.filter}
                        onChange={e => this.setState({...this.state, filter: e.currentTarget.value})}/>
        </Col>
      </Row>
    </>
  }

  renderStopRemovalModal() {
    let array = localStorage.getItem("tuukka-raspberry-stops");
    array = array ? JSON.parse(array) : [];

    const handleClick = index => {
      if(!this.state.removableStops.includes(index)) {
        let temp = [...this.state.removableStops];
        temp.push(index);
        this.setState({...this.state, removableStops: temp});
      } else {
        this.setState({...this.state, removableStops: this.state.removableStops.filter(num => num !== index)});
      }
    };

    const stops = array.map((stop, index)=> {
      return <Row key={index} className="align-items-center selector-separator-small no-gutters">
        <Col className="col-auto">
          <Button onClick={() => handleClick(index)}
            size="sm"
            variant={this.state.removableStops.includes(index) ? "danger" : "secondary"}>
            <i className={this.state.removableStops.includes(index) ? "fa fa-times" : "fa fa-circle"}/>
          </Button>
        </Col>
        <Col className="selector-separator-left-small">
          <h5 className="selector-inline-block">
            {StopSelector.transformToStopAndLineText(stop)}
          </h5>
        </Col>
      </Row>
    });

    const cancel = () => {
      this.setState({...this.state, showRemoveModal: false, removableStops: []})
    };

    const removeSelected = () => {
      let array = localStorage.getItem("tuukka-raspberry-stops");
      array = array ? JSON.parse(array) : [];
      let toRemove = [...this.state.removableStops.sort()];

      for(let i = toRemove.length - 1; i >= 0; i--) {
        array.splice(toRemove[i], 1);
      }

      localStorage.setItem("tuukka-raspberry-stops", JSON.stringify(array));
      cancel()
    };


    return <Modal show={this.state.showRemoveModal} size="xl" className="selector-modal"
                  onHide={cancel}>
      <Modal.Header closeButton>
        <Modal.Title>Select lines</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {stops}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger"
                onClick={removeSelected}
                size="sm">
          <b>Remove selected</b>
        </Button>
        <Button variant="secondary"
                onClick={cancel}
                size="sm">
          <b>Cancel</b>
        </Button>
      </Modal.Footer>
    </Modal>
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
          <Row>
            <Col className="selector-modal">
              {this.renderStopRemovalModal()}
            </Col>
          </Row>
        </Container>
    );
  }
}

export default StopSelector; 