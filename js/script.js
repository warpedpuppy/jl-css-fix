
let pokemonRepository = (function () {
	let pokemonList = [],
		apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	
	  function loadList() {
			return fetch(apiUrl).then(function (response) {
				return response.json();
			}).then(function (json) {
				json.results.forEach(function (item) {
					let pokemon = { 
						name: item.name,
						detailsUrl: item.url
					};
					add(pokemon);
				});
			}).catch(function (e) {
				console.error(e);
			})
		}

		function loadDetails(item) {
			let url = item.detailsUrl;
			return fetch(url).then(function (response) {
				return response.json();
			}).then(function (details) {
				item.imageUrl = details.sprites.front_default;
				item.height = details.height;
				item.types = details.types;
			}).catch(function (e) {
				console.error(e);
			});
		}

		function getAll(){
			return pokemonList;
		};
	
		function add(item) {
			if (typeof(item) === 'object' && !Array.isArray(item)) {
				pokemonList.push(item);
			} else {
				document.write(
					'Argument to pokemonList.push() has invalid data type.'
				)
			}
		};
	
		// showDetails() is called when a button is clicked
		function showDetails(button, pokemon) {
			loadDetails(pokemon).then(function () {
				showModal(pokemon.name, pokemon.height,
					pokemon.imageUrl);	// jl: imported from modal demo
			})
		}
	
		function addListItem(pokemon) {	//	appends a list item containing a button to the <ul>
			var pokemonList = document.querySelector('#pokemon-item-list');
			pokemonList.appendChild(createPokemonRow(pokemon));
		}
			
		function createPokemonRow(pokemon) {
			let pokemonRow = document.createElement('div');
			pokemonRow.classList.add('row');
			
			let pokemonIconColumn = createPokemonIconColumn()						
			pokemonIconColumn.appendChild(createButton(pokemon));
			pokemonRow.appendChild(pokemonIconColumn);
			return pokemonRow;
		}
	
		// Define column widths separately for each row containing a Pokémon item
		function createPokemonIconColumn() {
			let pokemonIconColumn = document.createElement('div');
			pokemonIconColumn.classList.add('col-auto');
			pokemonIconColumn.classList.add('col-sm-4');
			pokemonIconColumn.classList.add('col-md-3');
			pokemonIconColumn.classList.add('col-lg-2');
			return pokemonIconColumn;
		}
		
		function createButton(pokemon) { /* Styles: CSS */
			let button = document.createElement('button');
			let typeAttribute = document.createAttribute('type');
			typeAttribute.value = 'button';
			button.setAttributeNode(typeAttribute);
			button.classList.add('btn');
			button.classList.add('btn-outline-secondary');
			button.classList.add('btn-sm');
			button.classList.add('btn-block');
			
			let toggleAttribute = document.createAttribute('data-toggle');
			toggleAttribute.value = 'modal';
			button.setAttributeNode(toggleAttribute);
			let targetAttribute = document.createAttribute('data-target');
			targetAttribute.value = '#showPokemonModal';
			button.setAttributeNode(targetAttribute);
			button.textContent = pokemon.name;
			addListenerToButton(button, pokemon);
			return button;
		}
	
		function addListenerToButton(button, pokemon) {
			button.addEventListener('click', function (event) {
				showDetails(button, pokemon);
			});
		}
		
	return {
		add: add,
		getAll:getAll,
		addListItem:addListItem,
		loadList:loadList,
		loadDetails:loadDetails
	};

	// Add pokemon name, height, image to Bootstrap modal body
	function setBootstrapModalBody(title, text, itsUrl) {
		modalBody = document.querySelector('.modal-body');
		modalBody.innerHTML = 
		'<strong>Name: </strong>' + title + '<br>' +
		'<strong>Height: </strong>' + text + '<br>' + 
		'<strong>Image: </strong>';
		
		// Create and add the image
		let urlElement = document.createElement('img');
		urlElement.src = itsUrl;
		urlElement.classList.add('modals-image');		
		modalBody.appendChild(urlElement);
	}
	
	function showModal(title, text, itsUrl) {
		setBootstrapModalBody(title, text, itsUrl);
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') { hideModal() }
		});
	}
})();	// END scripts copied from demo modal's script.js

// Close modal if user presses Enter
function hideModal() {
	document.querySelector('.close').click();
}

//------------------Body of script-----------------------------------------
pokemonRepository.loadList().then( // Now the data is loaded!
	function() {  
		pokemonRepository.getAll().forEach(function(pokemon){
		pokemonRepository.addListItem(pokemon);
	});
});
