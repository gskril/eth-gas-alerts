require("dotenv").config()
const axios = require("axios").default
const twitter = require("./twitter")

startGasMonitor()

// Update twitter location with live gas price every minute
setInterval(()=> {
	gasTwitterMonitorConstant()
}, 60*1000)

function startGasMonitor() {
	axios
		.get("https://api.etherscan.io/api", {
			params: {
				module: "gastracker",
				action: "gasoracle",
				apikey: process.env["ETHERSCAN_API_KEY"],
			},
		})
		.then(res => {
			let averageGas = parseInt(res.data.result.ProposeGasPrice)

			if (averageGas <= process.env["TARGET_GAS_PRICE"]) {
				let time = res.headers.date.slice(-12)
				let message
				
				if (averageGas <= 40) {
					message = "Amazing time to make $ETH transactions!"
				} else if (averageGas <= 50) {
					message = "Great time to make $ETH transactions!"
				} else if (averageGas <= 60) {
					message = "Good time to make $ETH transactions!"
				} else if (averageGas <= 80) {
					message = "Not a bad time to make $ETH transactions!"
				} else {
					message = "Consider waiting until prices go down to make your ETH transactions."
				}

				let tweet = `Gas is currently ${averageGas} gwei (as of ${time}). ${message}`
				twitter.tweet(tweet, averageGas)
				console.log(`Waiting ${process.env["MINS_BETWEEN_TWEETS"]} minutes before checking again`)
				// Wait specified amount of time before checking for gas again
				setTimeout(() => {
					startGasMonitor()
				}, process.env["MINS_BETWEEN_TWEETS"]*60*1000);
			} else {
				// Check gas every minute if it's not below the target
				console.log(`Gas is expensive right now (${averageGas} gwei). Checking again in 1 min`)
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
		.get("https://api.etherscan.io/api", {
			params: {
				module: "gastracker",
				action: "gasoracle",
				apikey: process.env["ETHERSCAN_API_KEY"],
			},
		})
		.then(res => {
			let gas = parseInt(res.data.result.ProposeGasPrice)
			twitter.updateLocation(gas)
		})
    	.catch(err => {
			console.log("Error fetching data from Etherscan API")
		})
}
