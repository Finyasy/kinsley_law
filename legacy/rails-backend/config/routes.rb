Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :attorneys, only: [:index, :show]
      resources :practice_areas, only: [:index, :show]
      resources :appointments, only: [:create]
      resources :contacts, only: [:create]
    end
  end
end