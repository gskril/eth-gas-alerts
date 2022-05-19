require('dotenv').config()
const axios = require('axios').default
const twitter = require('./twitter')
const cron = require('node-cron')
const fs = require('fs')

// Set the initial date according to MINS_BEFORE_STARTING
const intialDate = () => {
	const minsBeforeStarting = process.env.MINS_BEFORE_STARTING
		? process.env.MINS_BEFORE_STARTING
		: 0

	const minutes = process.env.MINS_BETWEEN_TWEETS - minsBeforeStarting
	const now = new Date()
	now.setMinutes(now.getMinutes() - minutes)
	return now
}

// Set last tweeted as start time
fs.writeFileSync('./lastTweeted.json', JSON.stringify(intialDate()))

// Run job every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
	const gas = await axios
		.get('https://gas.best/stats')
		.then(async (res) => {
			const data = await res.data
			return {
				live: data.pending.fee,
				hour: data.forecast['1 hour'],
			}
		})
		.catch((err) => {
			console.log('Error fetching gas.', err)
			return null
		})

	// Stop on error or bug
	if (gas === null || gas.live < 5) return

	twitter.updateLocation(gas)

	const now = new Date()
	const lastTweeted = new Date(
		JSON.parse(fs.readFileSync('./lastTweeted.json'))
	)
	const minsSinceLastTweet = Math.floor((now - lastTweeted) / 1000 / 60)
	const minsToWait = process.env.MINS_BETWEEN_TWEETS - minsSinceLastTweet

	if (minsToWait <= 0 && gas.live <= process.env.TARGET_GAS_PRICE) {
		const timeStr = now.toISOString().slice(11, -5) + ' UTC'

		const tweet = `⛽️ Gas is currently ${
			gas.live
		} gwei (as of ${timeStr}). ${
			gas.hour < gas.live - 4
				? `\n\n⚡️ Expected to drop to ${gas.hour} gwei within the hour`
				: 'Great time to make $ETH transactions!'
		}`

		twitter.tweet(tweet, gas.live)
		fs.writeFileSync('./lastTweeted.json', JSON.stringify(now))
	}
})
