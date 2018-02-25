class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    create
  end

  def twitter
    create
  end

  def google_oauth2
    create
  end

  private

  def create
    if authentication_exists?
      sign_in_with_existing_authentication
    elsif user_exists?
      create_authentication_and_sign_in
    else
      create_user_and_authentication_and_sign_in
    end
  end

  def user_exists?
    existing_user != nil
  end

  def existing_user
    @existing_user ||= current_user
    @existing_user ||= User
                       .where('email = ?', auth_params['info']['email'])
                       .first
  end

  def authentication_exists?
    existing_auth != nil
  end

  def existing_auth
    @existing_auth ||= auth_provider.user_authentications
                                    .where(uid: auth_params.uid)
                                    .first
  end

  def auth_provider
    @auth_provider ||= AuthenticationProvider
                       .where(name: auth_params.provider)
                       .first
  end

  def auth_params
    request.env['omniauth.auth']
  end

  def sign_in_with_existing_authentication
    sign_in_and_redirect(:user, existing_auth.user)
  end

  def create_authentication_and_sign_in
    UserAuthentication.create_from_omniauth(auth_params, existing_user, auth_provider)
    sign_in_and_redirect(:user, existing_user)
  end

  def create_user_and_authentication_and_sign_in
    user = User.create_from_omniauth(auth_params)
    if user.valid?
      create_authentication_and_sign_in
    else
      flash[:error] = user.errors.full_messages.first
      redirect_to new_user_registration_url
    end
  end
end
