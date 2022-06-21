
module.exports = {
    apps: [{
        name: 'noveland-app-server',
        script: 'app.js',
        instances: 1,
        exec_mode: "cluster",
        max_memory_restart: '300M',
        watch: [
          "routes"
        ],
        ignore_watch : [
          "node_modules"
        ],
    }]
  };