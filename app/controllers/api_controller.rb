class ApiController < ApplicationController
  #before_action :doorkeeper_authorize! 

  protected
  def current_user
    @current_user ||= super
    @current_user ||= User.find(doorkeeper_token[:resource_owner_id])
  end
end