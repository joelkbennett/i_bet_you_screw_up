class Promise < ActiveRecord::Base

  belongs_to :user
  has_many :bets

  validates :content, presence: true
  validates :expires_at, presence:true

  validate :expiration_date_cannot_be_in_the_past, if: :expires_at

  private
    def expiration_date_cannot_be_in_the_past
      if expires_at < Date.today
        errors.add(:expires_at, "can't be in the past")
      end
    end
end