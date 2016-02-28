class AddDefaultTotalBetsToPromises < ActiveRecord::Migration
  def change
    change_column_default :users, :total_bets, 0
    change_column_default :promises, :total_bets, 0
  end
end
