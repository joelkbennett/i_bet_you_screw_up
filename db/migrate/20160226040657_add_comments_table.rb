class AddCommentsTable < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :body
      t.references :user
      t.references :promise
      t.timestamps null: false
    end
  end
end
