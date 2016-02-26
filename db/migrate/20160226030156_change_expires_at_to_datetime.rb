class ChangeExpiresAtToDatetime < ActiveRecord::Migration
  def change
    change_column(:promises, :expires_at, :datetime)
  end
end
