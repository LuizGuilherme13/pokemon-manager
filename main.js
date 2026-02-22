async function getPokemon() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=60&offset=0"

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`response status: ${response.status}`)
    }

    const result = await response.json()
    console.log(result)

    populateList(result)

  } catch (error) {
    console.error(error.message)
  }
}

function populateList(pokemon) {
  const list = document.getElementById("list")

  for (let i = 0; i < pokemon.results.length; i++) {
    const li = document.createElement("li")
    li.innerText = `${pokemon.results[i].name}`

    list.appendChild(li)
  }
}

function filterByName() {
  const pokemon = document.querySelectorAll("#list li")
  const input = document.getElementById("search")

  console.log(input.value)

  for (let i = 0; i < pokemon.length; i++) {
    if (!pokemon[i].innerText.includes(input.value)) {
      console.log(pokemon[i].innerText)
      pokemon[i].style.display = "none"
    } else {
      pokemon[i].style.display = ""
    }
  }

}

document.addEventListener("keyup", (e) => {
  filterByName()
})

getPokemon()
