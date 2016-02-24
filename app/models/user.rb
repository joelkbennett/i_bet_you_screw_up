class User < ActiveRecord::Base

  has_many :bets
  has_many :promises

  validates :username, presence: true
  validates :password, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: /[A-Za-z0-9\._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}/, message: "only allows valid email" }

  validate :password_complexity

  private
    def password_complexity
      if !password.match(/((?=.*\d)(?=.*[A-Za-z]).{6,20})/)
        errors.add :password, "must include at least one lowercase letter, one uppercase letter, and one digit"
      end
    end

end