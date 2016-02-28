class AddTotalBetsToPromises < ActiveRecord::Migration
  def change
    change_table :promises do |t|
      t.integer :total_bets, default: 0
    end
  end
end
