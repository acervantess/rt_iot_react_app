import PubSub from '@aws-amplify/pubsub';
const configPubSub = {
    PubSub: {
      aws_pubsub_region: '',
      aws_pubsub_endpoint: ''
    }
};
class PubSubHelper {
  constructor() {
    this.pubsub = PubSub;
    this.pubsub.configure(configPubSub);
    this.subber = null;
  }
  unsubscribe(){
    try
    {
      this.subber.unsubscribe();
      this.subber=null;
    }
    catch(e)
    {
      console.log(e);
    }
  }
}

export default (new PubSubHelper);
