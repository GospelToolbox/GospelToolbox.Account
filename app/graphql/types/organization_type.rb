Types::OrganizationType = GraphQL::ObjectType.define do
  name 'Organization'

  field :id, !types.ID
  field :name, !types.String
  field :description, types.String

  field :memberships, !types[Types::MembershipType] do
    resolve -> (obj, args, ctx) { obj.memberships }
  end
end
