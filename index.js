const config = require("./server/controllers/config");
const scheduler = require("./server/controllers/scheduler");

scheduler.initCrons(config);