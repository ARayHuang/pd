# start.sh
#!/bin/bash

node_modules/webpack/bin/webpack.js --config webpack.development.config.js &&
 concurrently --kill-others \
  "node_modules/webpack-dev-server/bin/webpack-dev-server.js --config webpack.development.config.js" \
  "node_modules/nodemon/bin/nodemon.js bin/client-root.js --watch config --watch bin/client-root.js --watch server" \
  "node_modules/nodemon/bin/nodemon.js bin/management-root.js --watch config --watch bin/management-root.js --watch server" \
  "node_modules/nodemon/bin/nodemon.js bin/task-worker.js  --watch config --watch bin/task-worker.js --watch server"
