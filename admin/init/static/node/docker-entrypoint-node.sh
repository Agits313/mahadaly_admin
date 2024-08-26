# docker-entrypoint.sh for node.js
echo "wait rabbit server"
dockerize -wait tcp://service_rabbit:15672 -timeout 20s
echo "start node server"
npm run dev