/* -------------------------------------------------------------------------- */
/*         RabbitMQ Connector, Project starter - Thejagat, andibastian        */
/* -------------------------------------------------------------------------- */

const amqp = require("amqplib");
const dotenv = require("dotenv");
const { setResponse, validateMandatoryFields } = require("../../helper/index");
const { connection } = require("../../conf/index");
const { constantMessage } = require("../../helper/lib/constant");

dotenv.config();
let user = process.env.RABBIT_USER;
let password = process.env.RABBIT_PASSWORD;
let server = process.env.RABBIT_SERVER;
let vhost = process.env.RABBIT_VHOST;
let exchangeName = process.env.RABBIT_EXCHANGE;
let routingKey = process.env.RABBIT_KEY;
let channel, connectionrabbit;

var rabbitHelper = (module.exports = {
  rabbitConnect: async () => {
    try {
      connectionrabbit = await amqp.connect(`amqp://${user}:${password}@${server}/${vhost}`);
      channel = await connectionrabbit.createChannel();
      await channel.assertExchange(exchangeName, "direct", { durable: false });
      let queueList = process.env.RABBIT_QUEUES;
      const queues = queueList.split(",");
      queues.forEach(async (queue) => {
        await channel.assertQueue(queue);
        await channel.bindQueue(queue, exchangeName, routingKey);
      });
      console.log(`Rabbit Connected, Vhost ${vhost}`);
      // var
      return {
        queues: queues,
        channel: channel,
      };
      // ----------------------------------------------
    } catch (error) {
      console.log(`Error ${error}`);
    }
  },
  rabbitConnection: async () => {
    connectionrabbit = await amqp.connect(`amqp://${user}:${password}@${server}/${vhost}`);
    channel = await connectionrabbit.createChannel();
    return {
      channel,
      exchangeName,
    };
  },
  rabbitLog: async (req, res, requiredFields) => {
    return new Promise((resolve, reject) => {
      const { id_connection, title, content, recipient, recipient_detail } = req.body;

      if (!validateMandatoryFields(req.body, requiredFields)) {
        const response = { message: "Missing required fields" };
        setResponse(response, 400, res);
        return reject(response);
      }

      const query = `insert into _list (id_connection, title, content, recipient, recipient_detail) values (?,?,?,?,?)`;
      connection.query(query, [id_connection, title, content, recipient, recipient_detail], (error, results) => {
        if (!error) {
          const message = "Successfully inserted";
          const response = dev_mode === "development" ? { message, query, data: req.body } : { message, data: req.body };
          setResponse(response, 200, res);
          resolve(response);
        } else {
          const message = "Error insert";
          const response = { message, error };
          setResponse(response, 500, res);
          reject(response);
        }
      });
    });
  },
  rabbitMessage: async (param) => {
    // console.log(param);
    return new Promise(async (resolve, reject) => {
      try {
        const rabbitSet = await rabbitHelper.rabbitConnect();
        const channel = rabbitSet.channel;
        const exchangeName = process.env.RABBIT_EXCHANGE;
        let queue = (process.env.RABBIT_QUEUES || "").split(",")[0];
        if (param.queue) {
          queue = param.queue;
        }
        const message = param.data;
        const data = JSON.stringify({ data: message });
        await channel.assertQueue(queue);
        await channel.bindQueue(queue, exchangeName, queue);
        channel.publish(exchangeName, queue, Buffer.from(data));
        resolve("ok");
      } catch (error) {
        reject(error);
      }
    });
  },
});
