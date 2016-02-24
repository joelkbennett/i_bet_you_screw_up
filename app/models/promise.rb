class Promise < ActiveRecord::Base

  belongs_to :user
  has_many :bets

  validates :content, presence: true
  validates :expires_at, presence:true

end