export class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.data = null;
		this.images = null;
		this.cart = [];
		this.totalQty = 0;
		this.body = document.body;
		this.shoppingCart = this.body.querySelector(".shopping-cart");
		this.subtotal = this.body.querySelector(".subtotal");
		this.btnCart = this.body.querySelector(".btn-cart");
		this.btnCheckout = this.body.querySelector(".btn-checkout");
		this.booksContainer = this.body.querySelector(".books");
		this.preloader = this.body.querySelector(".preloader");
		this.addtoCart = this.addtoCart.bind(this);
	}

	async init() {
		this.data = await this.model.getData();
		this.images = await this.model.getImages(this.data);
		this.booksContainer.innerHTML = this.view.getTemplateBooks(this.data);
		setTimeout(() => {
			this.preloader.classList.add("d-none");
			this.body.classList.remove("scroll-lock");
		}, 2000);
		this.booksContainer.addEventListener("click", this.addtoCart);
		this.btnCart.addEventListener("click", (event) => {
			console.log("cart ", this.cart);
			this.shoppingCart.innerHTML = this.view.getTemplateCartItem(
				this.cart
			);
			this.getSubtotal();
			this.body.classList.add("scroll-lock");
			this.body.querySelector(".cart").classList.remove("d-none");
			if (this.btnCheckout.disabled) {
				this.btnCheckout.disabled = false;
			}
			this.shoppingCart.querySelectorAll("select").forEach((select) => {
				select.addEventListener("change", (e) => {
					this.changeQty(e);
					this.getSubtotal();
				});
			});
			this.shoppingCart.querySelectorAll(".btn-delete").forEach((btn) => {
				btn.addEventListener("click", this.removeCartItem.bind(this));
			});
		});
		// повесить обработчик на корзину
	}

	getQty() {
		this.totalQty = this.cart.reduce((qty, book) => {
			return qty + book.qty;
		}, 0);
		this.btnCart.querySelector(".cart-qty").innerText = this.totalQty;
	}

	getSubtotal() {
		const total = this.cart.reduce((total, book) => {
			return total + book.price * book.qty;
		}, 0);
		this.subtotal.innerText = `Subtotal (${this.totalQty} items): $ ${total}`;
	}

	removeCartItem(e) {
		const target = e.target;
		const id = target.closest(".select-qty").dataset.bookId;
		const deleteId = this.cart.findIndex((book) => book.id == id);
		const cartItem = target.closest(".cart-item");
		this.cart.splice(deleteId, 1);
		console.log("cart ", this.cart);
		cartItem.remove();
		this.getQty();
		this.getSubtotal();
		if (this.cart.length === 0) {
			this.body.querySelector(".cart-title").innerText =
				"Shopping cart is empty";
			this.btnCheckout.disabled = true;
		}
	}

	changeQty(event) {
		const target = event.target;
		const id = target.closest(".select-qty").dataset.bookId;
		this.cart.find((book) => book.id == id).qty = +target.value;
		this.getQty();
	}

	addtoCart(event) {
		const target = event.target;
		if (target.classList.contains("btn-add-to-cart")) {
			if (this.btnCart.disabled) {
				this.btnCart.disabled = false;
			}
			const cardBody = target.closest(".card-body");
			const id = target.dataset.cardId;
			console.log("target ", target);
			console.log("book id ", id);
			const book = this.data[id];
			console.log("book ", book);
			book.qty = 1;
			this.cart.push(book);
			this.getQty();
			target.remove();
			this.addSelect(cardBody, id);
		}
	}

	addSelect(elem, id) {
		console.log("selectId", id);
		elem.insertAdjacentHTML(
			"beforeend",
			this.view.getTemplateSelectBookQty(id)
		);
		elem.querySelector("select").addEventListener(
			"change",
			this.changeQty.bind(this)
		);
	}
	//перенести в класс event.js ???
}
