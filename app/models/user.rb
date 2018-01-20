class User < ApplicationRecord

  has_many :authentications, class_name: 'UserAuthentication', dependent: :destroy

  has_many :memberships
  has_many :organizations, :through => :memberships

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :omniauthable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :lockable, :omniauthable, omniauth_providers: %i[facebook twitter google_oauth2]

  def self.create_from_omniauth(params)
    attributes = {
      email: params['info']['email'],
      password: Devise.friendly_token
    }

    create(attributes)
  end

end
