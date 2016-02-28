class Promise < ActiveRecord::Base

  belongs_to :user
  has_many :bets, dependent: :destroy
  has_many :comments

  validates :content, presence: true
  validates :expires_at, presence:true

  validate :expiration_date_cannot_be_in_the_past, if: :expires_at

  DEFAULT_WORTH = 25

  def ordered_comments
    comments.order(created_at: :desc)
  end

  def expired?
    expires_at.to_time - (Time.now - 8*60*60) <= 0
  end

  def hours_until_expired
    time_difference = expires_at.to_time - (Time.now - 8 * 60 * 60)
    hours = (time_difference / (60 * 60))
    minutes = (time_difference / 60)
    if hours >= 1
      "Expires in #{hours.ceil} hours!"
    elsif minutes >= 1
      "Expires in #{minutes.ceil} minutes!"
    elsif time_difference > 0
      "Expires in #{time_difference.ceil} seconds!"
    else  
      "Expired!"
    end
  end

  def self.check_expired
    expired_promises = Promise.where(validated: nil).where('expires_at < ?', DateTime.now - 8.hours)
    if expired_promises[0]
      expired_promises.update_all(validated: false)
      expired_promises.each do |promise| 
        promise.apply_promise_value
      end
    end
  end

  def apply_promise_value
    validated ? user.add_points(DEFAULT_WORTH) : user.subtract_points(DEFAULT_WORTH)
    apply_promise_bets
  end

  def apply_promise_bets
    if validated
      bets.where(in_favour: true).each { |bet| bet.user.add_points(bet.winnings) }
    else
      bets.where(in_favour: false).each { |bet| bet.user.add_points(bet.winnings) }
    end
  end

  def self.count_all
    { kept: Promise.where(validated: true).count,
      broken: Promise.where(validated: false).count }
  end

  private

  def expiration_date_cannot_be_in_the_past
    if expires_at.to_time < (Time.now - 8*60*60)
      errors.add(:expires_at, "can't be in the past")
    end
  end

end