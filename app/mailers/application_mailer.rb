class ApplicationMailer < ActionMailer::Base
  default from: 'from@example.com'
  layout 'mailer'

  def organization_invitation(invitation)
    @invitation = invitation
    @organization = Organization.find(invitation.organization_id)
    mail(to: @invitation.email, subject: "Invitation to join #{@organization.name}")
  end
end
