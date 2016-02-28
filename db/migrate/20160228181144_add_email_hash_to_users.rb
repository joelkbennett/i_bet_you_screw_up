class AddEmailHashToUsers < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.string :email_hash  
    end
  end
end
