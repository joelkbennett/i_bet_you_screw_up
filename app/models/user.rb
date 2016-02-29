class User < ActiveRecord::Base

  has_secure_password

  has_many :bets, dependent: :destroy
  has_many :promises, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :friendships
  has_many :friends, through: :friendships
  has_many :notifications, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :password_digest, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: /[A-Za-z0-9\._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}/, message: "only allows valid email" }

  before_create :add_initial_points
  before_create :generate_image_hash

  INITIAL_POINTS = 100

  # validate :password_complexity

  def name
    first_name.capitalize + " " + last_name.capitalize
  end

  def following_bets
    bets = friends.map { |friend| friend.bets }.flatten!
    ordered_bets = []
    until bets.count == 0
      most_recent = bets[0]
      bets.each { |bet| most_recent = bet if bet.created_at > most_recent.created_at }
      ordered_bets << most_recent
      bets.delete(most_recent)
    end
    ordered_bets
  end

  def following_promises
    promises = friends.map { |friend| friend.promises }.flatten!
    ordered_promises = []
    until promises.count == 0
      most_recent = promises[0]
      promises.each { |promise| most_recent = promise if promise.created_at > most_recent.created_at }
      ordered_promises << most_recent
      promises.delete(most_recent)
    end
    ordered_promises
  end

  def following_activity
    activity = []
    activity << following_promises
    activity << following_bets
    activity.flatten!
    ordered_activity = []
    until activity.count == 0
      most_recent = activity[0]
      activity.each { |event| most_recent = event if event.created_at > most_recent.created_at }
      ordered_activity << most_recent
      activity.delete(most_recent)
    end
    ordered_activity
  end

  def ordered_bets
    bets.order(created_at: :desc)
  end

  def already_bet?(promise_id)
    bets.find_by(promise_id: promise_id, user_id: id)
  end

  def bet_in_favour?(promise_id)
    bets.find_by(promise_id: promise_id, user_id: id, in_favour: true)
  end

  def bet_value(promise_id)
    bets.find_by(promise_id: promise_id, user_id: id).bet_value
  end

  def bets_active
    bets.find_all { |bet| bet.promise.validated == nil }
  end

  def bets_lost
    bets_lost = bets.find_all do |bet| 
      (bet.in_favour && bet.promise.validated == false) || (!bet.in_favour && bet.promise.validated == true)
    end
    # bets_lost.order(created_at: :desc)
  end

  def bets_won
    bets_lost = bets.find_all do |bet| 
      (bet.in_favour && bet.promise.validated == true) || (!bet.in_favour && bet.promise.validated == false)
    end
    # bets_lost.order(created_at: :desc)
  end

  def promises_active
    promises.find_all { |promise| promise.validated == nil }
  end


  def gravatar
    "http://www.gravatar.com/avatar/#{email_hash}?s=250&d=retro"
  end

  def promises_kept 
    promises.where(validated: true)
  end

  def promises_broken
    promises.where(validated: false)
  end

  def label
    promise_delta = promises_kept.count - promises_broken.count
    if promise_delta > 1
      "Promise-Keeper"
    elsif promise_delta < 1
      "Oath-Breaker"
    else
      "Neutral"
    end
  end

  def add_points(value)
    self.points += value
    self.save
  end

  def subtract_points(value)
    self.points -= value
    self.save
  end

  def add_notification(message)
    Notification.create(user_id: id, text: message)
  end

  private
  
  # def password_complexity
  #   if !password.match(/((?=.*\d)(?=.*[A-Za-z]).{6,20})/)
  #     errors.add :password, "must include at least one lowercase letter, one uppercase letter, and one digit"
  #   end
  # end
  
  def add_initial_points 
    self.points = INITIAL_POINTS
  end

  def generate_image_hash
    self.email_hash = Digest::MD5.hexdigest(email)
  end

end