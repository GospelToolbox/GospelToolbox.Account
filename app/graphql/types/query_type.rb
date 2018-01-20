Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :users do
    type types[Types::UserType]
    resolve -> (obj, args, ctx) {
      User.all
    }
  end

  field :user do
    type !Types::UserType
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      User.find(args[:id])
    }
  end

  field :organizations, !types[Types::OrganizationType] do
    resolve -> (obj, args, ctx) {
      Organization.all
    }
  end

end
