import Mustache from 'mustache';
import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
	name: 'pongpanott',
	refresh_date: new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		timeoneName: 'short',
		timeZone: 'Asia/Bangkok',
	}),
};

async function fetchWeatherInformation() {
	await fetch(
		`https://api.openweathermap.org/data/2.5/weather?q=Chiang Mai&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
	)
		.then((res) => res.json())
		.then((res) => {
			DATA.city_temperature = Math.round(res.main.temp);
			DATA.city_weather = res.weather[0].description;
			DATA.city_weather_icon = res.weather[0].icon;
			DATA.sun_rise = new Date(res.sys.sunrise * 1000).toLocaleTimeString(
				'en-US',
				{ hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' }
			);
			DATA.sun_set = new Date(res.sys.sunset * 1000).toLocaleTimeString(
				'en-Us',
				{ hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' }
			);
		});
}

async function generateReadMe() {
	await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
		if (err) throw err;
		const output = Mustache.render(data.toString(), DATA);
		fs.writeFileSync('README.md', output);
	});
}

async function updateReadme() {
	await fetchWeatherInformation();

	await generateReadMe();
}

updateReadme();
