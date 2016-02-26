class AddFriendshipsTable < ActiveRecord::Migration
  def change
    create_table :friendships do |t|
      t.references :user
      t.references :friend
      t.timestamps null: false
    end
  end
end
