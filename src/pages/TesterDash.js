import React, { Component } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Chart } from 'react-chartjs-2';
import { LineGradientRTChart } from "../components/common";
import 'chartjs-plugin-annotation';
import '../styles/Industry40.css';
import '../styles/FlexStructure.css';
import "../fontello/css/fontello.css";


Chart.defaults.global.defaultFontColor='rgba(255, 255, 255, 1)';

class TesterDash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartHeight: 0,
      chartWidth: 0,
      id: [""],
      limit: 1,
      idAux: "",
      limitAux: 1,
      topic:"",
      topicAux:"",
      GradientChart: {
        id: 'vGradientChart',
        keys: [""],
        length: 0,
        title: 'v',
        xLabel: 't',
        yLabel: 'v',
        labels: ['v'],
        colors: [['rgba(51, 133, 255, 0.5)','rgba(0, 0, 0, 0.2)']],
        range: [],
        valueKey: 'v'
      }
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    // window.addEventListener("beforeunload", this.onUnload);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    // window.removeEventListener("beforeunload", this.onUnload);
  }
  updateWindowDimensions() {
    // this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
  }
  handleSubmit(event){
    event.preventDefault();
    this.setState({
      id:[this.state.idAux],
      limit:this.state.limitAux,
      topic:this.state.topicAux
    });
  }
  //Helper function called upon clicking icons in the main map to update what is

  render() {
    const { GradientChart, id , limit, idAux, limitAux, topicAux, topic } = this.state;
    return (
      <Container className="Flex TenRow TenColumn">

        <Row className="Flex TenRow TenColumn NWrap DirC Colored">

          <Col className="Flex TenColumn OneRow DirC JustSE AlC">
            <Form autocomplete="off" onSubmit={(e) => {this.handleSubmit(e)}} >
              <Form.Group as={Row}  controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  tópico:
                </Form.Label>
                <Col sm="10">
                  <Form.Control autocomplete="no" value={topicAux}  onChange={(e) => {
                    this.setState({topicAux: e.target.value});
                  }} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  id:
                </Form.Label>
                <Col sm="10">
                  <Form.Control autocomplete="no" value={idAux}  onChange={(e) => {
                    this.setState({idAux: e.target.value});
                  }} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  Límite:
                </Form.Label>
                <Col sm="10">
                  <Form.Control type="number" min="1" value={limitAux}  onChange={(e) => {
                    this.setState({limitAux: e.target.value});
                  }} />
                </Col>
              </Form.Group>
              <Button variant="primary" type="submit">
                Monitorear
              </Button>
            </Form>
          </Col>
          <Col className="Flex TenColumn NineRow DirC JustSE AlC">
            <div className="Ind40LineChart">
              <LineGradientRTChart
                id={GradientChart.id}
                keys={id}
                length={limit}
                topicKey={topic}
                title={GradientChart.title}
                labels={GradientChart.labels}
                xLabel={GradientChart.xLabel}
                yLabel={GradientChart.yLabel}
                colors={GradientChart.colors}
                mide={GradientChart.mide}
                valueKey={GradientChart.valueKey}
              />
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}
export default (TesterDash);
