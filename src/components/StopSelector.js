import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class StopSelector extends React.Component {
  constructor(props) {
    super(props);     
    
    this.state = {data: {}};
    this.renderForm = this.renderForm.bind(this);
  }
  
  componentDidMount() {
    const selectedStops = localStorage.getItem("stops");
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
      <Button type="submit">Moix</Button>
    </Form>
  }

  render() {
    return this.renderForm();
  }
}

export default StopSelector; 