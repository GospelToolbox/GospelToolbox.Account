Types::UserType = GraphQL::ObjectType.define do
  name 'User'

  field :id, !types.ID
  field :name, !types.String
  field :email, !types.String

  field :memberships, !types[Types::MembershipType] do
    resolve -> (obj, args, ctx) { obj.memberships }
  end

end