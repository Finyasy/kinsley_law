class Appointment < ApplicationRecord
  belongs_to :attorney
  
  validates :name, presence: true
  validates :email, presence: true
  validates :phone, presence: true
  validates :date, presence: true
  validates :time, presence: true
  validates :practice_area, presence: true
  validates :description, presence: true
end
