import { Controller } from "./controller.js";
import { Model } from "./model.js";
import { View } from "./view.js";

// возможно обойтись без main, создавать model, view и передавать их в controller, после чего вызывать init() в конструкторе!
class Main {
	static init() {
		console.log("init");
		const view = new View();
		const model = new Model("data/books.json");
		const booksContainer = document.querySelector(".books");
		const preloader = document.querySelector(".preloader");
		const controller = new Controller(
			model,
			view,
			booksContainer,
			preloader
		);
		controller.init();
	}
}

Main.init();
