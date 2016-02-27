class Bet < ActiveRecord::Base

  belongs_to :user
  belongs_to :promise

  validates :user_id, uniqueness: { scope: [:promise_id] }

  before_create :apply_odds_to_bet

  DEFAULT_BET = 10

  def user_name
    User.find(Promise.find(promise_id).user_id).name
  end

  def promise_content
    Promise.find(promise_id).content
  end

  def apply_bet
    in_favour == promise.validated ? user.add_points(bet_value.to_i) : user.subtract_points(bet_value.to_i)
  end

  private

  def apply_odds_to_bet
    if promise.user.promises_delta < 0
      self.bet_value = bet_value * (promise.user.promises_delta.abs * 0.1 + 1)
    end
  end

end