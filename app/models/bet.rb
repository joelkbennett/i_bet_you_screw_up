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
    kept = promise.user.promises.promises_kept
    broken = promise.user.promises.promises_broken

    if in_favour
      kept = 1 if kept == 0
      # return bet_value if broken == 0
      self.bet_value = broken == 0 ? bet_value : (broken / kept) * bet_value
    else
      broken = 1 if broken == 0
      # return bet_value if kept == 0
      self.bet_value = kept == 0 ? bet_value : (kept / broken) * bet_value
    end

    # if promise.user.promises_delta < 0
    #   self.bet_value = bet_value * (promise.user.promises_delta.abs * 0.1 + 1)
    # end
  end

end