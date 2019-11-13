import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import {
  initializeGraphRawDataAPI,
  resetGraphRawDataState
} from '../../actions';

class LineGradientRTChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      chartHeight: 0,
      chartWidth: 0,
      chartData: (canvas) => {
        const ctx = canvas.getContext("2d");
        let i = -1;
        let datasets = this.props.keys.map( (value) => {
          i = i + 1;
          const gradient = ctx.createLinearGradient(1680,400,0,0);
          gradient.addColorStop(0, this.props.colors[i][0]);
          gradient.addColorStop(1, this.props.colors[i][1]);
          let data = [null];
          if (this.props[this.props.keys[i]]) {
            data = this.props[this.props.keys[i]];
            if (data.length > this.props.length) {
              data = data.slice(-(this.props.length));
            }
          }
          return (
            {
              label: this.props.labels[i],
              data: data,
              pointRadius: 0.2,
              pointHoverRadius: 1,
              backgroundColor: gradient,
              borderColor: this.props.colors[i][0],
              borderWidth: 2,
              hoverBackgroundColor: 'rgba(255,255,255,1)',
              hoverBorderColor: this.props.colors[i][0],
            }
          );
        });
        return {datasets};
      },
      chartOptions: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: this.props.title
        },
        tooltips: {
          mode: 'nearest',
          intersect: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: this.props.xLabel,
            },
            ticks: {
              display: false
            },
            type: 'time',
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(102, 102, 102, 0.3)'
            },
            scaleLabel: {
              display: true,
              labelString: this.props.yLabel,
            },
            ticks: {
              suggestedMin: this.props.range ? this.props.range[0] : null,
              suggestedMax: this.props.range ? this.props.range[1] : null
            },
          }]
        }
      }
    }
  }

  initializeChart() {
    let {id, keys, length, valueKey, topicKey} = this.props;
    this.props.initializeGraphRawDataAPI(id, keys, length, valueKey, topicKey);
  }

  componentDidMount() {
    this.initializeChart();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.keys !== prevProps.keys) {
      this.initializeChart();
    }
  }

  render() {
    return(
      <Line
      data={this.state.chartData}
      width={this.state.chartWidth}
      height={this.state.chartHeight}
      options={this.state.chartOptions}
      />
    );
  }

}

const mapStateToProps = ({dataWS}, {id, keys}) => {
  let data= {};
  for (const key of keys) {
    data[key] = dataWS[`${id}-${key}`];
  }
  return { ...data };
}

export default connect(mapStateToProps, {
  initializeGraphRawDataAPI, resetGraphRawDataState
})(LineGradientRTChart);
