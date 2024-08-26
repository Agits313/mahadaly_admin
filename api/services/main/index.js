/* -------------------------------------------------------------------------- */
/*              RabbitMQ, Project starter - Thejagat, andibastian             */
/* -------------------------------------------------------------------------- */

const { rabbitConnect } = require("../rabbit/index");
const dotenv = require("dotenv");
// const { Emit } = require("../socket/index");
// const { socket } = require("../socket/client");
dotenv.config();
module.exports = {
  startService: async () => {
    try {
      //   rabbitConnect().then(async (rabbitResponse) => {
      //     var queues = rabbitResponse.queues;
      //     var channel = rabbitResponse.channel;
      //     queues.forEach(async (queue) => {
      //       await channel.consume(
      //         queue,
      //         async (message) => {
      //           if (message !== null) {
      //             let target = null;
      //             let data = message.content;
      //             let datajson = JSON.parse(data);
      //             let messageData = datajson.data;
      //             console.log(`@rabbitConnect : ${JSON.stringify(messageData)}`);
      //             if (datajson.data.target) {
      //               target = datajson.data.target;
      //             }
      //             if (target) {
      //               console.log(`Target ${target}`);
      //             }
      //             console.log(datajson);
      //             let eventPush = `push-${queue}`;
      //             console.log(`eventPush ${eventPush}`);
      //             Emit(eventPush, messageData, target);
      //           }
      //         },
      //         { noAck: true }
      //       );
      //     });
      //   });
    } catch (error) {
      console.log(error);
    }
  },
};
