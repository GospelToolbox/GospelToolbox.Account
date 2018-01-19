require 'json'

class Api::V1::ProfilesController < ApiController
  def show
    render json: current_user
  end
end
