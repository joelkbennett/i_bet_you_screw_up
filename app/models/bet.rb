class Bet < ActiveRecord::Base

  belongs_to :user
  belongs_to :promise

  validates :user_id, uniqueness: { scope: [:promise_id] }

  DEFAULT_BET = 10

  def user_name
    User.find(Promise.find(promise_id).user_id).name
  end

  def promise_content
    Promise.find(promise_id).content
  end

  def apply_bet
    in_favour == promise.validated ? user.add_points(bet_value.to_i || DEFAULT_BET) : user.subtrack_points(bet_value.to_i || DEAFULT_BET)
  end

  private

end