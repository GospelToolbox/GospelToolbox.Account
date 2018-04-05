Types::UserType = GraphQL::ObjectType.define do
  name 'User'

  field :id, !types.ID
  field :uuid, types.String
  field :first_name, types.String
  field :last_name, types.String
  field :email, !types.String

  field :memberships, !types[Types::MembershipType] do
    resolve -> (obj, _args, _ctx) { obj.memberships }
  end
end
