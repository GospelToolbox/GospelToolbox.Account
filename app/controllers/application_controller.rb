class ApplicationController < ActionController::Base
  #include Pundit
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  helper_method :app_version

  protected

  def app_version
    @app_version ||= (ENV['HEROKU_SLUG_COMMIT'] || `git show --pretty=%H`)[0...8]
  end
end
