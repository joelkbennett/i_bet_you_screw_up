class Bet < ActiveRecord::Base

  belongs_to :user
  belongs_to :promise

  validates :user_id, uniqueness: { scope: [:promise_id] }

  def user_name
    User.find(Promise.find(promise_id).user_id).name
  end

  def promise_content
    Promise.find(promise_id).content
  end

end