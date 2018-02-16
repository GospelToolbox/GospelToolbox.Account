require 'test_helper'

class WelcomeControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "index should require login" do
    get welcome_index_url
    assert_redirected_to new_user_session_url
  end

  test "register and login user" do    
    post user_registration_url, params: { user: { email: 'user@test.gospeltoolbox.org', password: 'test!password1'} }

    assert_redirected_to root_url

    # User should exist but not be confirmed
    user = User.find_by! email: 'user@test.gospeltoolbox.org'
    assert_not_nil user
    assert_nil user.confirmed_at

    # Confirm the user
    user.confirmed_at = Time.now
    user.save

    # Now login
    post user_session_url, params: { user: { email: 'user@test.gospeltoolbox.org', password: 'test!password1'}}
    assert_redirected_to root_url
  end

  test "accept organization invitation" do
    # Given an original user
    userA = User.create(email: 'a@test.gospeltoolbox.org', password: 'test!pass', confirmed_at: Time.now)
    sign_in userA
    
    # and that user has an organization
    post api_v1_organizations_url, params: { name: 'test org'}, xhr: true
    assert_response :success

    org = userA.organizations.find_by! name: 'test org';
    assert_not_nil org

    member = org.memberships.find_by! user_id: userA.id
    assert_not_nil org
    assert_equal 'Administrator', member.role

    # When the source user invites another user to the organization
    post invite_api_v1_organization_url(org), params: { email: 'b@test.gospeltoolbox.org' }, xhr: true
    assert_response :success

    invitation = org.invitations.find_by! email: 'b@test.gospeltoolbox.org'
    assert_not_nil invitation

    sign_out userA

    # And the other user signs in accepts
    userB = User.create(email: 'b@test.gospeltoolbox.org', password: 'test!pass', confirmed_at: Time.now)
    sign_in userB

    get invitation_url, params: { token: invitation.token}
    assert_redirected_to root_url

    # Then the user should now be a member of the organization
    org = userB.organizations.find_by! name: 'test org';
    assert_not_nil org

    member = org.memberships.find_by! user_id: userB.id
    assert_not_nil org
    assert_equal 'Member', member.role

  end

end
