class PokemonTCGCatalog {
  constructor () {
    this.pageSize = 4
    this.currentPage = 1
    this.cards = []
    this.newCards = []

    this.catalog = null
    this.button = null
    this.loader = null
    this.search = null
    this.info = null

    this.API = 'https://api.pokemontcg.io'
    this.API_VERSION = 'v1'
    this.API_RESOURCE = 'cards'

    this.API_ENDPOINT = `${this.API}/${this.API_VERSION}/${this.API_RESOURCE}`

    this.UiSelectors = {
      content: '[data-content]',
      button: '[data-button]',
      loader: '[data-loader]',
      search: 'search',
      card: '[data-card]',
      info: '[data-info]'
    }
  }

  initializeCatalog () {
    this.catalog = document.querySelector(this.UiSelectors.content)
    this.button = document.querySelector(this.UiSelectors.button)
    this.loader = document.querySelector(this.UiSelectors.loader)
    this.search = document.getElementById(this.UiSelectors.search)
    this.info = document.querySelector(this.UiSelectors.info)

    this.addEventListeners()

    this.pullCards()
  }

  addEventListeners () {
    this.button.addEventListener('click', () => this.pullCards())
    this.search.addEventListener('keyup', () => this.filterCards())
  }

  async pullCards () {
    this.loader.hidden = false
    this.button.hidden = true
    const { cards } = await this.fetchData(
      `${this.API_ENDPOINT}?page=${this.currentPage}&pageSize=${this.pageSize}`
    )

    this.loader.hidden = true
    this.button.hidden = false

    this.cards = [...this.cards, ...cards]

    this.newCards = [...cards]

    this.createCatalog(this.newCards)
    this.currentPage++
  }

  async fetchData (url) {
    const response = await fetch(url)
    const parsedResponse = await response.json()

    return parsedResponse
  }

  createCatalog (cards) {
    this.catalog.insertAdjacentHTML('beforeend', [
      cards.map((card) => this.createCard(card)).join('')
    ])
  }

  createCard ({ name, number, imageUrl, supertype, subtype, rarity, id }) {
    return `
      <article class="card" id=${id} data-card>
        <header class="card__header">
          <h2 class="card__heading">
            ${name}
          </h2>
          <p class="card__number">Nr: ${number}</p>
        </header>
        <img class="card__image" src="${imageUrl}" alt="${name}">
        <p class="card__description"><span class="bold">Supertype:</span>
         ${supertype}</p>
        <p class="card__description"><span class="bold">Subtype:</span>
        ${subtype}</p>
        <p class="card__description" ${rarity ? '' : 'hidden'}>
          <span class="bold">Rarity:</span> ${rarity}</p>
      </article>
    `
  }

  filterCards () {
    const searchQuery = this.search.value.toLowerCase()

    searchQuery.length
      ? this.button.hidden = true
      : this.button.hidden = false

    document
      .querySelectorAll(this.UiSelectors.card)
      .forEach(function (el) {
        el.hidden = false
      })

    const filteredCards = this.cards.filter(
      ({ name }) => !name.toLowerCase().includes(searchQuery)
    )

    filteredCards.length === this.cards.length
      ? this.info.hidden = false
      : this.info.hidden = true

    filteredCards.forEach(function ({ id }) {
      document.getElementById(id).hidden = true
    })
  }
}
