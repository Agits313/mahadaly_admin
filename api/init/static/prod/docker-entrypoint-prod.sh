# docker-entrypoint.sh for node.js
echo "wait db server"
dockerize -wait tcp://service_db:3306 -timeout 20s
dockerize -wait tcp://service_rabbit:15672 -timeout 20s

echo "start node server"
npm run prod