class AddTotalBetsToPromises < ActiveRecord::Migration
  def change
    change_table :promises do |t|
      t.integer :total_bets  
    end
    change_table :users do |t|
      t.integer :total_bets  
    end
  end
end
