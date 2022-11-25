// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');

const firebaseConfig = {
  apiKey: "AIzaSyBNkGq-2kEI4VZDRUfCPu4QJXkBO5zn3ZY",
  authDomain: "casperbot-b942e.firebaseapp.com",
  projectId: "casperbot-b942e",
  storageBucket: "casperbot-b942e.appspot.com",
  messagingSenderId: "1017604283034",
  appId: "1:1017604283034:web:cae4e475d6ef1cbe439d23",
  measurementId: "G-BQXD02D4NY"
};

const admin = require('firebase-admin');
admin.initializeApp(firebaseConfig);

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const store = admin.firestore();

  const agent = new WebhookClient({ request, response });

  function quickTopic(agent) {
    let payload = {
      text: "Qual tema você deseja as notícias?",
      quick_replies: [
        {
          content_type: "text",
          title: "Esportes",
          payload: "Esportes"
        },
        {
          content_type: "text",
          title: "Política",
          payload: "Política"
        },
        {
          content_type: "text",
          title: "Entretenimento",
          payload: "Entretenimento"
        },
        {
          content_type: "text",
          title: "Famosos",
          payload: "Famosos"
        }
      ]
    };
    agent.add(new Payload(agent.FACEBOOK, payload, { sendAsMessage: true, rawPayload: false }));
  }

  function welcome(agent) {
    agent.add('Olá, eu sou o Casper, um bot especializado em notícias.');
    return quickTopic(agent);
  }

  function getNews(agent) {
    const topicFilter = [];
    if (agent.parameters.famosos !== '') {
      topicFilter.push('Famosos');
    }

    if (agent.parameters.esportes !== '') {
      topicFilter.push('Esportes');
    }

    if (agent.parameters.entretenimento !== '') {
      topicFilter.push('Entretenimento');
    }

    if (agent.parameters.politica !== '') {
      topicFilter.push('Política');
    }

    if (topicFilter.length === 0) {
      agent.add('Desculpe, eu não consigui captar muito bem os temas que você falou.');
      return quickTopic(agent);
    }

    const q = store.collection('news').where('topic', 'in', topicFilter);

    return q.limit(10).get().then((snapshot) => {
      const elements = [];
      snapshot.docs.map(doc => {
        const news = doc.data();
        elements.push(
          {
            "title": news.title,
            "subtitle": news.description,
            "image_url": news.image,
            "default_action": {
              "webview_height_ratio": "tall",
              "url": news.link,
              "type": "web_url"
            },
            "buttons": [
              {
                "title": "View Website",
                "type": "web_url",
                "url": news.link
              }
            ]
          });
      }
      );

      if (elements.length === 0) {
        let topics = "";
        topicFilter.map((topic, index) => {
          topics += topic;
          if (index < topicFilter.length - 2)
            topics += ", ";
          else if (index < topicFilter.length - 1)
            topics += " e/ou ";
        });
        agent.add(`Desculpe, não temos noticia sobre ${topics}.`);
        return quickTopic(agent);
      }

      let payload =
      {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": elements
          }
        }
      };

      //agent.add("How's it going?");
      agent.add(new Payload(agent.FACEBOOK, payload, { sendAsMessage: true, rawPayload: false }));

    });
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('news', getNews);
  agent.handleRequest(intentMap);
});
