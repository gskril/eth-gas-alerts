require("dotenv").config()
const axios = require("axios").default
const twitter = require("./twitter")

const minutes = process.env.MINS_BEFORE_STARTING ? process.env.MINS_BEFORE_STARTING : 0
if (minutes == 0) {
	startGasMonitor()
	console.log(`Started gas monitor with target of ${process.env["TARGET_GAS_PRICE"]} gwei`)
} else {
	console.log(`Waiting ${minutes} minutes before checking gas to tweet (${process.env["TARGET_GAS_PRICE"]} gwei target)`)
	setTimeout(() => {
		startGasMonitor()
	}, minutes * 60 * 1000)
}

// Update twitter location with live gas price every 30 secs
setInterval(()=> {
	gasTwitterMonitorConstant()
}, 30*1000)

function startGasMonitor() {
	axios
		.get("https://gas.best/stats")
		.then(res => {
			const liveGas = res.data.pending.fee
			const est60 = res.data.forecast['1 hour']

			if (liveGas <= process.env["TARGET_GAS_PRICE"]) {
				let time = res.headers.date.slice(-12)
				
				// Handle Etherscan bug when it reports 1 gwei
				if (liveGas < 5) return

				let tweet = `⛽️ Gas is currently ${liveGas} gwei (as of ${time}) \n\n${
					est60 < liveGas - 4
						? `⚡️ Expected to drop to ${est60} gwei within the hour`
						: 'Not expected to go much lower within the hour'
				}`
				console.log('\n\n' + tweet)
				twitter.tweet(tweet, liveGas)
				console.log(`Waiting ${process.env["MINS_BETWEEN_TWEETS"]} minutes before checking again`)
				// Wait specified amount of time before checking for gas again
				setTimeout(() => {
					startGasMonitor()
				}, process.env["MINS_BETWEEN_TWEETS"]*60*1000);
			} else {
				// Check gas every minute if it's not below the target
				console.log(`Gas is expensive right now (${liveGas} gwei)`)
				setTimeout(() => {
					startGasMonitor()
				}, 60*1000);
			}
		})
    	.catch(err => {
			console.log("Error fetching data from Etherscan API")
			// Retry on failure
			setTimeout(() => {
				startGasMonitor()
			}, 60*1000);
		})
}

function gasTwitterMonitorConstant() {
	axios
		.get("https://gas.best/stats")
		.then(res => {
			const live = res.data.pending.fee
			const est60 = res.data.forecast['1 hour']

			twitter.updateLocation(live, est60)
		})
    	.catch(err => {
			console.log("Error fetching data from gas.best API")
		})
}
