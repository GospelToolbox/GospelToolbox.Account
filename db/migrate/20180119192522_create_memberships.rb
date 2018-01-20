class CreateMemberships < ActiveRecord::Migration[5.1]
  def change
    create_table :memberships do |t|
      t.belongs_to :organization, index: true
      t.belongs_to :user, index: true

      t.string :role

      t.timestamps
    end
  end
end
