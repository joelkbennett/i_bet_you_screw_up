class AddBetWinnings < ActiveRecord::Migration
  def change
    change_table :bets do |t|
      t.integer :winnings
    end
  end
end
