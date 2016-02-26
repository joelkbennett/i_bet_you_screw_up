class Comment < ActiveRecord::Base

  belongs_to :promise
  belongs_to :user

  def author
    User.find(user_id)
  end

end