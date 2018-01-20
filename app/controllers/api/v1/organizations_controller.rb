class Api::V1::OrganizationsController < ApiController
  def index
    render json: current_user.organizations
  end
end
