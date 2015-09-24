Rails.application.routes.draw do
  get '/maze/random', to: 'maze#random'
end
