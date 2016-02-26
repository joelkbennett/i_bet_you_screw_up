class Promise < ActiveRecord::Base

  belongs_to :user
  has_many :bets, dependent: :destroy

  validates :content, presence: true
  validates :expires_at, presence:true

  validate :expiration_date_cannot_be_in_the_past, if: :expires_at

  DEFAULT_WORTH = 25

  def hours_until_expired
    hours = ((expires_at.to_time - (DateTime.now - 8.hours)) / 1.hours).ceil
    if hours > 0
      "Expires in #{hours} hours!"
    else
      "Expired!"
    end
  end

  private

  def expiration_date_cannot_be_in_the_past
    if expires_at < (DateTime.now - 8.hours)
      errors.add(:expires_at, "can't be in the past")
    end
  end

  def apply_promise_value
    promise.validated ? user.add_points(DEFAULT_WORTH) : user.subtrack_points(DEFAULT_WORTH)
  end
end