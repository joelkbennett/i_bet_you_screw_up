class Bet < ActiveRecord::Base

  belongs_to :user
  belongs_to :promise

  validates :user_id, uniqueness: { scope: [:promise_id] }

  before_create :set_winnings, :deduct_user_points 
  before_create :increment_counter_for_promise

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

  def status
    if promise.validated || promise.expired?
      won? ? 'won' : 'lost'
    else
      'active'
    end
  end

  def won?
    in_favour == promise.validated if promise.expired? || !promise.validated.nil?
  end

  def self.count_all
    Bet.all.count
  end

  private

  def deduct_user_points
    user.points -= bet_value
    user.save
  end

  def set_winnings
    kept = promise.user.promises_kept.count.to_f
    broken = promise.user.promises_broken.count.to_f

    if in_favour
      if kept == 0
        return self.winnings = (broken + 1) * bet_value
      end
      self.winnings = (broken == 0) ? bet_value : ((broken / kept) * bet_value).round
    else
      if broken == 0
        return self.winnings = (kept + 1) * bet_value
      end
      self.winnings = (kept == 0) ? bet_value : ((kept / broken) * bet_value).round
    end
  end

  def increment_counter_for_promise
    promise.total_bets += 1
    promise.save
  end

end