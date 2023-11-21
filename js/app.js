const result = document.querySelector('#result');
const form = document.querySelector('#form');

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
	const url = `https://pixabay.com/api/?key=${key}&q=${term}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			showImages(data.hits);
		});
}

function showImages(imgs) {}
