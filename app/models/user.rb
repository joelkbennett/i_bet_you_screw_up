class User < ActiveRecord::Base

  has_many :bets
  has_many :promises

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :password, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: /[A-Za-z0-9\._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}/, message: "only allows valid email" }

  validate :password_complexity

  def name
    first_name.capitalize + " " + last_name.capitalize
  end

  def gravitar
    hash = Digest::MD5.hexdigest(email)
    "http://www.gravatar.com/avatar/#{hash}"
  end

  def num_promises_kept
    promises.find_all { |promise| promise.validated }.count
  end

  def num_promises_broken
    promises.find_all { |promise| !promise.validated }.count
  end

  private
  
  def password_complexity
    if !password.match(/((?=.*\d)(?=.*[A-Za-z]).{6,20})/)
      errors.add :password, "must include at least one lowercase letter, one uppercase letter, and one digit"
    end
  end

end