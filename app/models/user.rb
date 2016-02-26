class User < ActiveRecord::Base

  has_secure_password

  has_many :bets, dependent: :destroy
  has_many :promises, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :password_digest, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: /[A-Za-z0-9\._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}/, message: "only allows valid email" }

  before_create :add_initial_points

  INITIAL_POINTS = 100

  # validate :password_complexity

  def name
    first_name.capitalize + " " + last_name.capitalize
  end

  def gravatar
    # hash = Digest::MD5.hexdigest(email)
    # "http://www.gravatar.com/avatar/#{hash}?s=250"
    category = [ 'people', 'food', 'cats', 'city', 'nature', 'abstract', 'fashion', 'animals', 'sports', 'technics', 'nightlife', 'business' ].sample
    "http://lorempixel.com/300/300/" + category
  end

  def promises_kept 
    promises.where(validated: true).count
  end

  def promises_broken
    promises.where(validated: false).count
  end

  def label
    promise_delta = promises_kept - promises_broken
    if promise_delta > 1
      "Promise Keeper"
    elsif promise_delta < 1
      "Oath Breaker"
    else
      "Neutral"
    end
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

  def add_points(value)
    self.points += value
  end

  def subtract_points(value)
    self.points -= value
  end

end