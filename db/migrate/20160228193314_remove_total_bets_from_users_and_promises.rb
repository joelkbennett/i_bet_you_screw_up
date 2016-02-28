class RemoveTotalBetsFromUsersAndPromises < ActiveRecord::Migration
  def change
    remove_column :users, :total_bets
    remove_column :promises, :total_bets
  end
end
