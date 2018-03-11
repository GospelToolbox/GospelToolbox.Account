# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  layout "no_nav", only: [:new, :create]

  def new
    self.resource = resource_class.new(sign_in_params)
    store_location_for(resource, params[:redirect_to] || session[:user_final_redirect])
    super
  end
end
