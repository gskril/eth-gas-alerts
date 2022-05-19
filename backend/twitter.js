const Twit = require("twit")

const T = new Twit({
	consumer_key: process.env["CONSUMER_KEY"],
	consumer_secret: process.env["CONSUMER_SECRET"],
	access_token: process.env["ACCESS_TOKEN"],
	access_token_secret: process.env["ACCESS_TOKEN_SECRET"],
})

// Verify valid credentials
T.get("account/verify_credentials")
	.then(res => {
		console.log("Successfully logged into", res.data.screen_name)
	})
	.catch(err => {
		console.log(err.allErrors[0].message, "shutting down")
		process.exit(0)
	})

// Update location
function updateLocation(live, est60) {
	T.post("account/update_profile", { location: `⛽ ${live} gwei  ⏰ Est. ${est60} gwei in the hour` })
		.catch(err => {
			console.log("Error updating twitter location", err)
		})
}

// Tweet
function tweet(msg, gas) {
	T.post("statuses/update", { status: msg })
		.then(data => {
			console.log(`Tweet sent successfully at ${gas} gwei`)
		})
		.catch(err => {
			console.log("Error sending tweet", err)
		})
}

module.exports = { updateLocation, tweet }
