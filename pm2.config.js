module.exports = {
  apps: [
    {
      name: "urnode",
      script: "built/server.js",
      max_memory_restart: "500M",
      "env_development": {
        "NODE_ENV": "development"
      },
      "env_lab": {
        "NODE_ENV": "lab"
      },
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ],

  deploy: {
    dev: {
      host: "localhost",
      ref: "origin/master",
      repo: "gitlab@gitlab.thenetcircle.lab:service-team/unode.git",
      path: "/usr/local/deployment/urnode",
      "post-deploy": "npm install && npm run build && pm2 startOrRestart pm2.config.js --env development"
    },
    lab: {
      user: "tncdata",
      host: "thin",
      ref: "origin/master",
      repo: "http://gitlab.thenetcircle.lab/service-team/unode.git",
      path: "/home/tncdata/services/urnode",
      "post-deploy": "npm install && npm run build && pm2 startOrRestart pm2.config.js --env lab"
    },
    prod: {
      user: "tncdata",
      host: "cloud-host-07",
      ref:  "origin/master",
      repo: "gitlab@gitlab.thenetcircle.lab:service-team/unode.git",
      path: "/usr/local/tncdata/source/urnode",
      "post-deploy": "npm install && npm run build && pm2 startOrRestart pm2.config.js --env production",
    },
  }
}
