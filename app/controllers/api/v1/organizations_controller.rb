class Api::V1::OrganizationsController < ApiController
  def index
    render json: current_user.organizations
  end

  def create
    organization = Organization.create(create_params)

    membership = Membership.create(user_id: current_user.id, organization_id: organization.id, role: 'Administrator')
    
    render json: organization
  end

  def invite
    # Create invitation in database

    invitation = Invitation.create(
      email: params[:email], 
      organization_id: params[:id],
      token: generate_token)

    # Send email
    ApplicationMailer.organization_invitation(invitation).deliver_later
  end

  def destroy
    org = Organization.find(params[:id])
    org.invitations.destroy_all
    org.memberships.destroy_all
    org.destroy

    render json: {}, status: :no_content
  end

  private
  def create_params
    params.slice(:name).permit(:name)
  end

  def generate_token
    SecureRandom.base58(24)
  end
end
