class CreateInvitations < ActiveRecord::Migration[5.1]
  def change
    create_table :invitations do |t|
      t.string :token, index: true
      t.references :organization, foreign_key: true
      t.string :role
      t.string :email

      t.timestamps
    end
  end
end
