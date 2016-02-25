class CreateTables < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.string :password_digest
      t.timestamps null: false
    end

    create_table :promises do |t|
      t.string :content
      t.boolean :validated
      t.date :expires_at
      t.references :user
      t.timestamps null: false
    end

    create_table :bets do |t|
      t.string :bet_value
      t.boolean :in_favour
      t.references :user
      t.references :promise
      t.timestamps null: false
    end
  end
end
