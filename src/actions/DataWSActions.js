import {
  DATA_WS_INITIALIZE_GRAPH,
  DATA_WS_PROCESS_GRAPH_RAW_DATA_MQTT,
  DATA_WS_RESET_GRAPH_RAW_DATA_STATE,
  DATA_WS_INITIALIZE_GRAPH_LENGTH,
  DATA_WS_RESET
} from './types';
import { API } from 'aws-amplify';
import PubSub from '@aws-amplify/pubsub';
import PubSubHelper from '../helpers/PubSubHelper';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

const configPubSub = {
    PubSub: {
      aws_pubsub_region: '',
      aws_pubsub_endpoint: ''
    }
};
const pubsub = PubSub;

const awsIotProvider = new AWSIoTProvider();
pubsub.addPluggable(awsIotProvider);


export const initializeGraphRawDataAPI = (id, keys, length, valueKey, topicKey) => {
  let apiName = 'Metrics';
  let path = '/metric';
  return (dispatch) => {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i];
      let myInit = {
        queryStringParameters: {  // OPTIONAL
          id: key,
          limit: length
        }
      };
      dispatch ({
        type: DATA_WS_RESET
      });
      if(PubSubHelper.subber != null) {
        PubSubHelper.unsubscribe();
      }
      API.get(apiName, path, myInit).then(response => {
        let storeKey = `${id}-${key}`;
        processGraphRawDataAPIBatch(response, key, storeKey, length, dispatch, valueKey);
        let pubsubKey = topicKey + key;
        PubSubHelper.subber = PubSubHelper.pubsub.subscribe(pubsubKey).subscribe({
          next: data => {
            let value = {};
            value = {
              y: data.value[valueKey],
              t: data.value.ts
            };
            dispatch({
              type: DATA_WS_PROCESS_GRAPH_RAW_DATA_MQTT,
              payload:{
                value,
                storeKey
              }
            });
          },
          error: error => console.log(error),
          close: () => console.log('Done'),
        });
      }).catch(error => {
        console.log('API',error)
      });
    }
    return;
  }
}

const processGraphRawDataAPIBatch = (data, key, storeKey, length, dispatch, valueKey) => {
  let storeArray = data.Items.reverse().map((metric) => {
    if(!metric.ts || metric.v === undefined) {
      return null;
    }
    let value = {};
    value = {
      y: metric[valueKey],
      t: metric.ts
    };
    return value;
  });
  dispatch ({
    type: DATA_WS_INITIALIZE_GRAPH_LENGTH,
    payload: {
      storeKey,
      length
    },
  });
  dispatch ({
    type: DATA_WS_INITIALIZE_GRAPH,
    payload: {
      storeKey,
      length,
      storeArray
    },
  });
  return;
}

export const resetGraphRawDataState = (id, keys) => {
  return (dispatch) => {
    keys.forEach((key) => {
      dispatch ({
        type: DATA_WS_RESET_GRAPH_RAW_DATA_STATE,
        payload: `${id}-${key}`
      });
    })
    return;
  }
};
