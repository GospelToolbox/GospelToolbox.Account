Types::MembershipType = GraphQL::ObjectType.define do
  name 'Membership'

  field :role, !types.String

  field :user, Types::UserType do
    resolve -> (obj, args, ctx) { obj.user }
  end

  field :organization, Types::OrganizationType do
    resolve -> (obj, args, ctx) { obj.organization }
  end

end