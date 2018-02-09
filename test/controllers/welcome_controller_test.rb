require 'test_helper'

class WelcomeControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "index should require login" do
    get welcome_index_url
    assert_redirected_to new_user_session_url
  end

  test "register and login user" do    
    post user_registration_url, params: { user: { email: 'user@test.com', password: 'test!password1'} }

    assert_redirected_to root_url

    # User should exist but not be confirmed
    user = User.find_by! email: 'user@test.com'
    assert_not_nil user
    assert_nil user.confirmed_at

    # Confirm the user
    user.confirmed_at = Time.now
    user.save

    # Now login
    post user_session_url, params: { user: { email: 'user@test.com', password: 'test!password1'}}
    assert_redirected_to root_url
  end

end
