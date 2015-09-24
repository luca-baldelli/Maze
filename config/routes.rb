Rails.application.routes.draw do
  get '/mazes/random', to: 'mazes#random'
end