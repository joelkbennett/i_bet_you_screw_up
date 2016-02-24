class Bet < ActiveRecord::Base

  belongs_to :user
  belongs_to :promise

  validates :user_id, uniqueness: { scope: [:promise_id] }

end