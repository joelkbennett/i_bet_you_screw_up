class ChangeBetValueToInteger < ActiveRecord::Migration
  def change
    remove_column :bets, :bet_value
    change_table :bets do |t|
      t.integer :bet_value  
    end
  end
end
