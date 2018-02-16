require 'test_helper'
require 'json'

class Api::V1::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "listing organizations for user" do 
    userA = User.create(email: 'a@test.gospeltoolbox.org', password: 'test!pass', confirmed_at: Time.now)
    sign_in userA
    
    post api_v1_organizations_url, params: { name: 'test org'}, xhr: true
    assert_response :success
    org = JSON.parse(@response.body, symbolize_names: true)

    get api_v1_organizations_url, xhr: true
    assert_response :success
  end

  test "deleting an organization" do 
    userA = User.create(email: 'a@test.gospeltoolbox.org', password: 'test!pass', confirmed_at: Time.now)
    sign_in userA
    
    post api_v1_organizations_url, params: { name: 'test org'}, xhr: true
    assert_response :success
    org = JSON.parse(@response.body, symbolize_names: true)

    delete api_v1_organization_url(org), xhr: true
    assert_response :success
  end
end
