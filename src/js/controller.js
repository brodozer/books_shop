export class Controller {
	constructor(model, view, booksContainer, preloader) {
		this.model = model;
		this.view = view;
		this.data = null;
		this.images = null;
		this.cart = [];
		this.booksContainer = booksContainer;
		this.preloader = preloader;
	}

	async init() {
		this.data = await this.model.getData();
		this.images = await this.model.getImages(this.data);
		setTimeout(() => {
			this.preloader.classList.add("d-none");
			this.booksContainer.innerHTML = this.view.getTemplateBooks(
				this.data
			);
		}, 2000);
		// обработчик на books, добавлять книги в cart и менять кол-во возле корзины
		// возможность менять кнопку add to cart на кол-во книг и дать пользователю это менять
	}
}
