class AddDefaultPointsToUser < ActiveRecord::Migration
  def change
    change_column_default :users, :points, 100
  end
end
