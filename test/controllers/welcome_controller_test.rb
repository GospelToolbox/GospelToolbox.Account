require 'test_helper'

class WelcomeControllerTest < ActionDispatch::IntegrationTest
  test "index should require login" do
    get welcome_index_url
    assert_redirected_to new_user_session_url
  end

end
