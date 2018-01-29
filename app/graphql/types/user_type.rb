Types::UserType = GraphQL::ObjectType.define do
  name 'User'

  field :id, !types.ID
  field :first_name, types.String
  field :last_name, types.String
  field :email, !types.String

  field :memberships, !types[Types::MembershipType] do
    resolve -> (obj, args, ctx) { obj.memberships }
  end

end