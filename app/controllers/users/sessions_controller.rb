# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  layout "no_nav", only: [:new, :create]
end
