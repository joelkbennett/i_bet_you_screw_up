class AddNotificationToUsers < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.string :text
      t.references :user
      t.timestamps null: false
    end
  end
end
