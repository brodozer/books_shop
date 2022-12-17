export class Model {
	constructor(url) {
		this.url = url;
	}

	async getData() {
		try {
			const response = await fetch(this.url);
			return await response.json();
		} catch (error) {
			console.log(error.message);
		}
	}

	loaderImages(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			const msg = `Could not load image at ${url}`;
			img.onerror = () => reject(new Error(msg));
			img.src = url;
		});
	}

	async getImages(data) {
		const urls = data.map((el) => this.loaderImages(el.imageLink));
		try {
			return await Promise.all(urls);
		} catch (error) {
			console.log(error.message);
		}
	}
}
