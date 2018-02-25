class ApiController < ApplicationController
  before_action :doorkeeper_authorize!, unless: :signed_in?
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user!

  protected

  def current_user
    @current_user ||= super
    @current_user ||= User.find(doorkeeper_token[:resource_owner_id])
  end
end
