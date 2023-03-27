const cron = require("node-cron");
const { resolve } = require("path");
const { asyncScheduler } = require("rxjs");

// Schedules a monthly cron job to get the rating for each apartment in the database
module.exports = {
    initCrons: (config) => {
        Object.keys(config).forEach(key => {
            if (cron.validate(config[key].frequency)) {
                cron.schedule(config[key].frequency, () => {
                    const handler = require(resolve(config[key].handler));
                    handler();
                })
            }
        })
    }
}