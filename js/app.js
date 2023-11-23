const result = document.querySelector('#result');
const form = document.querySelector('#form');
const paginationDiv = document.querySelector('#pagination');

const imagesPerPage = 30;
let totalPages;
let iterator;
let currentPage = 1;

window.onload = () => {
	form.addEventListener('submit', validateForm);
};

/**
 * Validates the form input and performs a search for images.
 * @param {Event} evt - The event object.
 */
function validateForm(evt) {
	evt.preventDefault();

	const searchTerm = document.querySelector('#term').value;

	if (searchTerm.trim() === '') {
		showError('Please enter a search term');
		return;
	}

	searchImages();
}

/**
 * Displays an error message on the page.
 *
 * @param {string} msg - The error message to be displayed.
 */
function showError(msg) {
	const alert = document.querySelector('.alert');

	if (!alert) {
		const div = document.createElement('P');
		div.classList.add(
			'bg-red-100',
			'border-red-100',
			'text-red-700',
			'px-4',
			'py-3',
			'rounded',
			'max-w-lg',
			'mx-auto',
			'mt-6',
			'text-center',
			'alert'
		);

		div.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${msg}</span>
        `;

		form.appendChild(div);

		setTimeout(() => {
			div.remove();
		}, 3000);
	}
}


/**
 * Searches for images using the Pixabay API.
 * @returns {Promise<void>} A promise that resolves when the images are fetched and displayed.
 */
async function searchImages() {
	const term = document.querySelector('#term').value;

	const key = '40811969-30a7a3d37c6a7d7c437503f02';
	const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${imagesPerPage}&page=${currentPage}`;

	// fetch(url)
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		totalPages = calculatePages(data.totalHits);
	// 		showImages(data.hits);
	// 	});

	try {
		const response = await fetch(url);
		const data = await response.json();
		totalPages = calculatePages(data.totalHits);
		showImages(data.hits);
	} catch (error) {
		console.log(error);
	}
}

/**
 * Generates a pagination iterator for a given total number.
 *
 * @param {number} total - The total number of pages.
 * @returns {Iterator<number>} - The pagination iterator.
 */
function* pagination(total) {
	for (let i = 1; i <= total; i++) {
		yield i;
	}
}

/**
 * Calculates the number of pages based on the total number of images and the number of images per page.
 * @param {number} total - The total number of images.
 * @returns {number} - The number of pages.
 */
function calculatePages(total) {
	return parseInt(Math.ceil(total / imagesPerPage));
}

/**
 * Displays a collection of images on the webpage.
 *
 * @param {Array} imgs - An array of image objects.
 */
function showImages(imgs) {
	while (result.firstChild) {
		result.removeChild(result.firstChild);
	}

	imgs.forEach(img => {
		const { previewURL, likes, views, largeImageURL } = img;

		result.innerHTML += `
			<div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
				<div class="bg-white">
					<img class="w-full" src="${previewURL}" alt="${likes} likes, ${views} views">
					<div class="p-4">
						<p class="font-bold">${likes} <span class="font-light">Likes</span></p>
						<p class="font-bold">${views} <span class="font-light">Views</span></p>
						<a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">View Image</a>
					</div>
				</div>
			</div>
		`;
	});

	while (paginationDiv.firstChild) {
		paginationDiv.removeChild(paginationDiv.firstChild);
	}

	printIterator();
}

/**
 * Prints the iterator values and creates buttons for each value.
 * @returns {void}
 */
function printIterator() {
	iterator = pagination(totalPages);

	while (true) {
		const { value, done } = iterator.next();

		if (done) return;

		const button = document.createElement('A');
		button.href = '#';
		button.dataset.page = value;
		button.textContent = value;
		button.classList.add(
			'bg-yellow-400',
			'px-4',
			'py-1',
			'mr-2',
			'font-bold',
			'mb-4',
			'rounded'
		);

		button.onclick = () => {
			currentPage = value;
			searchImages();
		};

		paginationDiv.appendChild(button);
	}
}
