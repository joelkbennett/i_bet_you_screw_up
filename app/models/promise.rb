class Promise < ActiveRecord::Base

  belongs_to :user
  has_many :bets

  validates :content, presence: true
  validates :expires_at, presence:true

  def hours_until_expired
    ((expires_at.to_time - DateTime.now) / 1.hours).ceil
  end

end