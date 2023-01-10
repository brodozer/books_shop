import JustValidate from "just-validate";
import JustValidatePluginDate from "just-validate-plugin-date";

export class Controller {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		this.data = null;
		this.images = null;
		this.cartItems = [];
		this.totalQty = 0;
		this.body = document.body;
		this.shoppingCart = this.body.querySelector(".shopping-cart");
		this.subtotal = this.body.querySelector(".subtotal");
		this.btnCart = this.body.querySelector(".btn-cart");
		this.btnCheckout = this.body.querySelector(".btn-checkout");
		this.booksContainer = this.body.querySelector(".books");
		this.preloader = this.body.querySelector(".preloader");
		this.addtoCart = this.addtoCart.bind(this);
		this.changeQty = this.changeQty.bind(this);
		this.deliveryDate = null;
		this.formCheckboxes = this.body.querySelectorAll('[type="checkbox"]');
		this.validation = null;
		this.configValidation = {
			successFieldCssClass: "is-valid",
			errorFieldCssClass: "is-invalid",
			successLabelCssClass: "valid-feedback",
			errorLabelCssClass: "invalid-feedback",
			focusInvalidField: true,
			validateBeforeSubmitting: true,
		};
		// добавить this.preloaderContent = el
		// добавить кногпку на главную и поставить условие - если нажали, то всегда запускать this.rebindBooks
	}

	async init() {
		// передавать Loading ...
		this.showPreloader(
			'<div class="spinner-border text-primary m-auto" role="status" aria-hidden="true"></div>'
		);
		this.data = await this.model.getData();
		this.images = await this.model.getImages(this.data);
		this.booksContainer.innerHTML = this.view.getTemplateBooks(this.data);
		this.hidePreloader(1000);
		this.booksContainer.addEventListener("click", this.addtoCart);
		this.cart();
		this.checkout();
	}

	showPreloader(text) {
		this.preloader.querySelector(".preloader-content").innerHTML = text;
		this.preloader.classList.remove("d-none");
		this.body.classList.add("scroll-lock");
	}

	hidePreloader(ms) {
		setTimeout(() => {
			this.preloader.classList.add("d-none");
			this.body.classList.remove("scroll-lock");
		}, ms);
	}

	getQty() {
		this.totalQty = this.cartItems.reduce((qty, book) => {
			return qty + book.qty;
		}, 0);
		this.btnCart.querySelector(".cart-qty").innerText = this.totalQty;
	}

	getSubtotal() {
		const total = this.cartItems.reduce((total, book) => {
			return total + book.price * book.qty;
		}, 0);
		this.subtotal.innerText = `Subtotal (${this.totalQty} items): $ ${total}`;
	}

	removecartItems(e) {
		const target = e.target;
		const id = target.closest(".select-qty").dataset.bookId;
		const deleteId = this.cartItems.findIndex((book) => book.id == id);
		const cartItems = target.closest(".cart-item");
		this.cartItems.splice(deleteId, 1);
		console.log("cart ", this.cartItems);
		cartItems.remove();
		this.getQty();
		this.getSubtotal();
		if (this.cartItems.length === 0) {
			this.body.querySelector(".cart-title").innerText =
				"Shopping cart is empty";
			this.btnCheckout.disabled = true;
		}
	}

	changeQty(event) {
		const target = event.target;
		const id = target.closest(".select-qty").dataset.bookId;
		this.cartItems.find((book) => book.id == id).qty = +target.value;
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
			const book = this.data[id];
			book.qty = 1;
			console.log("book ", book);
			this.cartItems.push(book);
			this.getQty();
			target.classList.add("d-none");
			this.addSelect(cardBody, id);
		}
	}

	addSelect(elem, id) {
		console.log("selectId", id);
		elem.insertAdjacentHTML(
			"beforeend",
			this.view.getTemplateSelectBookQty(id)
		);
		elem.querySelector("select").addEventListener("change", this.changeQty);
		console.log("select add listener", elem);
	}

	async sendForm(form) {
		this.showPreloader(
			'<p class="message">"Waiting! Send form data ... "</p>'
		);
		let formData = new FormData(form);
		formData = Object.fromEntries(formData);
		const checked = document.querySelectorAll('[type="checkbox"]:checked');
		const gifts = [];
		checked.forEach((checkbox) => {
			gifts.push(checkbox.value);
		});
		if (gifts.length > 0) {
			formData.gifts = gifts;
		}
		const books = this.cartItems.map((book) => {
			return [book.author, book.title, book.qty, book.price];
			// return {
			// 	author: book.author,
			// 	title: book.title,
			// 	price: book.price,
			// 	qty: book.qty,
			// };
		});
		formData.books = books;
		console.log("form data ", formData);
		let response = await fetch("api/test.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		// try - catch
		if (response.ok) {
			//return await response.json();
			let result = await response.json();
			this.preloader.querySelector(
				".preloader-content"
			).innerHTML = `<p class="message">${result.message}</p>`;
			this.hidePreloader(2000);
			this.rebind();
		} else {
			alert("error");
			this.hidePreloader(0);
		}
		// может быть alert заменить на popup bootstrap!
	}

	checkboxControll(checkboxes, boolean) {
		checkboxes.forEach((checkbox) => {
			if (!checkbox.checked) {
				checkbox.disabled = boolean;
			}
		});
	}

	formValidation() {
		// может быть искать через селектор и потом возвращать длинну коллекции!
		const checkboxChecked = (checkboxes) => {
			let checked = 0;
			checkboxes.forEach((checkbox) => {
				if (checkbox.checked) {
					checked += 1;
				}
			});
			return checked;
		};

		const checkboxLimited = (max) => {
			this.formCheckboxes.forEach((checkbox) => {
				checkbox.addEventListener("change", (e) => {
					const checked = checkboxChecked(this.formCheckboxes);
					console.log("checked ", checked);
					if (checked === max) {
						this.checkboxControll(this.formCheckboxes, true);
					} else {
						this.checkboxControll(this.formCheckboxes, false);
					}
				});
			});
		};

		const getDeliveryDate = () => {
			const today = new Date();
			const tomorrow = new Date(today.setDate(today.getDate() + 1));

			let day = tomorrow.getDate();
			let month = tomorrow.getMonth() + 1;
			const year = tomorrow.getFullYear();
			if (day < 10) {
				day = "0" + day;
			}
			if (month < 10) {
				month = "0" + month;
			}
			this.deliveryDate = `${year}-${month}-${day}`;
		};
		getDeliveryDate();
		checkboxLimited(2);
		this.validation = new JustValidate(".form", this.configValidation);
		this.validation
			.addField("#inputName", [
				{
					rule: "required",
					errorMesssage: "Field is required",
				},
				{
					rule: "minLength",
					value: 4,
					errorMesssage: "Minimum 4 letters",
				},
				{
					rule: "customRegexp",
					value: /^[a-zA-Z]+$/,
					errorMessage: "Input only letters!",
				},
			])
			.addField("#inputSurname", [
				{
					rule: "required",
					errorMesssage: "Field is required",
				},
				{
					rule: "minLength",
					value: 5,
					errorMesssage: "Minimum 5 letters",
				},
				{
					rule: "customRegexp",
					value: /^[a-zA-Z]+$/,
					errorMessage: "Input only letters!",
				},
			])
			.addField("#inputStreet", [
				{
					rule: "required",
					errorMesssage: "Field is required",
				},
				{
					rule: "minLength",
					value: 5,
					errorMesssage: "Minimum 5 symbols",
				},
			])
			.addField("#inputHouseNumber", [
				{
					rule: "required",
					errorMesssage: "Field is required",
				},
				{
					rule: "customRegexp",
					value: /^[0-9]+$/,
					errorMessage: "Input only numbers!",
				},
			])
			.addField("#inputFlatNumber", [
				{
					rule: "required",
					errorMesssage: "Field is required",
				},
				{
					rule: "customRegexp",
					value: /^(\d+[-|\/]?)\d+$/,
					errorMessage: "Only numbers! Example 18-19 or 18/19",
				},
			])
			.addField("#inputDate", [
				{
					plugin: JustValidatePluginDate(() => ({
						required: true,
						isAfterOrEqual: this.deliveryDate, // yyyy-mm-dd
					})),
					errorMessage: `Date should be in after or equal ${this.deliveryDate}`,
				},
			])
			.onSuccess((e) => {
				e.preventDefault();
				console.log("validation success");
				this.sendForm(e.target);
			});
	}

	rebind() {
		this.body.querySelector(".form").reset();
		this.validation.refresh();
		this.checkboxControll(this.formCheckboxes, false);
		this.totalQty = 0;
		this.btnCart.querySelector(".cart-qty").innerText = "0";
		this.btnCart.disabled = true;
		this.cartItems = [];
		console.log("cart ", this.cart);
		this.rebindBooks();
		// лучше через bootstrap modal или любой другой плагин с модалками!
		this.body.querySelector(".checkout").classList.add("d-none");
		this.body.classList.remove("scroll-lock");
	}

	rebindBooks() {
		const selects = this.booksContainer.querySelectorAll(".select-qty");
		if (selects) {
			selects.forEach((select) => {
				const btn = select.previousElementSibling;
				select
					.querySelector("select")
					.removeEventListener("change", this.changeQty);
				console.log("select remove listener ", select);
				select.remove();
				btn.classList.remove("d-none");
			});
		}
	}

	cart() {
		this.btnCart.addEventListener("click", (event) => {
			console.log("cart ", this.cartItems);
			this.shoppingCart.innerHTML = this.view.getTemplateCartItems(
				this.cartItems
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
				btn.addEventListener("click", this.removecartItems.bind(this));
			});
		});
	}

	checkout() {
		this.btnCheckout.addEventListener("click", (event) => {
			this.body.querySelector(".cart").classList.add("d-none");
			this.body.querySelector(".checkout").classList.remove("d-none");
			if (!this.validation) {
				this.formValidation();
			}
		});
	}
}
