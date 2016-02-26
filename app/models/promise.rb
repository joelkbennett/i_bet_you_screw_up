class Promise < ActiveRecord::Base

  belongs_to :user
  has_many :bets

  validates :content, presence: true
  validates :expires_at, presence:true

  validate :expiration_date_cannot_be_in_the_past, if: :expires_at

  def hours_until_expired
    time_difference = expires_at.to_time - (Time.now - 8*60*60)
    hours = (time_difference / (60*60))
    minutes = (time_difference / 60)
    if hours >= 1
      "Expires in #{hours.ceil} hours!"
    elsif minutes >= 1
      "Expires in #{minutes.ceil} minutes!"
    else
      "Expired!"
    end
  end

  private
    def expiration_date_cannot_be_in_the_past
      if expires_at.to_time < (Time.now - 8*60*60)
        errors.add(:expires_at, "can't be in the past")
      end
    end
end