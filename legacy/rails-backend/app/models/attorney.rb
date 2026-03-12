class Attorney < ApplicationRecord
  has_many :practice_areas
  has_many :appointments
  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :phone, presence: true
  validates :bio, presence: true
  
  has_one_attached :photo
end
