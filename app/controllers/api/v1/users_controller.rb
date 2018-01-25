class Api::V1::UsersController < ApiController
  skip_before_action :verify_authenticity_token

  def update
    @user = User.find(params[:id])
    
    @user.update(updateable_params)
    head :no_content
  end

  private
  def updateable_params
    params.slice(:email, :first_name, :last_name).permit(:email, :first_name, :last_name)
  end
end
