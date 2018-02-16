require 'test_helper'

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "update user profile" do
    userA = User.create(email: 'a@test.gospeltoolbox.org', password: 'test!pass', confirmed_at: Time.now)
    sign_in userA
    
    patch api_v1_user_url(userA), params: { first_name: 'newFirst', last_name: 'newLast'}, xhr: true
    assert_response :success

    updatedUser = User.find userA.id
    assert_equal 'newFirst', updatedUser.first_name
    assert_equal 'newLast', updatedUser.last_name
    
  end
end
