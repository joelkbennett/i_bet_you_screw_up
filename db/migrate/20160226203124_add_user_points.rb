class AddUserPoints < ActiveRecord::Migration
  def change
    change_table :users do |t|
      t.integer :points
    end
  end
end
