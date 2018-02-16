Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  post "/graphql", to: "graphql#execute"
  use_doorkeeper
  get 'welcome/index'

  devise_scope :user do
    get '/invitation', to: "welcome#accept_invitation"
  end
  

  devise_for :users, controllers: { 
    sessions: 'users/sessions',
    omniauth_callbacks: 'users/omniauth_callbacks'
  }
  
  namespace :api do
    namespace :v1 do
      resources :users
      resources :organizations do 
        post 'invite', on: :member
      end

      resource :profile, only: :show
    end
  end

  root 'welcome#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
