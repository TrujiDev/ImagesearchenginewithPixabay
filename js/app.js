const result = document.querySelector('#result');
const form = document.querySelector('#form');

const imagesPerPage = 30;
let totalPages;

window.onload = () => {
	form.addEventListener('submit', validateForm);
};

function validateForm(evt) {
	evt.preventDefault();

	const term = document.querySelector('#term').value;

	if (term.trim() === '') {
		showError('Please enter a search term');
		return;
	}

	searchImages(term);
}

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

function searchImages(term) {
	const key = '40811969-30a7a3d37c6a7d7c437503f02';
	const url = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=30`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			totalPages = calculatePages(data.totalHits);
			showImages(data.hits);
		});
}

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
}

function calculatePages(total) {
	return parseInt(Math.ceil(total / imagesPerPage));
}