const Twit = require('twit')

const T = new Twit({
	consumer_key: process.env['CONSUMER_KEY'],
	consumer_secret: process.env['CONSUMER_SECRET'],
	access_token: process.env['ACCESS_TOKEN'],
	access_token_secret: process.env['ACCESS_TOKEN_SECRET'],
})

// Verify valid credentials
T.get('account/verify_credentials')
	.then((res) => {
		console.log('Successfully logged into', res.data.screen_name)
	})
	.catch((err) => {
		console.log(err.allErrors[0].message, 'shutting down')
		process.exit(0)
	})

// Update location
function updateLocation(gas) {
	T.post('account/update_profile', {
		location: `⛽ ${gas.live} gwei  ⏰ Est. ${gas.hour} gwei in the hour`,
		name: `ETH Gas Alerts (${gas.live} gwei)`,
	}).catch((err) => console.log('Error updating profile', err))
}

// Tweet
function tweet(msg, gas) {
	T.post('statuses/update', { status: msg })
		.then(
			console.log(
				`Tweet sent at ${gas} gwei. Waiting ${process.env.MINS_BETWEEN_TWEETS} mins before trying again`
			)
		)
		.catch((err) => console.log('Error sending tweet', err))
}

module.exports = { updateLocation, tweet }
