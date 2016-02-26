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

  def hours_until_expired
    time_difference = expires_at.to_time - (Time.now - 8*60*60)
    hours = (time_difference / (60*60))
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
    expired_promises = Promise.where(validated: nil).where('expires_at < ?', DateTime.now)
    if expired_promises
      expired_promises.update_all(validated: false)
      expired_promises.each { |promise| promise.apply_promise_value }
    end
  end

  def apply_promise_value
    validated ? user.add_points(DEFAULT_WORTH) : user.subtract_points(DEFAULT_WORTH)
  end  

  private
    def expiration_date_cannot_be_in_the_past
      if expires_at.to_time < (Time.now - 8*60*60)
        errors.add(:expires_at, "can't be in the past")
      end
    end


end