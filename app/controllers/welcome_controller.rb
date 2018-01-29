class WelcomeController < ApplicationController
  def index
  end

  def accept_invitation
    invitation = Invitation.where(token: params[:token]).first!

    membership = Membership.create(
      organization_id: invitation.organization_id,
      user_id: current_user.id,
      role: 'Member'
    )

    invitation.destroy

    redirect_to root

  end
end
