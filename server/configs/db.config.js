const mongoose = require('mongoose');
const schedule = require('node-schedule');

const connectionCache = new Map();
const connectionPromiseCache = new Map();
const CACHE_TTL = 3600 * 1000; // 1 hour

const getFormattedTime = (lastActivity) => {
    const now = Date.now();
    const secondsSinceLastActivity = Math.floor((now - lastActivity) / 1000);
    const minutesSinceLastActivity = Math.floor(secondsSinceLastActivity / 60);
    if (secondsSinceLastActivity <= 0) {
        return 'just now';
    }
        let str = '';
    if (minutesSinceLastActivity > 0) {
        let str2 = 'minute';
        if (minutesSinceLastActivity > 1) {
            str2 += 's';
        }
        str += `${minutesSinceLastActivity} ${str2}`
    }
    if (secondsSinceLastActivity % 60 !== 0) {
        let str3 = 'second'
        if (secondsSinceLastActivity % 60 > 1) {
            str3 += 's';
        }
        if (minutesSinceLastActivity > 0) {
            str += ', '
        }
        str += `${secondsSinceLastActivity % 60} ${str3}`
    }
    str += ' ago';
    return str;
};

const connectDB = async (DB) => {
    const now = Date.now();

    // Check if the connection already exists
    if (connectionCache.has(DB)) {
        const { connectionId, lastActivity, cleanupJob } = connectionCache.get(DB);
        console.log('Connection already exists for MongoDB with connection Id ', connectionId);
        console.log('Last Activity: ', getFormattedTime(lastActivity));

        // Cancel the previous job
        cleanupJob.cancel();

        // Reschedule the cleanup job
        const newCleanupJob = schedule.scheduleJob(new Date(now + CACHE_TTL), async () => {
            console.log(`Closing inactive MongoDB connection with connection Id ${connectionId}`);
            const connection = mongoose.connections.find(conn => conn.id === connectionId);
            if (connection) {
                await connection.close();
                connectionCache.delete(DB);
                console.log(`Connection ${connectionId} closed and removed from cache.`);
            }
        });

        connectionCache.set(DB, { connectionId, lastActivity: Date.now(), cleanupJob: newCleanupJob });
        return connectionId;
    }

    // Check if a connection attempt is already in progress
    if (connectionPromiseCache.has(DB)) {
        return connectionPromiseCache.get(DB);
    }

    // Create a new connection and cache the promise
    const connectPromise = (async () => {
        try {
            const options = {
                maxPoolSize: 10,
            };
            const connection = await mongoose.createConnection(DB, options).asPromise();
            const connectionId = connection.id;

            // Schedule the cleanup job
            const cleanupJob = schedule.scheduleJob(new Date(Date.now() + CACHE_TTL), async () => {
                console.log(`Closing inactive MongoDB connection with connection Id ${connectionId}`);
                const connection = mongoose.connections.find(conn => conn.id === connectionId);
                if (connection) {
                    await connection.close();
                    connectionCache.delete(DB);
                    console.log(`Connection ${connectionId} closed and removed from cache.`);
                }
            });

            connectionCache.set(DB, { connectionId, lastActivity: Date.now(), cleanupJob });
            return connectionId;
        } catch (error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            process.exit(1);
        } finally {
            // Clean up the promise cache entry after the connection is established or failed
            connectionPromiseCache.delete(DB);
        }
    })();

    connectionPromiseCache.set(DB, connectPromise);
    return connectPromise;
};

module.exports = connectDB;
