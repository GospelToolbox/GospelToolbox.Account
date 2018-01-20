Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  # Add root-level fields here.
  # They will be entry points for queries on your schema.

  field :users, !types[Types::UserType] do
    resolve -> (obj, args, ctx) {
      User.all
    }
  end

  field :organizations, !types[Types::OrganizationType] do
    resolve -> (obj, args, ctx) {
      Organization.all
    }
  end

end
