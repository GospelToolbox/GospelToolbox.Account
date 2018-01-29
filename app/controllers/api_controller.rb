class ApiController < ApplicationController
  #before_action :doorkeeper_authorize! 
  skip_before_action :verify_authenticity_token

  protected
  def current_user
    @current_user ||= super
    @current_user ||= User.find(doorkeeper_token[:resource_owner_id])
  end
end