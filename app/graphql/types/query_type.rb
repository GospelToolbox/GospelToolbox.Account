Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :users do
    type types[Types::UserType]
    resolve -> (obj, args, ctx) {
      User.all
    }
  end

  field :user do
    type !Types::UserType
    argument :id, types.ID
    resolve -> (obj, args, ctx) {
      User.find(args[:id] || ctx[:current_user].id)
    }
  end

  field :organizations, !types[Types::OrganizationType] do
    resolve -> (obj, args, ctx) {
      Organization.all
    }
  end

  field :organization do
    type !Types::OrganizationType
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      Organization.find(args[:id])
    }
  end

end
