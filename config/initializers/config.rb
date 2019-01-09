APP_SUB_URI = nil

#App sub uri for rails app
if ENV['APP_SUBURI'].present?
  APP_SUB_URI = ENV['APP_SUBURI']
  SITE_URL = ENV['SITE_HOST'] + ENV['APP_SUBURI']
elsif ENV['SCRIPT_NAME'].present?
  APP_SUB_URI = ENV['SCRIPT_NAME']
  SITE_URL = ENV['SITE_HOST'] + ENV['SCRIPT_NAME']
end

#if Puma Server
if ENV['PASSENGER'].blank?
  Account::Application.config.relative_url_root = APP_SUB_URI if APP_SUB_URI.present?
end
