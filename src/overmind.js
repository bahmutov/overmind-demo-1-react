import { Overmind } from 'overmind'
import { createConnect } from 'overmind-react'

const overmind = new Overmind({
  state: {
    isLoadingPosts: true,
    showCount: '10',
    posts: [],
    filteredPosts: state => state.posts.slice(0, state.showCount)
  },
  actions: {
    getPosts: async ({ state, effects }) => {
      state.isLoadingPosts = true
      state.posts = await effects.request(
        'https://jsonplaceholder.typicode.com/posts'
      )
      state.isLoadingPosts = false
    },
    changeShowCount: ({ value: event, state }) => {
      state.showCount = event.target.value
    }
  },
  effects: {
    request: async url => {
      const response = await fetch(url)
      return response.json()
    }
  }
})

if (window.Cypress) {
  window.overmind = overmind
  if (window.Cypress.setOvermind) {
    window.Cypress.setOvermind(overmind)
  }
}

export const connect = createConnect(overmind)
